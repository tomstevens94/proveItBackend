import OpenAI from "openai";
// import { RequestHandler } from "express";
// import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";

export const sendOpenAiMessage = async (userMessage: string) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    return completion;
    // return res
    //   .status(HTTPStatusCodes.OK)
    //   .json({ response: completion.choices });
  } catch (err) {
    console.log("Error inAI controller", err);
    // return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
