import { promises as fs } from "fs";
import path from "path";
import mockJobs from "@/data/jobs/mock-jobs.json";
import { readAdminJobs, toRecommendationJob } from "@/services/adminJobService";
import { createJobAlerts } from "@/services/jobAlertService";
import { fetchApiJobs } from "@/services/jobApiService";
import { hasSafeApplyLink } from "@/lib/job-links";
import { groupJobsByCategory, matchJobToSkills, sortJobsByMatch } from "@/services/matcher";

const matchedJobsPath = path.join(process.cwd(), "data", "jobs", "matched-jobs.json");

export async function fetchJobs({ query = "", category = "all" } = {}) {
  const adminJobs = await readAdminJobs();
  const apiResult = await fetchApiJobs({ query, category, limit: 10 });

  return {
    adminJobs: adminJobs.map((job) => ({
      ...toRecommendationJob(job),
      source: "admin",
    })),
    mockJobs: mockJobs.map((job) => ({
      ...toRecommendationJob(job),
      source: "mock",
    })),
    apiJobs: apiResult.jobs.map(toRecommendationJob),
    apiStatus: apiResult.status,
  };
}

export async function getRecommendedJobs(userSkills = [], options = {}) {
  const { userId, query = "", category = "all" } = options;
  const { adminJobs, mockJobs, apiJobs, apiStatus } = await fetchJobs({
    query,
    category,
  });
  const safeAdminJobs = adminJobs.filter(hasSafeApplyLink);
  const safeMockJobs = mockJobs.filter(hasSafeApplyLink);
  const safeApiJobs = apiJobs.filter(hasSafeApplyLink);
  const jobs = [...safeAdminJobs, ...safeMockJobs, ...safeApiJobs.slice(0, 5)];
  const matchedJobs = sortJobsByMatch(
    jobs.map((job) => matchJobToSkills(userSkills, job))
  );
  const liveJobs = sortJobsByMatch(
    safeApiJobs.map((job) => matchJobToSkills(userSkills, job))
  ).slice(0, 10);
  const alerts = await createJobAlerts({
    userId,
    userSkills,
    apiJobs: safeApiJobs,
  });

  await saveMatchedJobs(matchedJobs);

  return {
    totalJobs: matchedJobs.length,
    categories: groupJobsByCategory(matchedJobs),
    jobs: matchedJobs,
    liveJobs,
    alerts,
    search: {
      query,
      category,
    },
    apiStatus,
  };
}

export async function saveMatchedJobs(matchedJobs = []) {
  await fs.mkdir(path.dirname(matchedJobsPath), { recursive: true });
  await fs.writeFile(
    matchedJobsPath,
    JSON.stringify(matchedJobs, null, 2),
    "utf-8"
  );
}

export async function readSavedMatchedJobs() {
  try {
    const content = await fs.readFile(matchedJobsPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}
