import { openAiInstance } from "./openAiInstance";

export const createThread = async () => {
  return await openAiInstance.beta.threads.create();
};
