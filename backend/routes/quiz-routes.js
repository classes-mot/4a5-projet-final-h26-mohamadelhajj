import express from "express";
import quizControllers from "../controllers/quiz-controllers.js";
import { check } from "express-validator";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.get("/getQuiz/:uid", quizControllers.getQuizByUserId);

router.post(
  "/newQuiz",
  [checkAuth, check("titre").not().isEmpty()],
  quizControllers.createQuiz,
);

router.patch("/updateQuiz/:qid", [checkAuth], quizControllers.updateQuiz);

router.delete("/deleteQuiz/:qid", [checkAuth], quizControllers.deleteQuiz);

export default router;
