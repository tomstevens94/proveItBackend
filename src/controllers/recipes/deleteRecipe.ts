import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import SavedRecipeModel from "../../models/SavedRecipeModel";
import RatedRecipeModel from "../../models/RatedRecipeModel";
import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import InternalRecipeModel from "../../models/InternalRecipeModel";
import FlagModel from "../../models/FlagModel";
import { deleteImage } from "../../utils/images";

export const deleteRecipe: RequestHandler = async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  const { recipeId } = req.params;
  if (!recipeId) return res.sendStatus(HTTPStatusCodes.BadRequest);

  try {
    await SavedRecipeModel.deleteMany({ recipeId });
    await RatedRecipeModel.deleteMany({ recipeId });
    await CompletedRecipeModel.deleteMany({ recipeId });
    await FlagModel.deleteMany({ recipeId });

    const fullRecipe = await InternalRecipeModel.findOne({ _id: recipeId });

    const imageDeletions = fullRecipe?.images?.map(async (imageData) => {
      await deleteImage(imageData);
    });

    if (imageDeletions) await Promise.all(imageDeletions);

    const deletedResult = await InternalRecipeModel.deleteOne({
      _id: recipeId,
    });
    if (deletedResult.deletedCount === 0)
      return res.sendStatus(HTTPStatusCodes.NotFound);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error deleting recipe:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
