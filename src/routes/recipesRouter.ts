import express from "express";
import {
  searchRecipes,
  getRecipeById,
  postRecipeIsComplete,
  postNewRecipe,
} from "../controllers/recipesController";

const router = express.Router();

router.get("/:recipeId", getRecipeById);
router.post("/search", searchRecipes);
router.post("/complete", postRecipeIsComplete);
router.post("/new", postNewRecipe);

export default router;
