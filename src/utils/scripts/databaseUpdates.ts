import mongoose from "mongoose";
import RecipeModel from "../../models/RecipeModel";
import CompletedRecipeModel from "../../models/CompletedRecipeModel";
import UserModel from "../../models/UserModel";
import { blurhashFromURL } from "blurhash-from-url";

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
  const recipeIdsToDelete: string[] = [];

  try {
    const deletionResult = await RecipeModel.deleteMany({
      _id: { $in: recipeIdsToDelete },
    });

    console.log(deletionResult);
  } catch (err) {
    console.log("Error deleting recipes:", err);
  }
};

export const updateOnboardingCompletion = async () => {
  try {
    const allUsers = await UserModel.find({});

    const updatedUsers = await Promise.all(
      allUsers.map((user) => {
        // user.displayName = undefined;
        // const hasCompletedOnboarding = !!user?.firstName && !!user?.lastName;
        // user.hasCompletedOnboarding = hasCompletedOnboarding;
        return user.save();
      })
    );

    console.log("updatedUsers", updatedUsers);
  } catch (err) {
    console.log("Error updating users", err);
  }
};

export const addOptional = async () => {
  try {
    console.log("Adding");
    const recipes = await RecipeModel.find({});

    const result = await RecipeModel.updateMany(
      {},
      {
        $set: {
          "ingredients.$[].isOptional": false,
        },
      }
    );

    console.log(result);
  } catch (err: any) {
    console.log("Error adding field");
  }
};

export const testBlurhashEncoding = async () => {
  try {
    console.log("Testing blurhash");

    const output = await blurhashFromURL(
      "https://firebasestorage.googleapis.com/v0/b/prove-it-7c0b4.appspot.com/o/recipe-images%2Fa2db4474-271d-4b25-8412-0b5748750d1d?alt=media&token=48e9ceea-e54c-4fa2-ac81-a82b707c16eb"
    );
    console.log(output);
  } catch (err: any) {
    console.log("Error testing blurhash", err);
  }
};
