import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import { minSupportedAppVersion } from "../configs/version";

export const getAppInfo: RequestHandler = async (req, res) => {
  try {
    return res.status(HTTPStatusCodes.OK).json({
      minSupportedVersion: minSupportedAppVersion,
      appUrl: {
        ios: "https://apps.apple.com/gb/app/prove-it/id6475770604",
        android: "https://play.google.com/store/",
      },
    });
  } catch (err) {
    console.log("Error getting app info", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
