import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import { encodedBlurhashFromUrl } from "../../utils/images";
import { findRecipes } from "../../utils/search/recipeSearch";
import InternalRecipeModel from "../../models/InternalRecipeModel";

export const postRecipe: RequestHandler = async (req, res) => {
  try {
    let recipe = req.body;
    if (!recipe) return res.sendStatus(HTTPStatusCodes.BadRequest);

    const userId = req.headers["user-id"];

    recipe.createdByUserId = userId;

    recipe.images = await Promise.all(
      recipe.images.map(async (imageData: any) => {
        if (!imageData.downloadUrl) return imageData;

        const blurhash = await encodedBlurhashFromUrl(imageData.downloadUrl);

        return {
          ...imageData,
          blurhash,
        };
      })
    );

    const { _id } = await InternalRecipeModel.create(recipe);

    const queriedRecipes = await findRecipes({ _id });

    if (queriedRecipes.length !== 1) {
      return res.sendStatus(HTTPStatusCodes.InternalServerError);
    }

    const createdRecipe = queriedRecipes[0];
    return res.status(HTTPStatusCodes.OK).json(createdRecipe);
  } catch (err: any) {
    console.log("Error in controller:", err);
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }
};
