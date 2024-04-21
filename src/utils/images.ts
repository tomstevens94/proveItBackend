import { blurhashFromURL } from "blurhash-from-url";
import { getStorage } from "firebase-admin/storage";

export const deleteImage = async (imageData: {
  downloadUrl: string;
  storageReferencePath: string;
}) =>
  getStorage().bucket().deleteFiles({ prefix: imageData.storageReferencePath });

export const encodedBlurhashFromUrl = async (
  imageUrl: string
): Promise<string> => {
  const output = await blurhashFromURL(imageUrl);
  return output.encoded;
};
