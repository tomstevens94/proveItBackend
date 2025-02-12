import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import { minSupportedAppVersion } from "../configs/version";

const getNumberArrayFromVersionString = (
  versionString: string
): [number, number, number] => {
  const versionArr = versionString.split(".").map((e) => Number(e));

  if (versionArr.length !== 3 || versionArr.some((e) => Number.isNaN(e)))
    throw new Error(`Missing values in version: ${versionString}`);

  return versionArr as [number, number, number];
};

const getIsSupported = (appVersion: string) => {
  const [minMajor, minMinor, minPatch] = getNumberArrayFromVersionString(
    minSupportedAppVersion
  );
  const [curMajor, curMinor, curPatch] =
    getNumberArrayFromVersionString(appVersion);

  if (curMajor !== minMajor) return curMajor > minMajor;

  if (curMinor !== minMinor) return curMinor > minMinor;

  return curPatch >= minPatch;
};

class UnsupportedAppVersionError extends Error {
  constructor() {
    super();
    this.name = "UnsupportedAppVersionError";
  }
}

export const checkAppVersion: RequestHandler = (req, res, next) => {
  try {
    const appVersion = req.headers["app-version"];
    // Users on older apps won't have app-version header
    if (!appVersion) {
      return next();
    }
    // if (!appVersion) {
    //   throw new Error("No app version specified in request headers");
    // }

    if (Array.isArray(appVersion)) {
      throw new Error("App version header cannot be an array");
    }

    if (getIsSupported(appVersion)) {
      return next();
    } else {
      return res
        .status(HTTPStatusCodes.BadRequest)
        .json(new UnsupportedAppVersionError());
    }
  } catch (err) {
    console.log("Error getting app info", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
