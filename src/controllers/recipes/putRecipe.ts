import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import { ObjectId } from "mongodb";
import InternalRecipeModel from "../../models/InternalRecipeModel";
import { findRecipes } from "../../utils/search/recipeSearch";

export const putRecipe: RequestHandler = async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  const updatedRecipe = req.body;
  if (!updatedRecipe) return res.sendStatus(HTTPStatusCodes.BadRequest);

  try {
    const recipeFilter = {
      _id: new ObjectId(updatedRecipe._id),
    };

    const existingRecipe = await InternalRecipeModel.findOne(recipeFilter);
    if (existingRecipe === null)
      return res.sendStatus(HTTPStatusCodes.NotFound);

    if (existingRecipe.createdByUserId !== userId)
      return res
        .sendStatus(HTTPStatusCodes.BadRequest)
        .json({ message: "User ID does not match the recipe user ID" });

    const updateResult = await InternalRecipeModel.findOneAndUpdate(
      recipeFilter,
      updatedRecipe
    );

    if (!updateResult) {
      return res.sendStatus(HTTPStatusCodes.NotFound);
    }

    const queriedRecipes = await findRecipes({ _id: updateResult._id });
    if (queriedRecipes.length !== 1) {
      return res.sendStatus(HTTPStatusCodes.InternalServerError);
    }

    return res.status(HTTPStatusCodes.OK).json(queriedRecipes[0]);
  } catch (err: any) {
    console.log("Error in ratingsController:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
