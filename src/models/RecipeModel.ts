import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema({
  _id: String,
  title: String,
  createdByUserId: String,
  difficulty: String,
  imageUrl: String,
  categories: [String],
  duration: {
    unit: String,
    value: Number,
    minValue: Number,
    maxValue: Number,
  },
  ingredients: [
    {
      id: String,
      title: String,
      amount: {
        unit: String,
        value: Number,
      },
      recommendedTemperature: {
        unit: String,
        value: Number,
      },
    },
  ],
  steps: [
    {
      id: String,
      title: String,
      description: String,
      inactiveDuration: {
        unit: String,
        value: Number,
        minValue: Number,
        maxValue: Number,
      },
      repititions: {
        min: Number,
        max: Number,
        timeBetween: {
          unit: String,
          value: Number,
          minValue: Number,
          maxValue: Number,
        },
        addTimeAfter: Boolean,
      },
      tips: [String],
    },
  ],
});

export default mongoose.model("Recipe", recipeSchema);
