import mongoose, { Schema } from "mongoose";

const flagSchema = new Schema({
  flaggedByUserId: { type: String, required: true },
  recipeId: { type: Schema.Types.ObjectId, required: true },
  resolved: { type: Boolean, required: true },
  resolutionNotes: { type: String, required: false },
});

export default mongoose.model("Flag", flagSchema);
