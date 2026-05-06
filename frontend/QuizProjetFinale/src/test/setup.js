import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "QuestionItem.edit": "Edit",
        "QuestionItem.delete": "Delete",
        "QuizItem.play": "Play",
        "QuizItem.edit": "Edit",
        "QuizItem.delete": "Delete",
        "QuestionList.noQuestion": "No questions found",
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: "fr",
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

// Nettoie automatiquement après chaque test
afterEach(() => {
  cleanup();
});
