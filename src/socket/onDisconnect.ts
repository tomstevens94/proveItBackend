import { DisconnectReason, Socket } from "socket.io";

export const onDisconnect = (
  socket: Socket,
  disconnectReason: DisconnectReason
) => {
  console.log(
    socket.handshake.auth.userId,
    " disconnected: ",
    disconnectReason
  );
};
