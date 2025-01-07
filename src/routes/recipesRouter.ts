import express from "express";
import { postRecipeView } from "../controllers/recipes/postRecipeView";
import { getRecipeById } from "../controllers/recipes/getRecipeById";
import { getRecipesBySearchParams } from "../controllers/recipes/getRecipesBySearchParams";
import { getRecipeSaves } from "../controllers/recipes/getRecipeSaves";
import { getRecipeCompletions } from "../controllers/recipes/getRecipeCompletions";
import { getRecipeRatings } from "../controllers/recipes/getRecipeRatings";
import { getPersonalisedRecipes } from "../controllers/recipes/getPersonalisedRecipes";
import { postRecipeCompletion } from "../controllers/recipes/postRecipeCompletion";
import { postRecipe } from "../controllers/recipes/postRecipe";
import { toggleRecipeSave } from "../controllers/recipes/toggleRecipeSave";
import { postRecipeRating } from "../controllers/recipes/postRecipeRating";
import { putRecipe } from "../controllers/recipes/putRecipe";
import { deleteRecipe } from "../controllers/recipes/deleteRecipe";

const router = express.Router();

router.get("/saved", getRecipeSaves);
router.get("/completed", getRecipeCompletions);
router.get("/rated", getRecipeRatings);
router.get("/personalised", getPersonalisedRecipes);
router.get("/:recipeId", getRecipeById);
// Routes with dynamic URLs must come after ALL other routes of the same method

router.put("/", putRecipe);

router.delete("/:recipeId", deleteRecipe);

router.post("/search", getRecipesBySearchParams);
router.post("/complete", postRecipeCompletion);
router.post("/new", postRecipe);
router.post("/toggleSave", toggleRecipeSave);
router.post("/rate", postRecipeRating);
router.post("/viewed", postRecipeView);

export default router;
