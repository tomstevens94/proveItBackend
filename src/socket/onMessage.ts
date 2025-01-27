import { Socket } from "socket.io";
import { assistantInstance } from "../ai/assistantInstance";
import { openAiInstance } from "../ai/openAiInstance";
import { getThreadIdFromSocket } from "../utils/socket/getThreadIdFromSocket";
import ChatConversationModel from "../models/ChatConversationModel";
import { v4 as uuidv4 } from "uuid";
import { getNowISO } from "../utils/date";

export const onMessage = async (socket: Socket, payload: any) => {
  try {
    const userId = socket.handshake.auth.userId;

    if (!userId || typeof userId !== "string") {
      console.log("Invalid userId");
      socket.disconnect();
      return;
    }

    const threadId = await getThreadIdFromSocket(socket);
    const existingMessagesWithinThread =
      await openAiInstance.beta.threads.messages.list(threadId);

    const isNewConversation = existingMessagesWithinThread.data.length === 0;

    console.log("Message received: ", payload);

    // TODO: Payload validation

    await openAiInstance.beta.threads.messages.create(threadId, {
      role: "user",
      content: payload.content.text,
    });

    const run = await openAiInstance.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantInstance.id,
    });

    if (run.status === "completed") {
      const messagesResponse = await openAiInstance.beta.threads.messages.list(
        run.thread_id
      );

      const messages = messagesResponse.data
        .reverse()
        .map((messageResponse) => ({
          user:
            messageResponse.role === "assistant"
              ? { role: "assistant" }
              : { role: "user", userId: socket.handshake.auth.userId },
          content: {
            type: "text",
            text: messageResponse.content
              .map((content) =>
                content.type === "text" ? content.text.value : ""
              )
              .join(""),
          },
        }));
      socket.emit("update_messages", messages);

      if (isNewConversation) {
        // Generate conversation name
        // // Create and store new conversation
        const conversationNameCompletion =
          await openAiInstance.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `Generate a user-facing name to summarise this conversation between the user and an assistant, in 5 words or less, without any wrapping punctuation or: \n\n${JSON.stringify(
                  messages
                )}`,
              },
            ],
          });

        const conversationName =
          conversationNameCompletion.choices[0].message.content;

        const newConversation = {
          id: uuidv4(),
          threadId,
          name: conversationName,
          createdOn: getNowISO(),
          lastUpdatedOn: getNowISO(),
          usersData: [{ userId }, { userId: "assistant" }],
        };

        await ChatConversationModel.create(newConversation);

        socket.emit("invalidate_conversations");
      }
    } else {
      console.log(run.status);
    }
  } catch (err) {
    console.log(err);
  }
};
