import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getRecommendedJobs } from "@/services/jobService";
import { getUserOnboardingStatus } from "@/actions/user";
import JobRecommendationsView from "./_components/job-recommendations-view";

export default async function JobRecommendationsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      name: true,
      industry: true,
      skills: true,
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const recommendations = await getRecommendedJobs(user.skills || [], {
    userId,
    query: resolvedSearchParams?.query || "",
    category: resolvedSearchParams?.category || "all",
  });

  return (
    <div className="container mx-auto py-6">
      <JobRecommendationsView
        user={user}
        recommendations={recommendations}
      />
    </div>
  );
}
