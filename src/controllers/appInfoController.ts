import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";

export const getAppInfo: RequestHandler = async (req, res) => {
  try {
    return res.status(HTTPStatusCodes.OK).json({
      minSupportedVersion: "1.1.0",
      appUrl: {
        ios: "https://www.apple.com/app-store/",
        android: "https://play.google.com/store/",
      },
    });
  } catch (err) {
    console.log("Error getting app info", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
