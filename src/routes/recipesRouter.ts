import express from "express";
import {
  searchRecipes,
  getRecipeById,
  getSavedRecipes,
  getCompletedRecipes,
  getRatedRecipes,
  postRecipeIsComplete,
  postNewRecipe,
  toggleSaveRecipe,
  postRecipeRating,
  getPersonalisedRecipes,
  updateExistingRecipe,
  deleteRecipe,
} from "../controllers/recipesController";

const router = express.Router();

router.get("/saved", getSavedRecipes);
router.get("/completed", getCompletedRecipes);
router.get("/rated", getRatedRecipes);
router.get("/personalised", getPersonalisedRecipes);
router.get("/:recipeId", getRecipeById);
// Routes with dynamic URLs must come after ALL other routes of the same method

router.put("/", updateExistingRecipe);

router.delete("/:recipeId", deleteRecipe);

router.post("/search", searchRecipes);
router.post("/complete", postRecipeIsComplete);
router.post("/new", postNewRecipe);
router.post("/toggleSave", toggleSaveRecipe);
router.post("/rate", postRecipeRating);

export default router;
