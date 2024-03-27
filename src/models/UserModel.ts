import mongoose, { Schema } from "mongoose";

const ratedRecipeSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
});

const userSchema = new Schema({
  userId: { type: String, required: true },
  completedRecipes: { type: [Schema.Types.ObjectId], required: true },
  ratedRecipes: { type: [ratedRecipeSchema], required: true },
  photoUrl: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});

export default mongoose.model("User", userSchema);
