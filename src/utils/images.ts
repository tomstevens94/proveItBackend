import { getStorage } from "firebase-admin/storage";

export const deleteImage = async (imageData: {
  downloadUrl: string;
  storageReferencePath: string;
}) =>
  getStorage().bucket().deleteFiles({ prefix: imageData.storageReferencePath });
