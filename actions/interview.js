"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// -------------------------------
//  FIXED MODEL NAME (VERY IMPORTANT)
// -------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3-pro-preview",
});

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
  Generate 10 technical interview questions for a ${user.industry} professional
  ${user.skills?.length ? `with expertise in ${user.skills.join(", ")}` : ""}.

  Each question should be multiple choice with 4 options.

  RETURN STRICT JSON ONLY (no backticks, no markdown):
  {
    "questions": [
      {
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Remove accidental code fencing
    text = text.replace(/```json|```/g, "").trim();

    const data = JSON.parse(text);

    return data.questions;
  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

// -------------------------------------------------
// SAVE QUIZ RESULT
// -------------------------------------------------
export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Prepare question result objects
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter(q => !q.isCorrect);

  let improvementTip = null;

  if (wrongAnswers.length > 0) {
    const wrongText = wrongAnswers
      .map(
        q =>
          `Q: ${q.question}\nCorrect: ${q.answer}\nUser: ${q.userAnswer}`
      )
      .join("\n\n");

    const tipPrompt = `
      The user got these ${user.industry} questions incorrect:

      ${wrongText}

      Give ONE SHORT improvement tip (max 2 sentences).
      Do NOT mention mistakes directly.
    `;

    try {
      const tipResult = await model.generateContent(tipPrompt);
      improvementTip = tipResult.response.text().trim();
    } catch (error) {
      console.error("Error generating tip:", error);
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("❌ Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

// -------------------------------------------------
// GET ASSESSMENTS
// -------------------------------------------------
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    return await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("❌ Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
