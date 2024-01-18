import express from "express";
import {
  searchRecipes,
  getRecipeById,
  postRecipeIsComplete,
  postNewRecipe,
  toggleSaveRecipe,
} from "../controllers/recipesController";

const router = express.Router();

router.get("/:recipeId", getRecipeById);
router.post("/search", searchRecipes);
router.post("/complete", postRecipeIsComplete);
router.post("/new", postNewRecipe);
router.post("/toggleSave", toggleSaveRecipe);

export default router;
