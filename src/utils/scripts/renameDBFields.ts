import UserModel from "../../models/UserModel";

export const renameDBFields = async () => {
  console.log("renaming");
  const result = await UserModel.updateMany({}, { $rename: { uid: "userId" } });
  console.log(result);
};
