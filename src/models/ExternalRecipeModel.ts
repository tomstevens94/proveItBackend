import mongoose, { Schema } from "mongoose";

const externalRecipeIngredientSchema = new Schema({
  id: String,
  title: String,
  groupId: String,
});

const recipeIngredientGroupSchema = new Schema({
  id: String,
  title: String,
});

const externalRecipeStepSchema = new Schema({
  id: String,
  description: String,
  groupId: String,
});

const recipeStepGroupSchema = new Schema({
  id: String,
  title: String,
});

const imageSrcSetSchema = new Schema({
  width: Number,
  height: Number,
  uri: String,
});

const externalRecipeImageSchema = new Schema({
  srcSet: { type: [imageSrcSetSchema], required: true },
  blurhash: { type: String, required: true },
});

const recipeDurationSchema = new Schema({
  unit: String,
  value: Number,
});

const recipeSchema = new Schema({
  sourceUrl: String,

  title: String,
  description: String,

  duration: {
    type: recipeDurationSchema,
    required: true,
  },
  ingredients: {
    type: [externalRecipeIngredientSchema],
    required: true,
  },
  ingredientGroups: {
    type: [recipeIngredientGroupSchema],
    required: true,
  },
  steps: {
    type: [externalRecipeStepSchema],
    required: true,
  },
  stepGroups: {
    type: [recipeStepGroupSchema],
    required: true,
  },
  images: {
    type: [externalRecipeImageSchema],
    required: true,
  },
});

export default mongoose.model("ExternalRecipe", recipeSchema);
