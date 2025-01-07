import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import mongoose from "mongoose";
import SavedRecipeModel from "../../models/SavedRecipeModel";

export const toggleRecipeSave: RequestHandler = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.sendStatus(HTTPStatusCodes.BadRequest);

    const userId = req.headers["user-id"];

    const savedRecipeObject = {
      userId,
      recipeId: new mongoose.Types.ObjectId(recipeId),
    };

    const recipeAreadySavedByUser = await SavedRecipeModel.exists(
      savedRecipeObject
    );

    if (recipeAreadySavedByUser) {
      // Unsave recipe
      await SavedRecipeModel.deleteMany(savedRecipeObject);
    } else {
      // Save recipe
      await SavedRecipeModel.create(savedRecipeObject);
    }

    const savedRecipes = await SavedRecipeModel.find({ userId });
    console.log(savedRecipes);

    const statusCode = recipeAreadySavedByUser
      ? HTTPStatusCodes.OK
      : HTTPStatusCodes.Created;
    return res.status(statusCode).json(savedRecipes);
  } catch (err) {
    console.log("Error saving recipe:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
