import OpenAI from "openai";

export const openAiInstance = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});
