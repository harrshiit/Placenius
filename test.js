import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: "Explain how AI works in one sentence",
  });

  console.log(response.text);
}

main().catch(console.error);
