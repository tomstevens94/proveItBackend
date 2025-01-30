import { Socket } from "socket.io";
import { createThread } from "../../ai/thread";

export const getThreadIdFromSocket = async (
  socket: Socket,
  options?: { new: boolean }
) => {
  const existingThreadId = socket.handshake.auth.threadId;

  if (
    options?.new ||
    !existingThreadId ||
    typeof existingThreadId !== "string"
  ) {
    const newThread = await createThread();

    socket.handshake.auth.threadId = newThread.id;

    return newThread.id;
  } else {
    console.log("Using existing Thread ID");
    return existingThreadId;
  }
};
