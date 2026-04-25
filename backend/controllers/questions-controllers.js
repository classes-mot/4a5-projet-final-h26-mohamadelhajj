import { Quiz } from "../models/quiz.js";
import { Question } from "../models/question.js";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const getQuestionsByQuizId = async (req, res, next) => {
  const quizId = req.params.qid;

  let questionsForQuiz;
  try {
    questionsForQuiz = await Question.find({ quiz: quizId });
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }

  if (!questionsForQuiz || questionsForQuiz.length === 0) {
    return next(new HttpError("Aucune question trouvé pour ce quiz", 404));
  }

  res.json({
    question: questionsForQuiz.map((question) =>
      question.toObject({ getters: true }),
    ),
  });
};

const createQuestion = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("données saisies invalides valider votre payload", 422),
    );
  }
  const { nomQuestion, typeQuestion, reponse } = req.body;
  const quizId = req.quizData.quizId;
  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }
  if (!quiz) {
    const err = new HttpError("Utilisateur non trouvé", 404);
    return next(err);
  }

  const createdQuestion = new Question({
    nomQuestion,
    typeQuestion,
    reponse,
    quiz: quizId,
  });
  try {
    await createdQuestion.save();
    quiz.questions.push(createdQuestion);
    await quiz.save();
  } catch (e) {
    const err = new HttpError("Création dans la BD échouée.", 500);
    return next(err);
  }
  res.status(201).json({ question: createdQuestion });
};

const updateQuestion = async (req, res, next) => {
  const questionId = req.params.quid;
  const questionUpdates = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      questionUpdates,
      { new: true, runValidators: true },
    ).populate("quiz");

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    res.status(200).json({ quiz: updatedQuestion.toObject({ getters: true }) });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Erreur lors de la mis à jour du question." });
  }
};

const deleteQuestion = async (req, res, next) => {
  const questionId = req.params.quid;

  try {
    const question = await Question.findById(questionId).populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question non trouvé" });
    }
    await Question.deleteOne();
    question.quiz.questions.pull(question._id);
    await question.quiz.save();

    res.status(200).json({ message: "Question supprimé" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du question." });
  }
};

export default {
  getQuestionsByQuizId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
