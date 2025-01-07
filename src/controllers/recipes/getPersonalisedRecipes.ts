import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import { ObjectId } from "mongodb";
import { findRecipes } from "../../utils/search/recipeSearch";
import SavedRecipeModel from "../../models/SavedRecipeModel";
import RatedRecipeModel from "../../models/RatedRecipeModel";
import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import { createCountCompletedRecipesPipelineStages } from "../../utils/search/createPipelineStages";

export const getPersonalisedRecipes: RequestHandler = async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) {
    console.log("Missing userId");
    return res.sendStatus(HTTPStatusCodes.Unauthorized);
  }

  try {
    const popularRecipesQuery = {
      _id: {
        $in: [
          new ObjectId("6499b754911584d5fc36e2de"),
          new ObjectId("64d4ac735c127f006546f5e8"),
          new ObjectId("66254c062d6bf8083bea281e"),
          new ObjectId("669e21c8c2e6fdd3b23e3012"),
        ],
      },
    };
    const popularRecipes = await findRecipes(popularRecipesQuery);
    const recipeOfTheWeek = await findRecipes({
      _id: new ObjectId("64d4ac735c127f006546f5e8"),
    });
    const createdRecipes = await findRecipes({ createdByUserId: userId });
    const savedRecipes = await SavedRecipeModel.find({ userId });
    const ratedRecipes = await RatedRecipeModel.find({ userId });
    const completedRecipes = await CompletedRecipeModel.aggregate(
      createCountCompletedRecipesPipelineStages(userId as string)
    );

    return res.status(HTTPStatusCodes.OK).json({
      popularRecipes,
      recipeOfTheWeek: recipeOfTheWeek[0],
      createdRecipes,
      savedRecipes,
      ratedRecipes,
      completedRecipes,
    });
  } catch (err: any) {
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
