import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getRecommendedJobs } from "@/services/jobService";

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        skills: true,
        name: true,
        industry: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const recommendations = await getRecommendedJobs(user.skills || [], {
      userId,
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "all",
    });

    return NextResponse.json({
      user: {
        name: user.name,
        industry: user.industry,
        skills: user.skills || [],
      },
      summary: {
        totalJobs: recommendations.totalJobs,
        highMatchCount: recommendations.categories.high.length,
        mediumMatchCount: recommendations.categories.medium.length,
        lowMatchCount: recommendations.categories.low.length,
      },
      jobs: recommendations.jobs.map((job) => ({
        title: job.title,
        company: job.company,
        requiredSkills: job.requiredSkills,
        matchPercentage: job.matchPercentage,
        missingSkills: job.missingSkills,
        applyLink: job.applyLink,
        category: job.category,
        source: job.source,
      })),
      categorizedJobs: recommendations.categories,
      liveJobs: recommendations.liveJobs,
      alerts: recommendations.alerts,
      search: recommendations.search,
      apiStatus: recommendations.apiStatus,
    });
  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended jobs" },
      { status: 500 }
    );
  }
}
