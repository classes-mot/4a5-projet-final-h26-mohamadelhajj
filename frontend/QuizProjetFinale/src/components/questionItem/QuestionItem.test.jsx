import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import QuestionItem from "./QuestionItem";
import "@testing-library/jest-dom";

// Mock du modal
vi.mock("../modalSupprimerQuestion/ModalSuprimerQuestion", () => ({
  default: ({ onClose, onConfirm }) => (
    <div data-testid="modal-supprimer">
      <button onClick={onConfirm}>Confirmer</button>
      <button onClick={onClose}>Annuler</button>
    </div>
  ),
}));

describe("QuestionItem - Tests unitaires", () => {
  const mockProps = {
    id: "q1",
    nomQuestion: "Quelle est la capitale de la France ?",
    reponse: "Paris",
    onDelete: vi.fn(),
  };

  const mockAuthContextLoggedIn = {
    isLoggedIn: true,
    userId: "user123",
    token: "fake-token",
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

  // Test 1: Vérifier l'affichage des boutons EDIT et DELETE quand l'utilisateur est connecté
  it("UT-1: Affiche les boutons EDIT et DELETE lorsque l'utilisateur est connecté", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <QuestionItem {...mockProps} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  // Test 2: Vérifier que les boutons ne s'affichent pas quand l'utilisateur n'est pas connecté
  it("UT-2: N'affiche PAS les boutons EDIT et DELETE lorsque l'utilisateur n'est pas connecté", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
          <QuestionItem {...mockProps} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  // Test 3: Vérifier que le nom de la question est affiché
  it("UT-3: Affiche correctement le nom de la question", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <QuestionItem {...mockProps} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Quelle est la capitale de la France ?"),
    ).toBeInTheDocument();
  });
});
