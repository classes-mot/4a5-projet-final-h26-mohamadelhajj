import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import QuizItem from "./QuizItem";
import "@testing-library/jest-dom";

// Mock du modal
vi.mock("../modalSupprimer/ModalSupprimer", () => ({
  default: ({ onClose, onConfirm }) => (
    <div data-testid="modal-supprimer-quiz">
      <button onClick={onConfirm}>Confirmer suppression</button>
      <button onClick={onClose}>Annuler</button>
    </div>
  ),
}));

describe("QuizItem - Tests unitaires", () => {
  const mockProps = {
    id: "quiz1",
    titre: "Quiz sur la France",
    questionCount: 5,
    onDelete: vi.fn(),
  };

  const mockAuthContextLoggedIn = {
    isLoggedIn: true,
    userId: "user123",
    token: "fake-token-123",
    login: vi.fn(),
    logout: vi.fn(),
  };

  const mockAuthContextLoggedOut = {
    isLoggedIn: false,
    userId: null,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
  };

  // Test 1: Vérifier l'affichage du titre et du nombre de questions
  it("UT-1: Affiche correctement le titre et le nombre de questions", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <QuizItem {...mockProps} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Quiz sur la France")).toBeInTheDocument();
    expect(screen.getByText("5 questions")).toBeInTheDocument();
  });

  // Test 2: Vérifier l'affichage des boutons d'action pour utilisateur connecté
  it("UT-2: Affiche les boutons PLAY, EDIT, DELETE pour utilisateur connecté", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <QuizItem {...mockProps} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  // Test 3: Vérifier que les boutons ne s'affichent pas pour utilisateur déconnecté
  it("UT-3: N'affiche PAS les boutons d'action pour utilisateur déconnecté", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
          <QuizItem {...mockProps} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Play")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });
});
