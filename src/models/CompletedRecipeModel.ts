import mongoose, { Schema } from "mongoose";

const completedRecipeSchema = new Schema({
  userId: { type: String, required: true },
  recipeId: { type: Schema.Types.ObjectId, required: true },
});

export default mongoose.model("CompletedRecipe", completedRecipeSchema);
