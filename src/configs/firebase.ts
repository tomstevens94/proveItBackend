import "dotenv/config";
import { AppOptions, credential, ServiceAccount } from "firebase-admin";

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_STORAGE_BUCKET,
} = process.env;

const firebaseServiceAccount: ServiceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  privateKey: FIREBASE_PRIVATE_KEY
    ? JSON.parse(FIREBASE_PRIVATE_KEY.replace("\\n", "\n"))
    : undefined,
  clientEmail: FIREBASE_CLIENT_EMAIL,
};

export const firebaseAppConfig: AppOptions = {
  credential: credential.cert(firebaseServiceAccount),
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
};
