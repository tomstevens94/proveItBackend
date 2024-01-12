import { RequestHandler } from "express";
import RecipeModel from "../models/RecipeModel";
import { HTTPStatusCodes } from "../configs/HTTPStatusCodes";
import UserModel from "../models/UserModel";
import { uploadImage } from "../utils/uploadImage";
import { createRecipeSearchAggregatePiplineStages } from "../utils/search/recipeSearch";

export const searchRecipes: RequestHandler = async (req, res) => {
  try {
    const searchParams = req.body;

    const searchAggregatePipelineStages =
      createRecipeSearchAggregatePiplineStages(searchParams);

    let queriedRecipes = [];

    if (searchAggregatePipelineStages.length > 0) {
      // Aggregate is used to chain search params
      queriedRecipes = await RecipeModel.aggregate(
        searchAggregatePipelineStages
      );
    } else {
      // This will trigger if no search params are received
      queriedRecipes = await RecipeModel.find({});
    }

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

  if (recipeIdArray.length === 1) {
    let recipe;

    recipe = await RecipeModel.findOne({ _id: recipeId }).exec();

    if (recipe) {
      return res.status(HTTPStatusCodes.OK).json(recipe);
    } else {
      return res
        .status(HTTPStatusCodes.NotFound)
        .json("We weren't able to find that recipe");
    }
  } else {
    let recipes;

    recipes = await RecipeModel.find({ _id: { $in: recipeIdArray } }).exec();

    if (recipes) {
      return res.status(200).json(recipes);
    } else {
      // TODO error handling
    }
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
      { uid: userId },
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

// export const postNewRecipe: RequestHandler = async (req, res) => {
//   const { file } = req;
//   let recipe = req.body;

//   Object.keys(recipe).map(key => {
//     recipe[key] = JSON.parse(recipe[key]);
//   });

//   try {
//     if (!file) throw 'No file found';

//     const imageUploadResult = await uploadImage(file);
//     const imageUrl = imageUploadResult.data.url;

//     const createdRecipe = await RecipeModel.create({ ...recipe, imageUrl });
//     console.log('Recipe created:', createdRecipe);

//     return res.sendStatus(HTTPStatusCodes.OK);
//   } catch (err: any) {
//     console.log('Error in controller:', err.data);
//     return res.sendStatus(HTTPStatusCodes.BadRequest);
//   }
// };
