import { promises as fs } from "fs";
import path from "path";
import { adminRoleOptions, jobTypeOptions } from "@/data/job-admin-config";

const adminJobsPath = path.join(process.cwd(), "data", "jobs", "admin-jobs.json");

function titleCase(value = "") {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function humanizeSlug(value = "") {
  return value
    .replace(/\.(html|php|aspx?)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\bjobs?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferMetadataFromLink(applyLink, role, type) {
  try {
    const url = new URL(applyLink);
    const hostname = url.hostname.replace(/^www\./, "");
    const hostParts = hostname.split(".");
    const rawCompany = hostParts[0] || "Placenius Partner";
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const slugCandidate =
      pathSegments[pathSegments.length - 1] ||
      pathSegments[pathSegments.length - 2] ||
      "";

    const inferredCompany = titleCase(rawCompany);
    const inferredTitle =
      humanizeSlug(slugCandidate) ||
      `${role} ${type === "Internship" ? "Internship" : "Opportunity"}`;

    return {
      title: inferredTitle,
      company: inferredCompany,
    };
  } catch {
    return {
      title: `${role} ${type === "Internship" ? "Internship" : "Opportunity"}`,
      company: "Placenius Partner",
    };
  }
}

function validateUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function normalizeSkills(skills = []) {
  return Array.from(
    new Set(
      (Array.isArray(skills) ? skills : [])
        .map((skill) => `${skill}`.trim())
        .filter(Boolean)
    )
  );
}

function validateJobInput(data, { partial = false } = {}) {
  const errors = {};

  if (!partial || "applyLink" in data) {
    if (!data.applyLink?.trim()) {
      errors.applyLink = "Job link is required.";
    } else if (!validateUrl(data.applyLink.trim())) {
      errors.applyLink = "Enter a valid http or https link.";
    }
  }

  if (!partial || "role" in data) {
    if (!adminRoleOptions.includes(data.role)) {
      errors.role = "Choose a valid role.";
    }
  }

  if (!partial || "type" in data) {
    if (!jobTypeOptions.includes(data.type)) {
      errors.type = "Choose a valid job type.";
    }
  }

  if (!partial || "skills" in data) {
    const normalizedSkills = normalizeSkills(data.skills);
    if (!normalizedSkills.length) {
      errors.skills = "Select at least one skill.";
    }
  }

  if (!partial || "location" in data) {
    if (!data.location?.trim()) {
      errors.location = "Location is required.";
    }
  }

  return errors;
}

function normalizeStoredJob(input, existingJob = {}) {
  const role = input.role ?? existingJob.role ?? "Frontend";
  const type = input.type ?? existingJob.type ?? "Internship";
  const applyLink = input.applyLink?.trim() ?? existingJob.applyLink ?? "";
  const metadata = inferMetadataFromLink(applyLink, role, type);
  const skills = normalizeSkills(input.skills ?? existingJob.skills ?? []);

  return {
    id: existingJob.id ?? `admin-job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title?.trim() || existingJob.title || metadata.title,
    company: input.company?.trim() || existingJob.company || metadata.company,
    applyLink,
    skills,
    role,
    type,
    location: input.location?.trim() || existingJob.location || "Remote",
    createdAt: existingJob.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function ensureStorage() {
  await fs.mkdir(path.dirname(adminJobsPath), { recursive: true });

  try {
    await fs.access(adminJobsPath);
  } catch {
    await fs.writeFile(adminJobsPath, "[]", "utf-8");
  }
}

export async function readAdminJobs() {
  await ensureStorage();

  try {
    const content = await fs.readFile(adminJobsPath, "utf-8");
    const jobs = JSON.parse(content);
    return Array.isArray(jobs) ? jobs : [];
  } catch {
    return [];
  }
}

async function writeAdminJobs(jobs) {
  await ensureStorage();
  await fs.writeFile(adminJobsPath, JSON.stringify(jobs, null, 2), "utf-8");
}

export async function listAdminJobs() {
  const jobs = await readAdminJobs();
  return jobs.sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export async function createAdminJob(input) {
  const errors = validateJobInput(input);
  if (Object.keys(errors).length) {
    const error = new Error("Invalid job input.");
    error.status = 400;
    error.details = errors;
    throw error;
  }

  const jobs = await readAdminJobs();
  const job = normalizeStoredJob(input);
  jobs.unshift(job);
  await writeAdminJobs(jobs);
  return job;
}

export async function updateAdminJob(id, input) {
  const errors = validateJobInput(input);
  if (Object.keys(errors).length) {
    const error = new Error("Invalid job input.");
    error.status = 400;
    error.details = errors;
    throw error;
  }

  const jobs = await readAdminJobs();
  const index = jobs.findIndex((job) => job.id === id);

  if (index === -1) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  const updatedJob = normalizeStoredJob(input, jobs[index]);
  jobs[index] = updatedJob;
  await writeAdminJobs(jobs);
  return updatedJob;
}

export async function deleteAdminJob(id) {
  const jobs = await readAdminJobs();
  const nextJobs = jobs.filter((job) => job.id !== id);

  if (nextJobs.length === jobs.length) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  await writeAdminJobs(nextJobs);
}

export function toRecommendationJob(job) {
  return {
    ...job,
    requiredSkills: job.requiredSkills ?? job.skills ?? [],
  };
}
