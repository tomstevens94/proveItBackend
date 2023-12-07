import 'dotenv/config';
import { credential, ServiceAccount } from 'firebase-admin';

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } =
  process.env;

const firebaseServiceAccount: ServiceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  privateKey: FIREBASE_PRIVATE_KEY,
  clientEmail: FIREBASE_CLIENT_EMAIL,
};

export const firebaseAppConfig = {
  credential: credential.cert(firebaseServiceAccount),
  projectId: FIREBASE_PROJECT_ID,
};
