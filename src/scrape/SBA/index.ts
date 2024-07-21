import { fetchHtml } from "../utils";
import { ExternalRecipe, Recipe } from "../../typesWIP/recipe";
import * as cheerio from "cheerio";
import {
  getDuration,
  getImage,
  getIngredientsAndGroups,
  getSteps,
} from "./utils";
import ExternalRecipeModel from "../../models/ExternalRecipeModel";

export const scrape = async () => {
  const enabled = false;
  if (!enabled) {
    console.log("Scraping disabled");
    return;
  }

  console.log("Scraping");

  const sourceUrl =
    "https://sallysbakingaddiction.com/lemon-blueberry-layer-cake/#tasty-recipes-67801";

  const recipeExists = await ExternalRecipeModel.exists({ sourceUrl });
  if (recipeExists) throw new Error("Recipe already exists");

  const html = await fetchHtml(sourceUrl);
  const $ = cheerio.load(html);

  const title = $(".tasty-recipes-title").text().trim();
  const description = $(".tasty-recipes-description-body").text().trim();

  const duration = getDuration($);

  const { ingredients, ingredientGroups } = getIngredientsAndGroups($);
  const { steps, stepGroups } = getSteps($);

  console.log(steps);
  console.log(stepGroups);

  const images = await getImage($);

  const externalRecipe: Partial<ExternalRecipe> = {
    sourceUrl,

    title,
    description,
    duration,
    ingredients,
    ingredientGroups,
    steps,
    stepGroups,
    images,
  };

  const createdExternalRecipe = await ExternalRecipeModel.create(
    externalRecipe
  );

  console.log("Recipe created: ", createdExternalRecipe.title);
};
