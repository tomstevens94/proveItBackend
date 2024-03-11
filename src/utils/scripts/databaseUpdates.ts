import mongoose from "mongoose";
import RecipeModel from "../../models/RecipeModel";
import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import UserModel from "../../models/UserModel";

export const convertStringFieldToArrayOfObejcts = async () => {
  try {
    console.log("Updating data");

    const updatedDocs = await RecipeModel.updateMany({}, [
      {
        $set: { images: [{ url: "$imageUrl" }] },
      },
    ]);

    console.log(updatedDocs.modifiedCount);
  } catch (err) {
    console.log("Error updating", err);
  }
};

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

export const renameDBFields = async () => {
  console.log("renaming");
  const result = await UserModel.updateMany({}, { $rename: { uid: "userId" } });
  console.log(result);
};

export const removeFields = async () => {
  try {
    console.log("Removing fields");

    const updatedDocs = await RecipeModel.updateMany(
      { imageUrl: { $exists: true } },
      [{ $unset: "imageUrl" }]
    );

    console.log(updatedDocs);
  } catch (err) {
    console.log("Error removing fields:", err);
  }
};

export const deleteRecipes = async () => {
  const recipeIdToDelete: string[] = [];

  try {
    const deletionResult = await RecipeModel.deleteMany({
      _id: { $in: recipeIdToDelete },
    });

    console.log(deletionResult);
  } catch (err) {
    console.log("Error deleting recipes:", err);
  }
};
