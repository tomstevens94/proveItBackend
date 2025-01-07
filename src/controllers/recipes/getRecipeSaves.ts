import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import SavedRecipeModel from "../../models/SavedRecipeModel";

export const getRecipeSaves: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

    const savedRecipes = await SavedRecipeModel.find({ userId });

    return res.status(HTTPStatusCodes.OK).json(savedRecipes);
  } catch (err) {
    console.log("Error getting saved recipes", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
