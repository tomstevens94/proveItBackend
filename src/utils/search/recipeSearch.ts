import { PipelineStage } from "mongoose";
import {
  createDifficultyPipelineStage,
  createMinIngredientsPipelineStage,
  createMaxIngredientsPipelineStage,
  createMinDurationPipelineStage,
  createSearchPipelineStage,
  createMaxDurationPipelineStage,
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

  if (recipeSearchParams.text && recipeSearchParams.text.length > 0) {
    searchAggregatePipeline.push(
      createSearchPipelineStage(recipeSearchParams.text)
    );
  }

  if (
    recipeSearchParams.difficulties &&
    recipeSearchParams.difficulties.length > 0
  ) {
    searchAggregatePipeline.push(
      createDifficultyPipelineStage(recipeSearchParams.difficulties)
    );
  }

  if (recipeSearchParams.minIngredients) {
    searchAggregatePipeline.push(
      createMinIngredientsPipelineStage(recipeSearchParams.minIngredients)
    );
  }

  if (recipeSearchParams.maxIngredients) {
    searchAggregatePipeline.push(
      createMaxIngredientsPipelineStage(recipeSearchParams.maxIngredients)
    );
  }

  if (
    recipeSearchParams.minDurationInHours &&
    recipeSearchParams.minDurationInHours > 0
  ) {
    searchAggregatePipeline.push(
      createMinDurationPipelineStage(recipeSearchParams.minDurationInHours)
    );
  }

  if (recipeSearchParams.maxDurationInHours) {
    searchAggregatePipeline.push(
      createMaxDurationPipelineStage(recipeSearchParams.maxDurationInHours)
    );
  }

  return searchAggregatePipeline;
};
