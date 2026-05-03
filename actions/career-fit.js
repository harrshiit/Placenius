"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { analyzeCareerFit } from "@/lib/career-fit";

export async function getCareerFitAnalysis() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { resume: true },
  });

  if (!user) throw new Error("User not found");

  return {
    user: {
      name: user.name,
      industry: user.industry,
      experience: user.experience ?? 0,
      bio: user.bio ?? "",
      skills: user.skills ?? [],
      resumeContent: user.resume?.content ?? "",
    },
    analysis: analyzeCareerFit({
      profileSkills: user.skills ?? [],
      resumeContent: user.resume?.content ?? "",
    }),
  };
}
