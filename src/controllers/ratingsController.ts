import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import UserModel from "../models/UserModel";

export const postRecipeRating: RequestHandler = async (req, res) => {
  if (!req.body) return res.sendStatus(HTTPStatusCodes.BadRequest);

  const { rating, recipeId } = req.body;

  // Rating should always be above 0 (1-5)
  if (!rating || !recipeId) return res.sendStatus(HTTPStatusCodes.BadRequest);

  const userId = req.headers["user-id"];

  console.log(
    "User:",
    userId,
    "rated recipe:",
    recipeId,
    "with rating of:",
    rating
  );

  try {
    const existingUser = await UserModel.findOne({ uid: userId });

    if (!existingUser)
      return res.sendStatus(HTTPStatusCodes.InternalServerError);

    const existingRatings = existingUser.ratedRecipes;

    const existingRatingIndex = existingRatings.findIndex(
      (rating) => rating.recipeId === recipeId
    );

    if (existingRatingIndex !== -1)
      existingRatings.splice(existingRatingIndex, 1);

    existingRatings.push({ recipeId, rating });

    existingUser.save();

    return res.sendStatus(HTTPStatusCodes.Created);
  } catch (err: any) {
    console.log("Error in ratingsController:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
