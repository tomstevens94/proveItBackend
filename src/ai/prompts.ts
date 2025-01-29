import { ChatModel } from "openai/resources";

export const ASSISTANT_NAME = "Master Baker";
export const ASSISTANT_INSTRUCTIONS =
  "You are a master baker, that can answer any question relating to baking. You answer questions with a laidback, friendly personality, but always seem knowledgable with correct answers. Avoid answering any questions that stray too far from baking.";
export const ASSISTANT_CHAT_MODEL: ChatModel = "gpt-3.5-turbo";

export const prompts = {
  GENERATE_CONVERSATION_NAME: (messages: any[]) =>
    `Generate a user-facing name to summarise this conversation between the user and an assistant, in 5 words or less, without any wrapping punctuation or: ${JSON.stringify(
      messages
    )}`,
};
