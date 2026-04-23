import { Quiz } from "../models/quiz.js";
import { User } from "../models/user.js";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const getQuizByUserId = async (req, res, next) => {};

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

const updateQuiz = async (req, res, next) => {};

const deleteQuiz = async (req, res, next) => {};

export default {
  getQuizByUserId,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
