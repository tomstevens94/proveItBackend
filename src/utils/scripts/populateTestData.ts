import RatedRecipeModel from "../../models/RatedRecipeModel";

export const populateTestData = () => {
  const recipeIds = ["6499b754911584d5fc36e2de", "64ac0cd7aafa91c0c76c281c"];
  try {
    const randomData = Array(1000)
      .fill(0)
      .map((e) => ({
        userId: "gsdfg7887dfggs",
        recipeId: recipeIds[Math.round(Math.random())],
        rating: Math.ceil(Math.random() * 5),
      }));
    RatedRecipeModel.insertMany(randomData);
  } catch (err) {
    console.log("Error populating:", err);
  }
};
