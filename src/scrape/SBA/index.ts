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
import { sbaSites } from "./sites";

export const scrape = async () => {
  const enabled = false;
  if (!enabled) {
    console.log("Scraping disabled");
    return;
  }

  console.log("Scraping");

  await Promise.all(
    sbaSites.map(async (sourceUrl) => {
      try {
        const recipeExists = await ExternalRecipeModel.exists({ sourceUrl });
        if (recipeExists) {
          console.log("Recipe already exists");
          return;
        }

        const html = await fetchHtml(sourceUrl);
        const $ = cheerio.load(html);

        const title = $(".tasty-recipes-title").text().trim();
        const description = $(".tasty-recipes-description-body").text().trim();
        const duration = getDuration($);

        const { ingredients, ingredientGroups } = getIngredientsAndGroups($);
        const { steps, stepGroups } = getSteps($);

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

        return createdExternalRecipe;
      } catch (err: any) {
        console.log("Error scraping: ", sourceUrl, err);
        return;
      }
    })
  );
};
