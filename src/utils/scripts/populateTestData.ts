import RatedRecipeModel from "../../models/RatedRecipeModel";
import mongoose from "mongoose";
// import SavedRecipeModel from "../../models/SavedRecipeModel";

export const populateTestData = () => {
  const recipeIds = ["6499b754911584d5fc36e2de", "64ac0cd7aafa91c0c76c281c"];
  try {
    const randomData = Array(10)
      .fill(0)
      .map((e) => ({
        userId: "gsdfg7887dfggs",
        recipeId: new mongoose.Types.ObjectId(
          recipeIds[Math.floor(Math.random() * recipeIds.length)]
        ),
        rating: Math.ceil(Math.random() * 5),
      }));
    RatedRecipeModel.insertMany(randomData);
    console.log("Populated data");
  } catch (err) {
    console.log("Error populating:", err);
  }
};
