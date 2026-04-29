import express from "express";
import questionsControllers from "../controllers/questions-controllers.js";
import { check } from "express-validator";

const router = express.Router();

router.get("/getQuestions/:qid", questionsControllers.getQuestionsByQuizId);

router.post(
  "/newQuestion/:qid",
  check("nomQuestion").not().isEmpty(),
  check("typeQuestion").isIn(["choix", "choixMultiple", "Ecrire"]),
  check("reponse").not().isEmpty(),
  questionsControllers.createQuestion,
);

router.patch("/updateQuestion/:quid", questionsControllers.updateQuestion);

router.delete("/deleteQuestion/:quid", questionsControllers.deleteQuestion);

export default router;
