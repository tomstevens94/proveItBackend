import { MongoDBIndexNames } from "../../configs/mongoDBIndexNames";

export const createSearchPipelineStage = (query: string) => ({
  $search: {
    index: MongoDBIndexNames.RecipeTextSearch,
    autocomplete: {
      query,
      path: "title",
      fuzzy: { maxEdits: 2 },
    },
  },
});

export const createMinIngredientsPipelineStage = (query: number) => ({
  $match: { $expr: { $gte: [{ $size: "$ingredients" }, query] } },
});

export const createMaxIngredientsPipelineStage = (query: number) => ({
  $match: { $expr: { $lte: [{ $size: "$ingredients" }, query] } },
});

export const createMinDurationPipelineStage = (query: number) => ({
  $match: { $expr: { $gte: ["$duration.minValue", query] } },
});

export const createMaxDurationPipelineStage = (query: number) => ({
  $match: { $expr: { $lte: ["$duration.maxValue", query] } },
});

export const createDifficultyPipelineStage = (query: string[]) => ({
  $match: { difficulty: { $in: query.map((e) => e.toLowerCase()) } },
});
