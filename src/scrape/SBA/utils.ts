import { Cheerio, CheerioAPI, Element } from "cheerio";
import {
  ExternalRecipe,
  ExternalRecipeImage,
  ExternalRecipeIngredient,
  ExternalRecipeStep,
  RecipeIngredientGroup,
  RecipeStepGroup,
  Time,
  TimeUnit,
} from "../../typesWIP/recipe";
import { v4 as uuidv4 } from "uuid";
import { URL } from "url";
import { encodedBlurhashFromUrl } from "../../utils/images";
import { sbaBaseUrl } from "./sites";

const findAnchorsToRemove = (
  $: CheerioAPI,
  e: Cheerio<Element>,
  cache: string[] = []
): string[] => {
  let anchorsToRemove: string[] = cache;

  e.children().map((_, child) => {
    const childCheerio = $(child);

    if (child.tagName === "a") {
      const href = childCheerio.attr("href");

      if (href && href.includes(sbaBaseUrl)) {
        anchorsToRemove.push(childCheerio.text());
      }
    }

    if (childCheerio.children().length > 1) {
      findAnchorsToRemove($, childCheerio, anchorsToRemove);
    }
  });

  return anchorsToRemove;
};

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

    case "min":
    case "mins":
    case "minutes":
      return TimeUnit.Minute;

    default:
      throw new Error("Invalid time unit");
  }
};

export const getDuration = ($: CheerioAPI): Time => {
  const durationString = $(".tasty-recipes-total-time").text().trim();

  let matches = durationString.match(/([0-9]*) (hours|minutes)/);
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

  const getIngredientsFromUlElement = (ulElement: Cheerio<Element>) => {
    const ingredientsHtmlTagName = ulElement.get()[0].tagName;
    if (ingredientsHtmlTagName !== "ul")
      throw new Error(
        "Invalid tagname in ingredient group " + ingredientsHtmlTagName
      );

    const ingredientTitles = ulElement.text().trim().split("\n");

    return ingredientTitles;
  };

  let child = ingredientsBody.children().first();
  let currentGroup: RecipeIngredientGroup | undefined = undefined;

  while (["ul", "h4"].includes(child.get()[0]?.tagName)) {
    const tagName = child.get()[0]?.tagName;

    if (tagName === "h4") {
      currentGroup = {
        id: uuidv4(),
        title: child.text().trim().replace(/\**$/, ""),
      };
      ingredientGroups.push(currentGroup);
    } else {
      const ingredientTitles = getIngredientsFromUlElement(child);

      ingredients.push(
        ...ingredientTitles.map((title) => {
          const obj: ExternalRecipeIngredient = {
            id: uuidv4(),
            title: title.trim().replace(/\**$/, ""),
          };

          if (currentGroup) obj.groupId = currentGroup.id;

          return obj;
        })
      );
    }

    child = child.next();
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

  let child = stepsList.children().first();
  let currentGroup: RecipeStepGroup | undefined = undefined;

  const anchorsToRemove = findAnchorsToRemove($, stepsList);

  while (child.get()[0]?.tagName === "li") {
    // Contents required over children to detect text nodes as well as tags
    const firstChild = child.contents().first();
    const firstChildNode = firstChild.get()[0];

    const isStrong =
      firstChildNode.type === "tag" && firstChildNode.tagName === "strong";

    if (isStrong) {
      const stepGroup: RecipeStepGroup = {
        id: uuidv4(),
        title: firstChild.text().trim(),
      };
      stepGroups.push(stepGroup);
      currentGroup = stepGroup;

      firstChild.remove();
    }

    let sentences = child.text().trim().split(".");

    anchorsToRemove.forEach(
      (anchor) =>
        (sentences = sentences.filter((sentence) => !sentence.includes(anchor)))
    );

    const description = sentences.join(".").replace(/\**$/, "");

    const step: ExternalRecipeStep = {
      id: uuidv4(),
      description,
    };
    if (currentGroup) {
      step.groupId = currentGroup.id;
    }

    steps.push(step);

    child = child.next();
  }

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
