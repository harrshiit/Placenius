import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { getGeminiClient } from "@/lib/gemini";

// ✅ Correct Gemini initialization
export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
    triggers: [{ cron: "0 0 * * 0" }],
  },
  async ({ step }) => {
    const ai = getGeminiClient();
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
Analyze the current state of the ${industry} industry for the Indian job market and return insights in ONLY the following JSON format.
Do NOT add markdown, comments, or explanations.

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
- Include at least 5 roles
- Growth rate must be a percentage
- Include at least 5 skills and trends
- Salary values must be annual compensation in Indian rupees (INR), not USD
- Use full rupee numbers, for example 600000 for 6 LPA and 1800000 for 18 LPA
- Include Indian market context, Indian hiring demand, and India-relevant skills
- Output ONLY valid JSON
`;

      // ✅ Inngest + Gemini integration (CORRECT)
      const response = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await ai.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: p,
          });
        },
        prompt
      );

      // ✅ Safe text extraction
      const rawText = response.text || "";
      const cleanedText = rawText.replace(/```(?:json)?/g, "").trim();

      let insights;
      try {
        insights = JSON.parse(cleanedText);
      } catch (err) {
        console.error(`Invalid JSON for industry: ${industry}`, cleanedText);
        continue; // skip this industry safely
      }

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
