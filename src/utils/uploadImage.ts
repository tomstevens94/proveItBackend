import axios from "axios";
import "dotenv/config";
import { readFile, unlink } from "node:fs/promises";

const { IMGBB_API_URL, IMGBB_API_KEY } = process.env;

interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
}

export const uploadImage = async ({
  path,
}: Express.Multer.File): Promise<ImgBBResponse> => {
  try {
    const data = await readFile(path);

    const formData = new FormData();
    formData.append("image", data.toString("base64"));

    const result = await axios.post(
      `${IMGBB_API_URL}?key=${IMGBB_API_KEY}`,
      formData
    );
    unlink(path);

    return result.data;
  } catch (err: any) {
    console.log("Error uploading image:", err?.response);
    unlink(path);

    throw err;
  }
};
