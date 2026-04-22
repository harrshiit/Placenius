import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "Placenius", // Unique app ID
  name: "Ai carrer coach and guider ",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
