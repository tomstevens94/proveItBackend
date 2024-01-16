import { PipelineStage } from "mongoose";
import { MongoDBIndexNames } from "../../configs/mongoDBIndexNames";

export const createSearchPipelineStage = (query: string): PipelineStage => ({
  $search: {
    index: MongoDBIndexNames.RecipeTextSearch,
    autocomplete: {
      query,
      path: "title",
      fuzzy: { maxEdits: 2 },
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
  $match: { difficulty: { $in: query.map((e) => e.toLowerCase()) } },
});

export const createRecipeSaveCountPipelineStages = (): PipelineStage[] => [
  // Join with relevant docs in savedrecipes
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
  { $unset: "saveData" },
];
