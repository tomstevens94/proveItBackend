import { RequestHandler } from "express";
import { HTTPStatusCodes } from "../../configs/HTTPStatusCodes";
import ChatConversationModel from "../../models/ChatConversationModel";

export const getAllConversations: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) return res.sendStatus(HTTPStatusCodes.Unauthorized);

    const allConversations = await ChatConversationModel.find({
      usersData: { $elemMatch: { userId } },
    }).sort({
      lastUpdatedOn: -1,
    });

    return res.status(HTTPStatusCodes.OK).json(allConversations);
  } catch (err) {
    console.log("Error getting saved recipes", err);
    return res.sendStatus(HTTPStatusCodes.InternalServerError);
  }
};
