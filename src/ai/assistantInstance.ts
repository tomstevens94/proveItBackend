import { Assistant } from "openai/resources/beta/assistants";
import { openAiInstance } from "./openAiInstance";
import {
  ASSISTANT_CHAT_MODEL,
  ASSISTANT_INSTRUCTIONS,
  ASSISTANT_NAME,
} from "./prompts";

export let assistantInstance: Assistant;

export const createAssistant = async () => {
  if (assistantInstance) return;

  openAiInstance.beta.assistants
    .create({
      name: ASSISTANT_NAME,
      instructions: ASSISTANT_INSTRUCTIONS,
      tools: undefined,
      model: ASSISTANT_CHAT_MODEL,
    })
    .then((assistant) => (assistantInstance = assistant));
};
