import { Router } from "express";
import sentenceRoutes from "./sentence.routes";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Jin API!");
});

router.use("/sentence", sentenceRoutes);

export default router;
