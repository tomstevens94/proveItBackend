import mongoose, { Schema } from "mongoose";

const assistantChatConversationSchema = new Schema({
  id: { type: String, required: true },
  threadId: { type: String, required: true },
  name: { type: String, required: true },
  createdOn: { type: String, required: true },
  lastUpdatedOn: { type: String, required: true },
  usersData: [{ userId: { type: String, required: true } }],
});

export default mongoose.model(
  "ChatConversation",
  assistantChatConversationSchema
);
