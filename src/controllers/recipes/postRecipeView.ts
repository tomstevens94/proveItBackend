import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import RecipeViewModel from "../../models/RecipeViewModel";

export const postRecipeView: RequestHandler = async (req, res) => {
  try {
    const { recipeId } = req.body;

    const userId = req.headers["user-id"];
    if (!userId) {
      console.log("Missing userId");
      return res.sendStatus(HTTPStatusCodes.Unauthorized);
    }

    await RecipeViewModel.create({ userId, recipeId });

    return res.sendStatus(HTTPStatusCodes.Created);
  } catch (err) {
    console.log(err);
    return res
      .status(HTTPStatusCodes.InternalServerError)
      .json("Unable to log recipe view");
  }
};
