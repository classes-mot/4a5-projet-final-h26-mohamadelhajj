import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  typeQuestion: { type: String, required: true },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  questions: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Question",
    },
  ],
});

export const Quiz = mongoose.model("Quiz", quizSchema);
