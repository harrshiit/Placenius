import { promises as fs } from "fs";
import path from "path";
import { matchJobToSkills } from "@/services/matcher";

const alertsPath = path.join(process.cwd(), "data", "jobs", "job-alerts.json");
const MATCH_THRESHOLD = 70;

async function ensureStorage() {
  try {
    await fs.access(alertsPath);
  } catch {
    return false;
  }

  return true;
}

async function readAlerts() {
  const storageExists = await ensureStorage();
  if (!storageExists) return [];

  try {
    const content = await fs.readFile(alertsPath, "utf-8");
    const alerts = JSON.parse(content);
    return Array.isArray(alerts) ? alerts : [];
  } catch {
    return [];
  }
}

async function writeAlerts(alerts) {
  try {
    await fs.writeFile(alertsPath, JSON.stringify(alerts, null, 2), "utf-8");
  } catch (error) {
    console.warn("Skipping job alert cache write:", error?.message || error);
  }
}

export async function createJobAlerts({
  userId = "local-user",
  userSkills = [],
  apiJobs = [],
} = {}) {
  if (!apiJobs.length) return [];

  const existingAlerts = await readAlerts();
  const userAlerts = existingAlerts.filter((alert) => alert.userId === userId);
  const newAlerts = apiJobs
    .map((job) => matchJobToSkills(userSkills, job))
    .filter((job) => job.matchPercentage > MATCH_THRESHOLD)
    .filter(
      (job) =>
        !userAlerts.some(
          (alert) =>
            alert.title === job.title &&
            alert.company === job.company &&
            alert.applyLink === job.applyLink
        )
    )
    .map((job) => ({
      id: `job-alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId,
      title: job.title,
      company: job.company,
      applyLink: job.applyLink,
      matchPercentage: job.matchPercentage,
      message: "New high match job found",
      createdAt: new Date().toISOString(),
      read: false,
    }));

  if (newAlerts.length) {
    await writeAlerts([...newAlerts, ...existingAlerts].slice(0, 100));
  }

  return [...newAlerts, ...userAlerts]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5);
}
