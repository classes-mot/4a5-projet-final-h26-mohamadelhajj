import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Card from "../UIElements/Card";
import ModalSupprimer from "../modalSupprimer/ModalSupprimer";
import "./QuizItem.css";

const QuizItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Ouvre le modal
  const showDeleteWarningHandler = (event) => {
    event.preventDefault(); // Empêche le clic de naviguer vers le lien parent
    setShowConfirmModal(true);
  };

  // Ferme le modal
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // Logique de suppression vers le backend
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/deleteQuiz/${props.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de la suppression.");
      }
      props.onDelete(props.id);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur de connexion au serveur");
    }
  };

  return (
    <>
      {showConfirmModal && (
        <ModalSupprimer
          onClose={cancelDeleteHandler}
          onConfirm={confirmDeleteHandler}
        />
      )}

      <li className="quiz-item">
        <Card className="quiz-item__content">
          <div className="quiz-item__container">
            <Link to={`/${props.id}/questions`}>
              <div className="quiz-item__info">
                <h2>{props.titre}</h2>
                <h3>
                  {props.questionCount ?? 0}{" "}
                  {props.questionCount <= 1 ? "question" : "questions"}
                </h3>
              </div>

              {auth.isLoggedIn && (
                <div className="quiz-item__actions">
                  <Link to={`/quiz/edit/${props.id}`}>
                    <button>EDIT</button>
                  </Link>
                  <button
                    className="btn-danger"
                    onClick={showDeleteWarningHandler}
                  >
                    DELETE
                  </button>
                </div>
              )}
            </Link>
          </div>
        </Card>
      </li>
    </>
  );
};

export default QuizItem;
