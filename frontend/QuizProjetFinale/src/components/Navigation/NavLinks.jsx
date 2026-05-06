import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/auth-context";
import ModalSignup from "../signup/ModalSignup";
import ModalLogin from "../login/ModalLogin"; // Import du nouveau modal

import "./NavLinks.css";

const NavLinks = (props) => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  // États pour la visibilité des modaux
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // État pour les données (utilisé pour les deux modaux car ils partagent email/password)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handlers pour Signup
  const openSignupHandler = () => setShowSignup(true);
  const closeSignupHandler = () => {
    setShowSignup(false);
    setFormData({ name: "", email: "", password: "" });
  };

  // Handlers pour Login
  const openLoginHandler = () => setShowLogin(true);
  const closeLoginHandler = () => {
    setShowLogin(false);
    setFormData({ name: "", email: "", password: "" });
  };

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Logique d'inscription
  const confirmSignupHandler = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          quiz: [],
        }),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Erreur inscription.");

      auth.login(responseData.user.id, responseData.token);
      closeSignupHandler();
    } catch (err) {
      alert(err.message);
    }
  };

  // LOGIQUE DE CONNEXION (Backend : /api/users/login)
  const confirmLoginHandler = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Identification échouée.");
      }

      console.log("Connexion réussie !");
      // On passe l'ID et le token au contexte d'auth
      auth.login(responseData.userId, responseData.token);

      closeLoginHandler();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {showSignup && (
        <ModalSignup
          onClose={closeSignupHandler}
          onConfirm={confirmSignupHandler}
          onInputChange={inputChangeHandler}
          values={formData}
        />
      )}

      {showLogin && (
        <ModalLogin
          onClose={closeLoginHandler}
          onConfirm={confirmLoginHandler}
          onInputChange={inputChangeHandler}
          values={formData}
        />
      )}

      <ul className="nav-links">
        <li>
          <NavLink to="/">{t("NavLinks.Allusers")}</NavLink>
        </li>
        {auth.isLoggedIn && (
          <>
            <li>
              <NavLink to={`/${auth.userId}/quizzes`}>
                {t("NavLinks.MyQuizzes")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/quiz/add">{t("NavLinks.AddQuiz")}</NavLink>
            </li>
            <li>
              <button onClick={auth.logout}>{t("NavLinks.logout")}</button>
            </li>
          </>
        )}
        {!auth.isLoggedIn && (
          <>
            <li>
              <button className="nav-btn-link" onClick={openLoginHandler}>
                {t("NavLinks.login")}
              </button>
            </li>
            <li>
              <button className="nav-btn-link" onClick={openSignupHandler}>
                {t("NavLinks.signup")}
              </button>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default NavLinks;
