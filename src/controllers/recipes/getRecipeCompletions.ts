import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import { createCountCompletedRecipesPipelineStages } from "../../utils/search/createPipelineStages";

export const getRecipeCompletions: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

    console.log("Getting completed recipes", userId);

    const completedRecipes = await CompletedRecipeModel.aggregate(
      createCountCompletedRecipesPipelineStages(userId as string)
    );

    return res.status(HTTPStatusCodes.OK).json(completedRecipes);
  } catch (err) {
    console.log("Error getting completed recipes", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
