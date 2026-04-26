import express from "express";
import usersControllers from "../controllers/users-controllers.js";
import { check } from "express-validator";

const router = express.Router();

router.post("/register", check("email").isEmail(), usersControllers.register);

router.post("/login", usersControllers.login);

router.get("/allUsers", usersControllers.getAllUsers);

export default router;
