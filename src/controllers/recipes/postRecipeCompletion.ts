import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import mongoose from "mongoose";
import { createCountCompletedRecipesPipelineStages } from "../../utils/search/createPipelineStages";

export const postRecipeCompletion: RequestHandler = async (req, res) => {
  if (!req.body || !req.body.recipeId) {
    console.log("Missing request body or recipeId");
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }

  const userId = req.headers["user-id"];
  if (!userId) {
    console.log("Missing userId");
    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }

  const { recipeId } = req.body;

  console.log("User:", userId, "completed recipe:", recipeId);

  try {
    await CompletedRecipeModel.create({
      userId,
      recipeId: new mongoose.Types.ObjectId(recipeId),
    });

    const completedRecipes = await CompletedRecipeModel.aggregate(
      createCountCompletedRecipesPipelineStages(userId as string)
    );

    return res.status(HTTPStatusCodes.Created).json(completedRecipes);
  } catch (err: any) {
    console.log(err);

    return res.sendStatus(HTTPStatusCodes.NotFound);
  }
};
