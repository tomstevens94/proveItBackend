import mongoose, { Schema } from "mongoose";

const savedRecipeSchema = new Schema({
  userId: { type: String, required: true },
  recipeId: { type: String, required: true },
});

export default mongoose.model("SavedRecipe", savedRecipeSchema);
