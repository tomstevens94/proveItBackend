import { getStorage } from "firebase-admin/storage";

const storage = getStorage();

export const deleteImage = (imageData: {
  downloadUrl: string;
  storageReferencePath: string;
}) => storage.bucket().deleteFiles({ prefix: imageData.storageReferencePath });
