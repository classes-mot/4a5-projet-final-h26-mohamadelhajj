import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState, useCallback } from "react";
import Users from "./containers/Users";
import UserQuiz from "./containers/UserQuiz";
import NewQuiz from "./containers/NewQuiz";
import UpdateQuiz from "./containers/UpdateQuiz";
import QuestionQuiz from "./containers/QuestionQuiz";
import NewQuestion from "./containers/NewQuestion";
import RootLayout from "./containers/Roots";
import ErrorPage from "./Containers/ErrorPage";
import { AuthContext } from "./context/auth-context";
import "./App.css";

const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Users /> },
      { path: "users", element: <Users /> },
      { path: ":userId/quizzes", element: <UserQuiz /> },
      { path: "quiz/add", element: <NewQuiz /> },
      { path: "quiz/edit/:quizId", element: <UpdateQuiz /> },
      { path: ":quizId/questions", element: <QuestionQuiz /> },
      { path: ":quizId/question/add", element: <NewQuestion /> },
    ],
  },
]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Users /> },
      { path: "users", element: <Users /> },
      { path: ":userId/quizzes", element: <UserQuiz /> },
      { path: ":quizId/questions", element: <QuestionQuiz /> },
    ],
  },
]);

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);
  if (token) {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={routerLogin} />
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );
  }
}

export default App;
