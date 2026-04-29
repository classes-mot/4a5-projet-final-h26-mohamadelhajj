import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  nomQuestion: { type: String, required: true },
  typeQuestion: { type: String, required: true },
  choix: String,
  reponse: { type: String, required: true },
  quiz: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Quiz",
  },
});

export const Question = new mongoose.model("Question", questionSchema);
