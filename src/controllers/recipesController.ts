import { RequestHandler } from "express";
import RecipeModel from "../models/RecipeModel";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import UserModel from "../models/UserModel";
import {
  createAdditionalRecipeFieldsAggregatePiplineStages,
  createRecipeSearchAggregatePiplineStages,
  createQueryBy_IdArrayPipelineStage,
} from "../utils/search/recipeSearch";
import SavedRecipeModel from "../models/SavedRecipeModel";
import mongoose from "mongoose";

export const searchRecipes: RequestHandler = async (req, res) => {
  try {
    const searchParams = req.body;

    const searchAggregatePipelineStages =
      createRecipeSearchAggregatePiplineStages(searchParams);
    const additionalFieldsPipelineStages =
      createAdditionalRecipeFieldsAggregatePiplineStages();

    const queriedRecipes = await RecipeModel.aggregate([
      ...searchAggregatePipelineStages,
      ...additionalFieldsPipelineStages,
    ]);

    return res.status(HTTPStatusCodes.OK).json(queriedRecipes);
  } catch (err) {
    console.log(err);
    return res
      .status(HTTPStatusCodes.NotFound)
      .json("We were unable to find any recipes");
  }
};

export const getRecipeById: RequestHandler = async (req, res) => {
  const { recipeId } = req.params;

  if (!recipeId) {
    console.log("No recipeId in request params");
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }

  const recipeIdArray = recipeId.split(";");

  if (!recipeIdArray || recipeIdArray.length === 0) {
    console.log("No recipeIds in request params");
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }

  if (recipeIdArray.some((e) => !mongoose.Types.ObjectId.isValid(e))) {
    console.log("Invalid recipeId within array");
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }

  const recipeIdObjectIds = recipeIdArray.map(
    (e) => new mongoose.Types.ObjectId(e)
  );

  const matchedRecipes = await RecipeModel.aggregate([
    createQueryBy_IdArrayPipelineStage(recipeIdObjectIds),
    ...createAdditionalRecipeFieldsAggregatePiplineStages(),
  ]);

  if (recipeIdObjectIds.length === 1) {
    // Single recipe requested
    if (matchedRecipes.length === 1) {
      return res.status(HTTPStatusCodes.OK).json(matchedRecipes[0]);
    } else {
      const errorMsg = `${matchedRecipes.length},
      "recipes found after requesting single recipe"`;
      console.log(errorMsg);

      return res.status(HTTPStatusCodes.NotFound).json(errorMsg);
    }
  } else {
    // Multiple recipes requested
    if (matchedRecipes.length > 0) {
      return res.status(HTTPStatusCodes.OK).json(matchedRecipes);
    } else {
      console.log("No recipes found after requesting multiple recipes");
      return res.status(HTTPStatusCodes.NotFound);
    }
  }
};

export const getSavedRecipes: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

    const savedRecipes = await SavedRecipeModel.find({ userId });

    return res.status(HTTPStatusCodes.OK).json(savedRecipes);
  } catch (err) {
    console.log("Error getting saved recipes", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

export const postRecipeIsComplete: RequestHandler = async (req, res) => {
  if (!req.body || !req.body?.recipeId) {
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
    const updatedUser = await UserModel.updateOne(
      { userId },
      { $push: { completedRecipes: recipeId } }
    );

    if (updatedUser.modifiedCount > 0) {
      console.log("Updated user in database");
      return res.sendStatus(HTTPStatusCodes.OK);
    } else {
      console.log("Failed to update user in database");
      return res.sendStatus(HTTPStatusCodes.NotFound);
    }
  } catch (err: any) {
    console.log(err);

    return res.sendStatus(HTTPStatusCodes.NotFound);
  }
};

export const postNewRecipe: RequestHandler = async (req, res) => {
  try {
    let recipe = req.body;
    if (!recipe) return res.sendStatus(HTTPStatusCodes.BadRequest);

    const userId = req.headers["user-id"];

    recipe.createdByUserId = userId;

    await RecipeModel.create(recipe);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error in controller:", err);
    return res.sendStatus(HTTPStatusCodes.BadRequest);
  }
};

export const toggleSaveRecipe: RequestHandler = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.sendStatus(HTTPStatusCodes.BadRequest);

    const userId = req.headers["user-id"];

    const savedRecipeObject = {
      userId,
      recipeId: new mongoose.Types.ObjectId(recipeId),
    };

    const recipeAreadySavedByUser = await SavedRecipeModel.exists(
      savedRecipeObject
    );

    if (recipeAreadySavedByUser) {
      // Unsave recipe
      await SavedRecipeModel.deleteMany(savedRecipeObject);

      return res.sendStatus(HTTPStatusCodes.OK);
    } else {
      // Save recipe
      await SavedRecipeModel.create(savedRecipeObject);

      return res.sendStatus(HTTPStatusCodes.Created);
    }
  } catch (err) {
    console.log("Error saving recipe:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
