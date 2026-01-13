import { Router } from "express";
import sentenceRoutes from "./sentence.routes";
import commentRoutes from "./comment.routes";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Jin API!");
});

router.use("/sentence", sentenceRoutes);
router.use("/comment", commentRoutes);

export default router;
