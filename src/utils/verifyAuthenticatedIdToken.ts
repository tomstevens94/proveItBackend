import { UserRecord, getAuth } from "firebase-admin/auth";

export const verifyAuthenticatedIdToken = async (
  idToken: string
): Promise<UserRecord> => {
  try {
    const { uid } = await getAuth().verifyIdToken(idToken);

    return await getAuth().getUser(uid);
  } catch (err) {
    throw err;
  }
};
