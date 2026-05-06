// src/components/quizList/QuizList.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import QuizList from "./QuizList";
import { AuthContext } from "../../context/auth-context";
import "@testing-library/jest-dom";

// Mock du composant QuizItem
vi.mock("../quizItem/QuizItem", () => ({
  default: ({ titre, questionCount }) => (
    <li data-testid="quiz-item">
      <h2>{titre}</h2>
      <span>{questionCount} questions</span>
      <button>Play</button>
      <button>Edit</button>
      <button>Delete</button>
    </li>
  ),
}));

describe("QuizList - Tests d'intégration", () => {
  const mockAuthContext = {
    isLoggedIn: true,
    userId: "user123",
    token: "fake-token",
    login: vi.fn(),
    logout: vi.fn(),
  };

  const mockQuizzes = [
    {
      id: "quiz1",
      titre: "Quiz JavaScript",
      questions: [{ id: "q1" }, { id: "q2" }, { id: "q3" }],
    },
    {
      id: "quiz2",
      titre: "Quiz React",
      questions: [{ id: "q4" }, { id: "q5" }],
    },
  ];

  // Test d'intégration 1: Vérifier l'affichage de la liste complète des quiz
  it("IT-1: Affiche correctement tous les quiz de la liste", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <QuizList items={mockQuizzes} onDelete={vi.fn()} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Quiz JavaScript")).toBeInTheDocument();
    expect(screen.getByText("Quiz React")).toBeInTheDocument();
    expect(screen.getByText("3 questions")).toBeInTheDocument();
    expect(screen.getByText("2 questions")).toBeInTheDocument();
  });

  // Test d'intégration 2: Vérifier l'affichage des quiz quand la liste est vide
  it("IT-2: Affiche un message quand la liste de quiz est vide", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <QuizList items={[]} onDelete={vi.fn()} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("No Quizzes found.")).toBeInTheDocument();
  });
});
