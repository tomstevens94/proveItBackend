import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import RatedRecipeModel from "../../models/RatedRecipeModel";
import mongoose from "mongoose";

export const postRecipeRating: RequestHandler = async (req, res) => {
  if (!req.body || !req.body.rating || !req.body.recipeId)
    return res.sendStatus(HTTPStatusCodes.BadRequest);

  const { rating, recipeId } = req.body;

  const userId = req.headers["user-id"];
  if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  try {
    // Update existing rating doc if one exists
    await RatedRecipeModel.findOneAndUpdate(
      {
        recipeId: new mongoose.Types.ObjectId(recipeId),
        userId,
      },
      { rating },
      // Below is required to create new doc if it doesnt already exist
      { upsert: true }
    );

    const ratedRecipes = await RatedRecipeModel.find({ userId });

    return res.status(HTTPStatusCodes.Created).json(ratedRecipes);
  } catch (err: any) {
    console.log("Error in ratingsController:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
