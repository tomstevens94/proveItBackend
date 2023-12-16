import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import { getAuth } from "firebase-admin/auth";

export const deleteUserData: RequestHandler = async (req, res) => {
  const uid = req.headers["user-id"] as string;

  if (!uid) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  try {
    const deletedUserData = await UserModel.deleteOne({ uid });

    if (deletedUserData.deletedCount === 1) {
      console.log("User deleted successfully");
    } else return res.sendStatus(HTTPStatusCodes.InternalServerError);

    await getAuth().deleteUser(uid);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error deleting account: ", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

export const getUserData: RequestHandler = async (req, res) => {
  return res.sendStatus(200);
  // const uid = req.headers["user-id"];

  // if (!uid) {
  //   console.log("No userId in request headers - check verification middleware");
  //   return res.sendStatus(HTTPStatusCodes.Unauthorized);
  // }

  // try {
  //   const storedUserData = await UserModel.findOne({ uid });

  //   if (!storedUserData)
  //     return res.sendStatus(HTTPStatusCodes.InternalServerError);

  //   console.log("User data found in db");

  //   return res.status(HTTPStatusCodes.OK).json(storedUserData);
  // } catch (err: any) {
  //   console.log("Error getting user data: ", err);

  //   return res.sendStatus(HTTPStatusCodes.InternalServerError);
  // }
};

export const updateUserData: RequestHandler = async (req, res) => {
  const data = req.body;

  const uid = req.headers["user-id"];

  if (!uid) {
    console.log("No uid in request headers - check verification middleware");
    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }

  try {
    const result = await UserModel.updateOne({ uid }, data);

    if (result.modifiedCount === 0)
      return res.sendStatus(HTTPStatusCodes.NotFound);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error updating user data: ", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
