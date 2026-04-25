import express from "express";
import quizControllers from "../controllers/quiz-controllers.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/getQuiz/:uid", quizControllers.getQuizByUserId);

router.post("/newQuiz", [checkAuth], quizControllers.createQuiz);

router.patch("/updateQuiz/:qid", [checkAuth], quizControllers.updateQuiz);

router.delete("/deleteQuiz/:qid", [checkAuth], quizControllers.deleteQuiz);

export default router;
