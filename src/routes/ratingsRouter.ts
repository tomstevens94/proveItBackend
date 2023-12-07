import express from 'express';
import { postRecipeRating } from '../controllers/ratingsController';

const router = express.Router();

router.post('/rateRecipe', postRecipeRating);

export default router;
