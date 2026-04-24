import express from "express";
import usersControllers from "../controllers/users-controllers.js";

const router = express.Router();

router.post("/register", usersControllers.register);

router.post("/login", usersControllers.login);

router.get("/allUsers", usersControllers.getAllUsers);

export default router;
