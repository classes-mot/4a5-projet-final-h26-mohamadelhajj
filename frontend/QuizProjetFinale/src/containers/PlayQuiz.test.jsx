// src/containers/PlayQuiz.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PlayQuiz from "./PlayQuiz";
import "@testing-library/jest-dom";

// Mock du hook useHttpClient
const mockSendRequest = vi.fn();

vi.mock("../hooks/http-hook", () => ({
  useHttpClient: () => ({
    isLoading: false,
    error: null,
    sendRequest: mockSendRequest,
    clearError: vi.fn(),
  }),
}));

// Mock des composants UI
vi.mock("../components/UIElements/ModalMessageErreur", () => ({
  default: ({ error }) => <div data-testid="error-modal">Erreur: {error}</div>,
}));

vi.mock("../components/UIElements/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner">Chargement...</div>,
}));

describe("PlayQuiz - Tests unitaires", () => {
  const mockQuestions = {
    questions: [
      {
        id: "q1",
        nomQuestion: "Quelle est la capitale de la France ?",
        reponse: "Paris",
        typeQuestion: "Géographie",
      },
      {
        id: "q2",
        nomQuestion: "Combien de continents y a-t-il ?",
        reponse: "7",
        typeQuestion: "Géographie",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSendRequest.mockResolvedValue(mockQuestions);
  });

  // Test 1: Vérifier que la première question est affichée après chargement
  it("UT-1: Affiche la première question après chargement des données", async () => {
    render(
      <MemoryRouter initialEntries={["/quiz/q1/play"]}>
        <Routes>
          <Route path="/quiz/:quizId/play" element={<PlayQuiz />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Quelle est la capitale de la France ?"),
      ).toBeInTheDocument();
    });
  });

  // Test 2: Vérifier la validation d'une bonne réponse
  it("UT-2: Incrémente le score quand la réponse est correcte", async () => {
    render(
      <MemoryRouter initialEntries={["/quiz/q1/play"]}>
        <Routes>
          <Route path="/quiz/:quizId/play" element={<PlayQuiz />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Quelle est la capitale de la France ?"),
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Tape ta réponse ici...");
    fireEvent.change(textarea, { target: { value: "Paris" } });

    const submitButton = screen.getByText("Valider");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("✓ Bonne réponse !")).toBeInTheDocument();
    });
  });

  // Test 3: Vérifier l'affichage du message d'erreur pour une mauvaise réponse
  it("UT-3: Affiche la bonne réponse quand l'utilisateur se trompe", async () => {
    render(
      <MemoryRouter initialEntries={["/quiz/q1/play"]}>
        <Routes>
          <Route path="/quiz/:quizId/play" element={<PlayQuiz />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Quelle est la capitale de la France ?"),
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Tape ta réponse ici...");
    fireEvent.change(textarea, { target: { value: "Lyon" } });

    const submitButton = screen.getByText("Valider");
    fireEvent.click(submitButton);

    // Vérifier que le message d'erreur contient la bonne réponse
    await waitFor(() => {
      // Chercher "Paris" dans le contenu de l'élément de feedback
      const parisElement = screen.getByText("Paris");
      expect(parisElement).toBeInTheDocument();

      // Vérifier aussi que le texte d'erreur est présent
      expect(screen.getByText(/La bonne réponse était/)).toBeInTheDocument();
    });
  });
});
