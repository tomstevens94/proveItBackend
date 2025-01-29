import { Socket } from "socket.io";
import { onMessage } from "./onMessage";
import { onDisconnect } from "./onDisconnect";
import { createAssistant } from "../ai/assistantInstance";
import { onRejoinConversation } from "./onRejoinConversation";
import { onNewConversation } from "./onNewConversation";

export const onConnection = async (socket: Socket) => {
  const userId = socket.handshake.auth.userId;

  if (!userId || typeof userId !== "string") {
    console.log("Invalid userId");
    socket.disconnect();
    return;
  }

  await createAssistant();

  console.log("UserID: ", userId, " connected");

  socket.on("message", (message) => onMessage(socket, message));
  socket.on("rejoin_conversation", (threadId) =>
    onRejoinConversation(socket, threadId)
  );
  socket.on("new_conversation", () => onNewConversation(socket));
  socket.on("disconnect", (disconnectReason) =>
    onDisconnect(socket, disconnectReason)
  );
};
