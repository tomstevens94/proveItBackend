import mongoose, { Schema } from "mongoose";

const RecipeViewSchema = new Schema({
  userId: { type: String, required: true },
  recipeId: { type: String, required: true },
});

export default mongoose.model("RecipeView", RecipeViewSchema);
