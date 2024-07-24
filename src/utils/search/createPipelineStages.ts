import { PipelineStage } from "mongoose";
import { MongoDBIndexNames } from "../../configs/mongoDBIndexNames";

export const createSearchPipelineStage = (query: string): PipelineStage => ({
  $search: {
    index: MongoDBIndexNames.RecipeTextSearch,
    text: {
      query,
      path: { wildcard: "*" },
      fuzzy: { maxEdits: 1 },
    },
  },
});

export const createMinIngredientsPipelineStage = (
  query: number
): PipelineStage => ({
  $match: { $expr: { $gte: [{ $size: "$ingredients" }, query] } },
});

export const createMaxIngredientsPipelineStage = (
  query: number
): PipelineStage => ({
  $match: { $expr: { $lte: [{ $size: "$ingredients" }, query] } },
});

export const createMinDurationPipelineStage = (
  query: number
): PipelineStage => ({
  $match: { $expr: { $gte: ["$duration.minValue", query] } },
});

export const createMaxDurationPipelineStage = (
  query: number
): PipelineStage => ({
  $match: { $expr: { $lte: ["$duration.maxValue", query] } },
});

export const createDifficultyPipelineStage = (
  query: string[]
): PipelineStage => ({
  $match: { difficulty: { $in: query } },
});

export const createRecipeSaveCountPipelineStages = (): PipelineStage[] => [
  // Join with relevant docs from savedrecipes
  {
    $lookup: {
      from: "savedrecipes",
      localField: "_id",
      foreignField: "recipeId",
      as: "recipeSavesTemp",
    },
  },
  // Count docs and save as totalSaves
  {
    $addFields: {
      totalSaves: {
        $size: "$recipeSavesTemp",
      },
    },
  },
  // Remove docs
  { $unset: "recipeSavesTemp" },
];

export const createRecipeCommunityRatingPipelineStages =
  (): PipelineStage[] => [
    // Join with relevant docs from ratedrecipes
    {
      $lookup: {
        from: "ratedrecipes",
        localField: "_id",
        foreignField: "recipeId",
        as: "recipeRatingsTemp",
      },
    },
    // Average docs and save as communityRating
    {
      $addFields: {
        communityRating: {
          $avg: "$recipeRatingsTemp.rating",
        },
      },
    },
    // Remove docs
    { $unset: "recipeRatingsTemp" },
  ];

export const createPopulateCreateDetailsPipelineStages =
  (): PipelineStage[] => [
    // Join with user docs
    {
      $lookup: {
        from: "users",
        localField: "createdByUserId",
        foreignField: "userId",
        as: "creatorDetails",
      },
    },
    // Set creatorDetails to first (only) elements in docs array
    {
      $set: {
        creatorDetails: {
          $first: "$creatorDetails",
        },
      },
    },
  ];

export const createCountCompletedRecipesPipelineStages = (
  userId: string
): PipelineStage[] => [
  {
    $match: {
      userId,
    },
  },
  {
    $group: {
      _id: "$recipeId",
      count: { $count: {} },
    },
  },
  {
    $set: {
      recipeId: "$_id",
    },
  },
];
