import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import RatedRecipeModel from "../../models/RatedRecipeModel";

export const getRecipeRatings: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

    const ratedRecipes = await RatedRecipeModel.find({ userId });

    return res.status(HTTPStatusCodes.OK).json(ratedRecipes);
  } catch (err: any) {
    console.log("Error getting rated recipes:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
