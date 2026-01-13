import { Router } from "express";
import { createComment } from "../controllers/comment.controllers";

const router: Router = Router();

// POST /api/comment - 코멘트 작성
router.post("/", createComment);

export default router;
