import { Link, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../UIElements/Card";
import { AuthContext } from "../../context/auth-context";
import ModalSuprimerQuestion from "../modalSupprimerQuestion/ModalSuprimerQuestion";
import "./QuestionItem.css";

const QuestionItem = (props) => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const quizId = useParams().quizId;
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
        `http://localhost:5000/api/questions/deleteQuestion/${props.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
        <ModalSuprimerQuestion
          onClose={cancelDeleteHandler}
          onConfirm={confirmDeleteHandler}
        />
      )}

      <li>
        <Card>
          <div>
            <div>
              <h2>{props.nomQuestion}</h2>
            </div>
            {auth.isLoggedIn && (
              <div className="question-item__actions">
                <Link to={`/${quizId}/question/edit/${props.id}`}>
                  <button>{t("QuestionItem.edit")}</button>
                </Link>
                <button
                  className="btn-danger"
                  onClick={showDeleteWarningHandler}
                >
                  {t("QuestionItem.delete")}
                </button>
              </div>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default QuestionItem;
