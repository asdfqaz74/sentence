import express from "express";
import { getLatestSentenceController } from "../controllers/sentence.controllers";

const router = express.Router();

router.get("/latest", getLatestSentenceController);

export default router;
