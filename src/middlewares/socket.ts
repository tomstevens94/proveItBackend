import { ExtendedError, Socket } from "socket.io";
import { verifyAuthenticatedIdToken } from "../utils/verifyAuthenticatedIdToken";
import UserModel from "../models/UserModel";

export const verifySocketAuthentication = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const idToken = socket.handshake.auth.idToken;
    if (!idToken) {
      throw new Error("No ID token within socket handshake");
    }

    const userRecord = await verifyAuthenticatedIdToken(idToken);
    const { uid: userId } = userRecord;

    const existingUser = await UserModel.exists({ userId });

    if (existingUser) {
      socket.handshake.auth.userId = userId;
      console.log("Web socket authentication confirmed");
      return next();
    } else {
      throw new Error("User not found");
    }
  } catch (err: any) {
    return next(new Error(`Unable to verify IDToken within socket - ${err}`));
  }
};
