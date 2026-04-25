import { Quiz } from "../models/quiz.js";
import { User } from "../models/user.js";
import { Question } from "../models/question.js";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const getQuizByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let quizForUser;
  try {
    quizForUser = await Quiz.find({ user: userId });
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }

  if (!quizForUser || quizForUser.length === 0) {
    return next(new HttpError("Aucun quiz trouvé pour cet utilisateur", 404));
  }

  res.json({
    quiz: quizForUser.map((quiz) => quiz.toObject({ getters: true })),
  });
};

const createQuiz = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("données saisies invalides valider votre payload", 422),
    );
  }
  const { titre, typeQuestion, questions } = req.body;
  const userId = req.userData.userId;
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }
  if (!user) {
    const err = new HttpError("Utilisateur non trouvé", 404);
    return next(err);
  }

  const createdQuiz = new Quiz({
    titre,
    typeQuestion,
    user: userId,
    questions,
  });
  try {
    await createdQuiz.save();
    user.quiz.push(createdQuiz);
    await user.save();
  } catch (e) {
    const err = new HttpError("Création dans la BD échouée.", 500);
    return next(err);
  }
  res.status(201).json({ quiz: createdQuiz });
};

const updateQuiz = async (req, res, next) => {
  const quizId = req.params.qid;
  const quizUpdates = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      quizUpdates,
      { new: true, runValidators: true }, // { new: true } pour renvoyer l'objet modifié
    ).populate("user");

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }

    res.status(200).json({ quiz: updatedQuiz.toObject({ getters: true }) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erreur lors de la mis à jour du quiz." });
  }
};

const deleteQuiz = async (req, res, next) => {
  const quizId = req.params.qid;

  try {
    const quiz = await Quiz.findById(quizId).populate("user");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    await Question.deleteMany({ quiz: quizId });
    await quiz.deleteOne();
    quiz.user.quiz.pull(quiz._id);
    await quiz.user.save();

    res.status(200).json({ message: "Quiz supprimé" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur lors de la suppression du quiz." });
  }
};

export default {
  getQuizByUserId,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
