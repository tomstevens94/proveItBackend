import { CheerioAPI } from "cheerio";
import {
  ExternalRecipe,
  ExternalRecipeImage,
  ExternalRecipeIngredient,
  ExternalRecipeStep,
  RecipeIngredientGroup,
  RecipeStep,
  RecipeStepGroup,
  Time,
  TimeUnit,
} from "../../typesWIP/recipe";
import { v4 as uuidv4 } from "uuid";
import { URL } from "url";
import { encodedBlurhashFromUrl } from "../../utils/images";

const isValidURL = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

export const getTimeUnit = (str: string): TimeUnit => {
  switch (str) {
    case "hr":
    case "hour":
    case "hours":
      return TimeUnit.Hour;

    default:
      throw new Error("Invalid time unit");
  }
};

export const getDuration = ($: CheerioAPI): Time => {
  const durationString = $(".tasty-recipes-total-time").text().trim();

  let matches = durationString.match(/([0-9]*) (hours)/);
  if (matches === null || matches.length < 3)
    throw new Error("Invalid duration");

  const value = Number(matches[1]);
  const unit = getTimeUnit(matches[2]);

  return {
    value,
    unit,
  };
};

export const getIngredientsAndGroups = (
  $: CheerioAPI
): Pick<ExternalRecipe, "ingredients" | "ingredientGroups"> => {
  let ingredients: ExternalRecipeIngredient[] = [];
  let ingredientGroups: RecipeIngredientGroup[] = [];

  const ingredientsBody = $(".tasty-recipes-ingredients-body");

  let ingredientGroupHeaders = ingredientsBody.find("h4");

  if (ingredientGroupHeaders.length === 0)
    throw new Error("No group headers found");

  // Groups are in pairs of h4 - ul
  let ingredientGroupHeader = ingredientGroupHeaders.first();

  while (ingredientGroupHeader.get()[0]?.tagName === "h4") {
    // Get string value of group title
    const ingredientGroupTitle = ingredientGroupHeader.text().trim();
    const ingredientGroup: RecipeIngredientGroup = {
      id: uuidv4(),
      title: ingredientGroupTitle,
    };
    ingredientGroups.push(ingredientGroup);

    // List of ingredients - should be h4
    const ingredientsHtml = ingredientGroupHeader.next();
    const ingredientsHtmlTagName = ingredientsHtml.get()[0].tagName;
    if (ingredientsHtmlTagName !== "ul")
      throw new Error(
        "Invalid tagname in ingredient group " + ingredientsHtmlTagName
      );

    const ingredientStrings = ingredientsHtml.text().trim().split("\n");
    ingredients.push(
      ...ingredientStrings.map((title) => ({
        id: uuidv4(),
        title,
        groupId: ingredientGroup.id,
      }))
    );

    // Continue next iteration with next header
    ingredientGroupHeader = ingredientsHtml.next();
  }

  return {
    ingredients,
    ingredientGroups,
  };
};

export const getSteps = (
  $: CheerioAPI
): Pick<ExternalRecipe, "steps" | "stepGroups"> => {
  let steps: ExternalRecipeStep[] = [];
  let stepGroups: RecipeStepGroup[] = [];

  const stepsBody = $(".tasty-recipes-instructions-body");

  let stepsList = stepsBody.find("ol");

  if (stepsList.length !== 1)
    throw new Error("Invalid number of step sections found");

  // const stepStrings: string[] = stepsLists.text().trim().split("\n");

  let child = stepsList.children().first();
  let currentGroup: RecipeStepGroup | undefined = undefined;

  while (child.get()[0]?.tagName === "li") {
    const firstChild = child.children().first();
    const firstChildTagName = firstChild.get()[0]?.tagName;

    if (firstChildTagName === "strong") {
      const stepGroup: RecipeStepGroup = {
        id: uuidv4(),
        title: firstChild.text().trim(),
      };
      stepGroups.push(stepGroup);
      currentGroup = stepGroup;

      firstChild.remove();
    }

    const step: ExternalRecipeStep = {
      id: uuidv4(),
      description: child.text().trim(),
    };
    if (currentGroup) {
      step.groupId = currentGroup.id;
    }

    steps.push(step);

    child = child.next();
  }

  // Remove any sentences from each step that contain an internal link
  // console.log(stepStrings);

  // const steps: ExternalRecipeStep[] = stepStrings.map((description) => ({
  //   id: uuidv4(),
  //   description,
  // }));

  return { steps, stepGroups };
};

// Return type corresponds to expo-image library source prop
export const getImage = async (
  $: CheerioAPI
): Promise<ExternalRecipeImage[]> => {
  const figure = $("figure");

  const imgSrcSetString = $("img", figure).attr("srcset");
  const imgWidth = Number($("img", figure).attr("width"));
  const imgHeight = Number($("img", figure).attr("height"));

  if (!imgSrcSetString || Number.isNaN(imgWidth) || Number.isNaN(imgHeight))
    throw new Error("No image srcset found");

  const imageAspectRatio = imgWidth / imgHeight;

  const srcSet = imgSrcSetString.split(", ").map((string) => {
    const [uri, suffix] = string.split(" ");
    if (!isValidURL(uri)) throw new Error("Invalid img url");

    const match = suffix.match(/([0-9]*)w$/);
    if (match === null || match.length < 2)
      throw new Error("Invalid image srcset - width");

    const width = Number(match[1]);
    const height = Math.round(width / imageAspectRatio);

    return {
      width,
      height,
      uri,
    };
  });

  const minUrl = srcSet.sort((a, b) => a.width - b.width)[0].uri;
  const blurhash = await encodedBlurhashFromUrl(minUrl);

  return [{ srcSet, blurhash }];
};
