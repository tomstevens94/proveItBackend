import mongoose, { PipelineStage } from "mongoose";
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
  createRecipeRatingPipelineStages,
} from "./createPipelineStages";
import InternalRecipeModel from "../../models/InternalRecipeModel";
import ExternalRecipeModel from "../../models/ExternalRecipeModel";

export interface RecipeSearchParams {
  text?: string;
  difficulties?: string[];
  minIngredients?: number;
  maxIngredients?: number;
  minDurationInHours?: number;
  maxDurationInHours?: number;
}

export const findRecipes = async (
  filter: any,
  searchParams: RecipeSearchParams = {}
) => {
  const searchAggregatePipelineStages =
    createRecipeSearchAggregatePiplineStages(searchParams);
  const additionalFieldsPipelineStages =
    createAdditionalRecipeFieldsAggregatePiplineStages();

  const query: PipelineStage[] = [
    ...searchAggregatePipelineStages,
    ...additionalFieldsPipelineStages,
    { $match: filter },
  ];

  const queriedInternalRecipes = await InternalRecipeModel.aggregate(query);
  const queriedExternalRecipes = await ExternalRecipeModel.aggregate(query);

  return queriedInternalRecipes.concat(...queriedExternalRecipes);
};

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

  return searchAggregatePipeline;
};

export const createAdditionalRecipeFieldsAggregatePiplineStages =
  (): PipelineStage[] => {
    let aggregatePipeline: PipelineStage[] = [];

    // Get recipe save count
    aggregatePipeline.push(...createRecipeSaveCountPipelineStages());

    // Get recipe community rating
    aggregatePipeline.push(...createRecipeCommunityRatingPipelineStages());

    // Get recipe rating
    aggregatePipeline.push(...createRecipeRatingPipelineStages());

    // Get recipe creator details
    aggregatePipeline.push(...createPopulateCreateDetailsPipelineStages());

    return aggregatePipeline;
  };
