import { Socket } from "socket.io";
import { assistantInstance } from "../ai/assistantInstance";
import { openAiInstance } from "../ai/openAiInstance";
import { getThreadIdFromSocket } from "../utils/socket/getThreadIdFromSocket";
import ChatConversationModel from "../models/ChatConversationModel";
import { v4 as uuidv4 } from "uuid";
import { getNowISO } from "../utils/date";
import { ASSISTANT_CHAT_MODEL, prompts } from "../ai/prompts";

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

    // TODO: Yup validation
    if (typeof payload !== "object") return;

    const messageText = payload?.content?.text;
    if (typeof messageText !== "string") return;

    await openAiInstance.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageText,
    });

    const runPromise = openAiInstance.beta.threads.runs.createAndPoll(
      threadId,
      {
        assistant_id: assistantInstance.id,
      }
    );

    socket.emit("assistant_typing_start");

    const run = await runPromise;

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
      socket.emit("assistant_typing_end");

      if (isNewConversation) {
        const conversationNameCompletion =
          await openAiInstance.chat.completions.create({
            model: ASSISTANT_CHAT_MODEL,
            messages: [
              {
                role: "system",
                content: prompts.GENERATE_CONVERSATION_NAME(messages),
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
      } else {
        await ChatConversationModel.findOneAndUpdate(
          { threadId: threadId },
          { lastUpdatedOn: getNowISO() }
        );

        socket.emit("invalidate_conversations");
      }
    } else {
      console.log(run.status);
    }
  } catch (err) {
    console.log(err);
  }
};
