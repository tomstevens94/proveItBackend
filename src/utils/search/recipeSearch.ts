import { FilterQuery } from "mongoose";
import RecipeModel from "../../models/RecipeModel";

export interface RecipeSearchParams {
  text?: string;
  difficulties?: string[];
  minIngredients?: number;
  maxIngredients?: number;
  minDurationInHours?: number;
  maxDurationInHours?: number;
}

export const createQueryFromRecipeSearchParams = (
  recipeSearchParams: RecipeSearchParams
): FilterQuery<typeof RecipeModel> => {
  let searchQuery: FilterQuery<typeof RecipeModel> = {};

  if (
    recipeSearchParams.difficulties &&
    recipeSearchParams.difficulties.length > 0
  ) {
    searchQuery.difficulty = recipeSearchParams.difficulties =
      recipeSearchParams.difficulties.map((e: string) => e.toLowerCase());
  }

  return searchQuery;
};
