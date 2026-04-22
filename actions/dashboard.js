"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "models/gemini-flash-latest";

export async function generateAIInsights(industry) {
  const prompt = `
Analyze the ${industry} industry and return ONLY valid JSON.
NO markdown, NO backticks, NO extra text.

{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let text = response.text || "";
  text = text.replace(/```(?:json)?/g, "").trim();

  return JSON.parse(text);
}

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user || !user.industry) {
    throw new Error("User profile incomplete");
  }

  if (user.industryInsight) {
    return user.industryInsight;
  }

  let industryInsight = await db.industryInsight.findUnique({
    where: { industry: user.industry },
  });

  if (!industryInsight) {
    const insights = await generateAIInsights(user.industry);

    industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      industryInsightId: industryInsight.id,
    },
  });

  return industryInsight;
}
