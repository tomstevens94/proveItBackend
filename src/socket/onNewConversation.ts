import { Socket } from "socket.io";

export const onNewConversation = async (socket: Socket) => {
  try {
    const userId = socket.handshake.auth.userId;
    if (!userId || typeof userId !== "string") {
      console.log("Invalid userId");
      socket.disconnect();
      return;
    }

    delete socket.handshake.auth.threadId;

    socket.emit("update_messages", []);
  } catch (err) {
    console.log(err);
  }
};
