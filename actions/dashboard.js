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
Analyze the ${industry} industry for the Indian job market and return ONLY valid JSON.
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

Rules:
- Salary values must be annual compensation in Indian rupees (INR), not USD.
- Use full rupee numbers, for example 600000 for 6 LPA and 1800000 for 18 LPA.
- Include Indian market context, Indian hiring demand, and India-relevant skills.
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

  if (user.industryInsight && new Date(user.industryInsight.nextUpdate) > new Date()) {
    return user.industryInsight;
  }

  let industryInsight = await db.industryInsight.findUnique({
    where: { industry: user.industry },
  });

  if (!industryInsight || new Date(industryInsight.nextUpdate) <= new Date()) {
    const insights = await generateAIInsights(user.industry);
    const updateWindow = {
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    industryInsight = industryInsight
      ? await db.industryInsight.update({
          where: { id: industryInsight.id },
          data: {
            ...insights,
            ...updateWindow,
          },
        })
      : await db.industryInsight.create({
          data: {
            industry: user.industry,
            ...insights,
            ...updateWindow,
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
