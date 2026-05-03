"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeminiClient } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

// ✅ Correct Gemini initialization
// -------------------------------------------------
// SAVE RESUME
// -------------------------------------------------
export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

// -------------------------------------------------
// GET RESUME
// -------------------------------------------------
export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: { userId: user.id },
  });
}

// -------------------------------------------------
// IMPROVE RESUME WITH AI
// -------------------------------------------------
export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const ai = getGeminiClient();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.

Current content:
"${current}"

Requirements:
1. Use strong action verbs
2. Add metrics and measurable impact where possible
3. Highlight relevant technical skills
4. Keep it concise and ATS-friendly
5. Focus on achievements, not responsibilities
6. Use industry-specific keywords

Return ONLY the improved content as a single paragraph.
`;

  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-flash-latest",
      contents: prompt,
    });

    return response.text?.trim() || current;
  } catch (error) {
    console.error("Error improving resume content:", error);
    throw new Error("Failed to improve content");
  }
}
