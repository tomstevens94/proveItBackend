import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  postRecipeIsComplete,
  postNewRecipe,
} from '../controllers/recipesController';
import multer from 'multer';

let storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({ storage }).single('imageData');

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:recipeId', getRecipeById);
router.post('/complete', postRecipeIsComplete);
router.post('/new', upload, postNewRecipe);

export default router;
