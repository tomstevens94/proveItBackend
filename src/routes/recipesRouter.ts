import express from "express";
import {
  searchRecipes,
  getRecipeById,
  getSavedRecipes,
  postRecipeIsComplete,
  postNewRecipe,
  toggleSaveRecipe,
} from "../controllers/recipesController";

const router = express.Router();

router.get("/saved", getSavedRecipes);
router.get("/:recipeId", getRecipeById);
// Routes with dynamic URLs must come after ALL other routes of the same method

router.post("/search", searchRecipes);
router.post("/complete", postRecipeIsComplete);
router.post("/new", postNewRecipe);
router.post("/toggleSave", toggleSaveRecipe);

export default router;
