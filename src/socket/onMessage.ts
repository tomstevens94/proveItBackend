import { Socket } from "socket.io";
import { assistantInstance } from "../ai/assistantInstance";
import { openAiInstance } from "../ai/openAiInstance";
import { getThreadIdFromSocket } from "../utils/socket/getThreadIdFromSocket";

export const onMessage = async (socket: Socket, payload: any) => {
  try {
    const threadId = await getThreadIdFromSocket(socket);

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
          userId:
            messageResponse.role === "assistant"
              ? "AI"
              : socket.handshake.auth.userId,
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
    } else {
      console.log(run.status);
    }
  } catch (err) {
    console.log(err);
  }
};
