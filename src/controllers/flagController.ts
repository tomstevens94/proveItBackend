import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import FlagModel from "../models/FlagModel";

export const flagRecipe: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

    const { recipeId } = req.body;
    if (!recipeId) return res.sendStatus(HTTPStatusCodes.BadRequest);

    await FlagModel.create({
      flaggedByUserId: userId,
      recipeId,
      resolved: false,
    });

    return res.sendStatus(HTTPStatusCodes.Created);
  } catch (err: any) {
    console.log("Error creating flag");
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
