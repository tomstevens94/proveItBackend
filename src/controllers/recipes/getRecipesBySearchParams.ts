import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import { findRecipes } from "../../utils/search/recipeSearch";

export const getRecipesBySearchParams: RequestHandler = async (req, res) => {
  try {
    const searchParams = req.body;

    const queriedRecipes = await findRecipes({}, searchParams);

    const sortedRecipes = queriedRecipes.sort(
      (a, b) => b.communityRating - a.communityRating
    );

    return res.status(HTTPStatusCodes.OK).json(sortedRecipes);
  } catch (err) {
    console.log(err);
    return res
      .status(HTTPStatusCodes.NotFound)
      .json("We were unable to find any recipes");
  }
};
