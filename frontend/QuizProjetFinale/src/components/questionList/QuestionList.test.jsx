import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import QuestionList from "./QuestionList";
import { AuthContext } from "../../context/auth-context";
import "@testing-library/jest-dom";

// Mock du composant QuestionItem
vi.mock("../questionItem/QuestionItem", () => ({
  default: ({ nomQuestion, onDelete, id }) => (
    <li data-testid={`question-item-${id}`}>
      <h2>{nomQuestion}</h2>
      <button onClick={() => onDelete(id)} data-testid="delete-btn">
        Supprimer
      </button>
    </li>
  ),
}));

describe("QuestionList - Tests d'intégration", () => {
  const mockAuthContext = {
    isLoggedIn: true,
    userId: "user123",
    token: "fake-token",
    login: vi.fn(),
    logout: vi.fn(),
  };

  const mockQuestions = [
    {
      id: "q1",
      nomQuestion: "Qu'est-ce que React ?",
      reponse: "Bibliothèque JavaScript",
    },
    {
      id: "q2",
      nomQuestion: "Qu'est-ce qu'un hook ?",
      reponse: "Fonction qui permet d'utiliser l'état",
    },
  ];

  // Test 1: Vérifier l'affichage de toutes les questions
  it("IT-1: Affiche toutes les questions de la liste", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <QuestionList items={mockQuestions} onDelete={vi.fn()} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Qu'est-ce que React ?")).toBeInTheDocument();
    expect(screen.getByText("Qu'est-ce qu'un hook ?")).toBeInTheDocument();
  });

  // Test 2: Vérifier l'affichage du message quand la liste est vide
  it("IT-2: Affiche un message quand la liste de questions est vide", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <QuestionList items={[]} onDelete={vi.fn()} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("No questions found")).toBeInTheDocument();
  });

  // Test 3: Vérifier que la fonction onDelete est appelée avec le bon ID
  it("IT-3: Appelle onDelete avec le bon ID lorsqu'un bouton de suppression est cliqué", () => {
    const mockOnDelete = vi.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <QuestionList items={mockQuestions} onDelete={mockOnDelete} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    const deleteButtons = screen.getAllByTestId("delete-btn");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("q1");
  });
});
