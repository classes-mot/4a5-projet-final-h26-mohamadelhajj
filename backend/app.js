import express from "express";
import usersRoutes from "./routes/users-routes.js";
import quizRoutes from "./routes/quiz-routes.js";
import questionsRoutes from "./routes/questions-routes.js";
import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./utils/bd.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/MohamadElhajj_BDQuiz";

// Connexion à MongoDB
await connectDB(MONGODB_URI);

const app = express();
// chercher les variables d'environnemnt
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // header et value * quels domaines peuvent acceder a notre serveur
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  ); //quel header sont autorisés ( pourait etre * pour tout)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // quelles methodes HTTP sont autorisées
  next();
});

app.use("/api/users", usersRoutes);

app.use("/api/quiz/", quizRoutes);

app.use("/api/questions/", questionsRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
