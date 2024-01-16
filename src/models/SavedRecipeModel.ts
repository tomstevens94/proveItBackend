import mongoose, { Schema } from "mongoose";

const savedRecipeSchema = new Schema({
  userId: { type: String, required: true },
  recipeId: { type: Schema.Types.ObjectId, required: true },
});

export default mongoose.model("SavedRecipe", savedRecipeSchema);
