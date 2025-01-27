import express from "express";
import { getAllConversations } from "../controllers/chat/getAllConversations";

const router = express.Router();

router.get("/conversation/", getAllConversations);

export default router;
