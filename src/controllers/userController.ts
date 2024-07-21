import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import { getAuth } from "firebase-admin/auth";
import RecipeModel from "../models/InternalRecipeModel";
import RatedRecipeModel from "../models/RatedRecipeModel";
import SavedRecipeModel from "../models/SavedRecipeModel";

export const deleteUserData: RequestHandler = async (req, res) => {
  const userId = req.headers["user-id"] as string;
  if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  try {
    const deletedRecipes = await RecipeModel.deleteMany({ userId });
    const deletedRatedRecipes = await RatedRecipeModel.deleteMany({ userId });
    const deletedSavedRecipes = await SavedRecipeModel.deleteMany({ userId });
    const deletedUserData = await UserModel.deleteOne({ userId });

    if (deletedUserData.deletedCount === 1) {
      console.log("User deleted successfully");
    } else return res.sendStatus(HTTPStatusCodes.InternalServerError);

    console.log(`Deleted ${deletedRecipes.deletedCount} recipes`);
    console.log(`Deleted ${deletedRatedRecipes.deletedCount} recipe ratings`);
    console.log(`Deleted ${deletedSavedRecipes.deletedCount} recipe saves`);

    // Delete user data from firebase auth
    await getAuth().deleteUser(userId);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error deleting account:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

export const getUserData: RequestHandler = async (req, res) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    console.log("No userId in request headers - check verification middleware");
    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }

  try {
    const storedUserData = await UserModel.findOne({ userId });

    if (!storedUserData) return res.sendStatus(HTTPStatusCodes.NotFound);

    console.log("User data found in db");

    return res.status(HTTPStatusCodes.OK).json(storedUserData);
  } catch (err: any) {
    console.log("Error getting user data:", err);

    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

export const updateUserData: RequestHandler = async (req, res) => {
  const data = req.body;

  const userId = req.headers["user-id"];

  if (!userId) {
    console.log("No userId in request headers - check verification middleware");
    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }

  try {
    const result = await UserModel.updateOne({ userId }, data);

    if (result.modifiedCount === 0)
      return res.sendStatus(HTTPStatusCodes.NotFound);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error updating user data:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
