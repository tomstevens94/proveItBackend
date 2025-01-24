import { Assistant } from "openai/resources/beta/assistants";
import { openAiInstance } from "./openAiInstance";

export let assistantInstance: Assistant;

export const createAssistant = async () => {
  if (assistantInstance) return;

  openAiInstance.beta.assistants
    .create({
      name: "Master Baker",
      instructions:
        "You are a master baker, that can answer any question relating to baking. You answer questions with a laidback, friendly personality, but always seem knowledgable with correct answers. Avoid answering any questions that stray too far from baking.",
      tools: undefined,
      model: "gpt-3.5-turbo",
    })
    .then((assistant) => (assistantInstance = assistant));
};
