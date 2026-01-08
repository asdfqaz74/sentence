import express from "express";
import {
  getLatestSentenceController,
  getWeeklySentences,
} from "../controllers/sentence.controllers";

const router = express.Router();

// 문장 가져오기
router.get("/latest", getLatestSentenceController);
// 주말 문장 가져오기
router.get("/weekly", getWeeklySentences);

export default router;
