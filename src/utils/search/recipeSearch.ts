import { PipelineStage } from "mongoose";
import {
  createDifficultyPipelineStage,
  createMinIngredientsPipelineStage,
  createMaxIngredientsPipelineStage,
  createMinDurationPipelineStage,
  createSearchPipelineStage,
  createMaxDurationPipelineStage,
  createRecipeSaveCountPipelineStages,
  createRecipeCommunityRatingPipelineStages,
  createPopulateCreateDetailsPipelineStages,
} from "./createPipelineStages";

export interface RecipeSearchParams {
  text?: string;
  difficulties?: string[];
  minIngredients?: number;
  maxIngredients?: number;
  minDurationInHours?: number;
  maxDurationInHours?: number;
}

export const createRecipeSearchAggregatePiplineStages = (
  recipeSearchParams: RecipeSearchParams
): PipelineStage[] => {
  let searchAggregatePipeline: PipelineStage[] = [];

  // Apply text search
  if (recipeSearchParams.text && recipeSearchParams.text.length > 0) {
    searchAggregatePipeline.push(
      createSearchPipelineStage(recipeSearchParams.text)
    );
  }

  // Apply difficulty filters
  if (
    recipeSearchParams.difficulties &&
    recipeSearchParams.difficulties.length > 0
  ) {
    searchAggregatePipeline.push(
      createDifficultyPipelineStage(recipeSearchParams.difficulties)
    );
  }

  // Apply min ingredient filter
  if (recipeSearchParams.minIngredients) {
    searchAggregatePipeline.push(
      createMinIngredientsPipelineStage(recipeSearchParams.minIngredients)
    );
  }

  // Apply max ingredient filter
  if (recipeSearchParams.maxIngredients) {
    searchAggregatePipeline.push(
      createMaxIngredientsPipelineStage(recipeSearchParams.maxIngredients)
    );
  }

  // Apply min duration in hours filter
  if (
    recipeSearchParams.minDurationInHours &&
    recipeSearchParams.minDurationInHours > 0
  ) {
    searchAggregatePipeline.push(
      createMinDurationPipelineStage(recipeSearchParams.minDurationInHours)
    );
  }

  // Apply max duration in hours filter
  if (recipeSearchParams.maxDurationInHours) {
    searchAggregatePipeline.push(
      createMaxDurationPipelineStage(recipeSearchParams.maxDurationInHours)
    );
  }

  // Get recipe save count
  searchAggregatePipeline.push(...createRecipeSaveCountPipelineStages());

  // Get recipe community rating
  searchAggregatePipeline.push(...createRecipeCommunityRatingPipelineStages());

  // Get recipe creator details
  searchAggregatePipeline.push(...createPopulateCreateDetailsPipelineStages());

  return searchAggregatePipeline;
};
