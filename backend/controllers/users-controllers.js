import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import HttpError from "../utils/http-error.js";

const register = async (req, res, next) => {
  const { name, email, password, quiz } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    console.log(e);
    const erreur = new HttpError(
      "Enregistrement échoué, veuillez réessayer plus tard.",
      500,
    );
    return next(erreur);
  }
  console.log("existingUser", existingUser);
  if (existingUser) {
    const erreur = new HttpError(
      "Un utilisateur avec cette adresse e-mail existe déjà. ",
      422,
    );
    return next(erreur);
  }
  const createdUser = new User({
    name,
    email,
    password,
    quiz,
  });
  console.log("createdUser", createdUser);
  try {
    await createdUser.save();
  } catch (e) {
    console.log(e);
    const erreur = new HttpError(
      "Enregistrement échoué, veuillez réessayer plus tard.",
      500,
    );
    return next(erreur);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    console.erreur(e);
    const erreur = new HttpError(
      "Échec de connexion, veuillez réessayer plus tard.",
      500,
    );
    return next(erreur);
  }
  if (!existingUser || existingUser.password !== password) {
    const erreur = new HttpError(
      "Identification échouée, vérifiez vos identifiants.",
      401,
    );
    return next(erreur);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "cleSuperSecrete!",
      { expiresIn: "1h" },
    );
  } catch (e) {
    const erreur = new HttpError(
      "Erreur lors de la génération du jeton. Réessayer plus tard. ",
      500,
    );
    return next(erreur);
  }
  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.jid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    console.log(e);
    const erreur = new HttpError("Une erreur BD est survenue", 500);
    return next(erreur);
  }

  if (!user) {
    return next(new HttpError("Aucun user trouvé", 404));
  }

  res.json({
    user: user.toObject({ getters: true }),
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find().exec();
  res.json({ users: users });
};

const updateUser = async (req, res, next) => {
  const userId = req.params.jid;
  const userUpdate = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("Aucun user trouvé", 404));
    }

    user.updateOne(userUpdate);

    const updatedUser = await User.findById(userId);

    res.status(200).json({ user: updateUser.toObject({ getters: true }) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur lors de la mis à jour du jeu." });
  }
};

export default {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
};
