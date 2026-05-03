import { Inngest } from "inngest";

const geminiCredentials = process.env.GEMINI_API_KEY
  ? {
      credentials: {
        gemini: {
          apiKey: process.env.GEMINI_API_KEY,
        },
      },
    }
  : {};

export const inngest = new Inngest({
  id: "Placenius",
  name: "AI career coach and guider",
  ...geminiCredentials,
});
