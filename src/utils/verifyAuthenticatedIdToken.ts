import { UserRecord, getAuth } from "firebase-admin/auth";

export const verifyAuthenticatedIdToken = async (
  idToken: string
): Promise<UserRecord> => {
  try {
    const { userId } = await getAuth().verifyIdToken(idToken);

    return await getAuth().getUser(userId);
  } catch (err) {
    throw err;
  }
};
