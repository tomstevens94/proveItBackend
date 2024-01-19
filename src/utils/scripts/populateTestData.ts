import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import RatedRecipeModel from "../../models/RatedRecipeModel";
import mongoose from "mongoose";
// import RecipeModel from "../../models/RecipeModel";
// import SavedRecipeModel from "../../models/SavedRecipeModel";

export const populateTestData = () => {
  const recipeIds = [
    "6499b754911584d5fc36e2de",
    "64ac0cd7aafa91c0c76c281c",
    "64d4ac735c127f006546f5e8",
  ];

  try {
    const randomData = Array(10)
      .fill(0)
      .map((e) => ({
        userId: "oxoOb31KlEd3bzmHkri3UcCugux1",
        recipeId: new mongoose.Types.ObjectId(
          recipeIds[Math.floor(Math.random() * recipeIds.length)]
        ),
      }));
    CompletedRecipeModel.insertMany(randomData);
    console.log("Populated data");
  } catch (err) {
    console.log("Error populating:", err);
  }
};
