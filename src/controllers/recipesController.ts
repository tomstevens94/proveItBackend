import { RequestHandler } from "express";
import RecipeModel from "../models/InternalRecipeModel";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import { findRecipes } from "../utils/search/recipeSearch";
import SavedRecipeModel from "../models/SavedRecipeModel";
import mongoose from "mongoose";
import CompletedRecipeModel from "../models/CompletedRecipeModel";
import { createCountCompletedRecipesPipelineStages } from "../utils/search/createPipelineStages";
import RatedRecipeModel from "../models/RatedRecipeModel";
import { ObjectId } from "mongodb";
import FlagModel from "../models/FlagModel";
import { deleteImage, encodedBlurhashFromUrl } from "../utils/images";

export const searchRecipes: RequestHandler = async (req, res) => {
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

export const getCompletedRecipes: RequestHandler = async (req, res) => {
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

export const getRatedRecipes: RequestHandler = async (req, res) => {
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

export const postRecipeIsComplete: RequestHandler = async (req, res) => {
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

export const postNewRecipe: RequestHandler = async (req, res) => {
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

    const { _id } = await RecipeModel.create(recipe);

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
    } else {
      // Save recipe
      await SavedRecipeModel.create(savedRecipeObject);
    }

    const savedRecipes = await SavedRecipeModel.find({ userId });
    console.log(savedRecipes);

    const statusCode = recipeAreadySavedByUser
      ? HTTPStatusCodes.OK
      : HTTPStatusCodes.Created;
    return res.status(statusCode).json(savedRecipes);
  } catch (err) {
    console.log("Error saving recipe:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

export const postRecipeRating: RequestHandler = async (req, res) => {
  if (!req.body || !req.body.rating || !req.body.recipeId)
    return res.sendStatus(HTTPStatusCodes.BadRequest);

  const { rating, recipeId } = req.body;

  const userId = req.headers["user-id"];
  if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  try {
    // Update existing rating doc if one exists
    await RatedRecipeModel.findOneAndUpdate(
      {
        recipeId: new mongoose.Types.ObjectId(recipeId),
        userId,
      },
      { rating },
      // Below is required to create new doc if it doesnt already exist
      { upsert: true }
    );

    const ratedRecipes = await RatedRecipeModel.find({ userId });

    return res.status(HTTPStatusCodes.Created).json(ratedRecipes);
  } catch (err: any) {
    console.log("Error in ratingsController:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

export const updateExistingRecipe: RequestHandler = async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

  const updatedRecipe = req.body;
  if (!updatedRecipe) return res.sendStatus(HTTPStatusCodes.BadRequest);

  try {
    const recipeFilter = {
      _id: new ObjectId(updatedRecipe._id),
    };

    const existingRecipe = await RecipeModel.findOne(recipeFilter);
    if (existingRecipe === null)
      return res.sendStatus(HTTPStatusCodes.NotFound);

    if (existingRecipe.createdByUserId !== userId)
      return res
        .sendStatus(HTTPStatusCodes.BadRequest)
        .json({ message: "User ID does not match the recipe user ID" });

    const updateResult = await RecipeModel.findOneAndUpdate(
      recipeFilter,
      updatedRecipe
    );

    if (!updateResult) {
      return res.sendStatus(HTTPStatusCodes.NotFound);
    }

    const queriedRecipes = await findRecipes({ _id: updateResult._id });
    if (queriedRecipes.length !== 1) {
      return res.sendStatus(HTTPStatusCodes.InternalServerError);
    }

    return res.status(HTTPStatusCodes.OK).json(queriedRecipes[0]);
  } catch (err: any) {
    console.log("Error in ratingsController:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};

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

    const fullRecipe = await RecipeModel.findOne({ _id: recipeId });

    const imageDeletions = fullRecipe?.images?.map(async (imageData) => {
      await deleteImage(imageData);
    });

    if (imageDeletions) await Promise.all(imageDeletions);

    const deletedResult = await RecipeModel.deleteOne({ _id: recipeId });
    if (deletedResult.deletedCount === 0)
      return res.sendStatus(HTTPStatusCodes.NotFound);

    return res.sendStatus(HTTPStatusCodes.OK);
  } catch (err: any) {
    console.log("Error deleting recipe:", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
