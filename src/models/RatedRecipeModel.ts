import mongoose, { Schema } from "mongoose";

const ratedRecipeSchema = new Schema({
  userId: { type: String, required: true },
  recipeId: { type: String, required: true },
  rating: { type: Number, required: true },
});

export default mongoose.model("RatedRecipe", ratedRecipeSchema);
