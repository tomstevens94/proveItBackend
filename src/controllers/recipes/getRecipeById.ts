import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import { findRecipes } from "../../utils/search/recipeSearch";
import { ObjectId } from "mongodb";

export const getRecipeById: RequestHandler = async (req, res) => {
  const { recipeId } = req.params;

  if (!recipeId) {
    console.log("No recipeId in request params");
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }

  const recipes = await findRecipes({ _id: new ObjectId(recipeId) });

  if (recipes.length === 1 && recipes[0]) {
    return res.status(HTTPStatusCodes.OK).json(recipes[0]);
  } else {
    const errorMsg = `${recipes.length},
      "recipes found after requesting single recipe"`;
    console.log(errorMsg);

    return res.sendStatus(HTTPStatusCodes.NotFound);
  }
};
