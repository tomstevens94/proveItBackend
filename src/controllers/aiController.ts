import OpenAI from "openai";

export const sendOpenAiMessage = async (userMessage: string) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.3,
    });

    return completion;
  } catch (err) {
    console.log("Error inAI controller", err);
  }
};
