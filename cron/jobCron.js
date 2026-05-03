// Phase 1 scaffold: install `node-cron` before enabling this scheduler in runtime.
// Example later usage:
// import { startJobRecommendationCron } from "@/cron/jobCron";
// startJobRecommendationCron();

import { getRecommendedJobs } from "@/services/jobService";
import { notifyHighMatchJobs } from "@/services/notificationService";

export async function runJobRecommendationCycle(userSkills = []) {
  const recommendations = await getRecommendedJobs(userSkills);
  const highMatchJobs = recommendations.jobs.filter(
    (job) => job.matchPercentage > 70
  );

  await notifyHighMatchJobs(highMatchJobs);

  return recommendations;
}

export async function startJobRecommendationCron() {
  const cron = await import("node-cron");

  return cron.default.schedule("0 */6 * * *", async () => {
    // This scaffold intentionally skips user iteration and email delivery in phase 1.
    await runJobRecommendationCycle([]);
  });
}
