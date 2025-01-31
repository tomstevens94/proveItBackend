import { Socket } from "socket.io";
import { openAiInstance } from "../ai/openAiInstance";

export const onRejoinConversation = async (
  socket: Socket,
  threadId: string
) => {
  const userId = socket.handshake.auth.userId;
  if (!userId || typeof userId !== "string") {
    console.log("Invalid userId");
    socket.disconnect();
    return;
  }

  if (!threadId || typeof threadId !== "string") {
    console.log("Invalid threadId");
    socket.disconnect();
    return;
  }

  socket.handshake.auth.threadId = threadId;

  const messages = await openAiInstance.beta.threads.messages.list(threadId);

  socket.emit(
    "update_messages",
    messages.data.reverse().map((messageResponse) => ({
      user:
        messageResponse.role === "assistant"
          ? { role: "assistant" }
          : { role: "user", userId },
      content: {
        type: "text",
        text: messageResponse.content
          .map((content) => (content.type === "text" ? content.text.value : ""))
          .join(""),
      },
    }))
  );

  console.log("Messages emitted after rejoining");
};
