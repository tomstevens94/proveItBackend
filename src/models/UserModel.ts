import mongoose, { Schema } from "mongoose";

const ratedRecipeSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
});

const avatarSchema = new Schema({
  type: { type: String, required: true },
  options: {
    hair: { type: [String], required: true },
    face: { type: [String], required: true },
    mouth: { type: [String], required: true },
    ear: { type: [String], required: true },
    eyes: { type: [String], required: true },
    cheek: { type: [String], required: true },
    cheekProbability: { type: Number, required: true },
    nose: { type: [String], required: true },
    sideburn: { type: [String], required: true },
    frontHair: { type: [String], required: true },
    hairColor: { type: [String], required: true },
    skinColor: { type: [String], required: true },
  },
});

const userSchema = new Schema({
  userId: { type: String, required: true },
  photoUrl: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  avatar: { type: avatarSchema, required: false },
});

export default mongoose.model("User", userSchema);
