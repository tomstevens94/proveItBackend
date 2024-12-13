import express from "express";
import { aiController } from "../controllers/aiController";

const router = express.Router();

router.post("/", aiController);

export default router;
