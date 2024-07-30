import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import UserModel from "../models/UserModel";
import { verifyAuthenticatedIdToken } from "../utils/verifyAuthenticatedIdToken";

export const verifyAuthentication: RequestHandler = async (req, res, next) => {
  console.log("Attempting to verify authentication");

  const idToken = req.headers.authorization;

  // Apple required users to not have to reenter name after sign in
  // TODO: Replace this middleware with an actual 'createAccountController'
  // This works but is not good
  const appleFullNameHeader = req.headers.applefullname;
  const appleFullName =
    appleFullNameHeader && typeof appleFullNameHeader === "string"
      ? JSON.parse(appleFullNameHeader)
      : undefined;

  if (!idToken) {
    console.log("Unable to verify - No ID token supplied in request");
    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }

  try {
    const userRecord = await verifyAuthenticatedIdToken(idToken);
    const { uid: userId } = userRecord;

    const existingUser = await UserModel.exists({ userId });

    if (existingUser) {
      console.log("Verified existing user");
    } else {
      console.log("New user, attempting to create in db");

      const userPayload = {
        userId,
        completedRecipes: [],
        ratedRecipes: [],
        photoUrl: userRecord.photoURL,
        displayName: userRecord.displayName,
        firstName: appleFullName?.firstName,
        lastName: appleFullName?.lastName,
      };

      await UserModel.create(userPayload);

      console.log("New user created with ID:", userId);
    }

    req.headers["user-id"] = userId;

    return next();
  } catch (err: any) {
    console.log(err, "Unable to verify IDToken");

    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }
};
