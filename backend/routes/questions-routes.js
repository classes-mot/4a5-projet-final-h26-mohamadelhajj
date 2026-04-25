import express from "express";
import questionsControllers from "../controllers/questions-controllers.js";
import { check } from "express-validator";
import { checkQuiz } from "../middleware/check-auth.js";

const router = express.Router();

router.get("/getQuestions/:qid", questionsControllers.getQuestionsByQuizId);

router.post("/newQuestion", [checkQuiz], questionsControllers.createQuestion);

router.patch("/updateQuestion/:quid", questionsControllers.updateQuestion);

router.delete("/deleteQuestion/:quid", questionsControllers.deleteQuestion);

export default router;
