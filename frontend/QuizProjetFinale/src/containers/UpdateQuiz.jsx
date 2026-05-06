import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./QuizForm.css";

function UpdateQuiz() {
  const { t } = useTranslation();
  const quizId = useParams().quizId;
  const auth = useContext(AuthContext);
  const [loadedquiz, setLoadedQuiz] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    //ne pas faire de fonction asynchrone dans useEffect qui retourne une promise, useEffect n'aime pas ca..
    const fetchQuizzes = async () => {
      try {
        console.log("quizzes");
        const response = await sendRequest(
          `http://localhost:5000/api/quiz/getQuiz/${auth.userId}`,
        );
        console.log(response);
        setLoadedQuiz(response.quiz);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, [sendRequest, auth.userId]);

  const quizSelected = loadedquiz.find((q) => q._id === quizId);

  if (!quizSelected) {
    return (
      <div className="center">
        <h2>{t("UpdateQuiz.noQuiz")}</h2>
      </div>
    );
  }

  async function UpdateQuizSubmitHandler(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const updatedQuiz = {
      id: quizId,
      titre: data.titre,
      user: auth.userId,
      questions: [quizSelected.questions],
    };
    console.log(JSON.stringify(updatedQuiz));
    console.log("---------------");

    await sendRequest(
      `http://localhost:5000/api/quiz/updateQuiz/${quizId}`,
      "PATCH",
      JSON.stringify(updatedQuiz),
      {
        Authorization: "Bearer " + auth.token,
      },
    );
    event.target.reset();
  }

  return (
    <form onSubmit={UpdateQuizSubmitHandler}>
      <h2>{t("UpdateQuiz.title")}</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>

      <div className="control">
        <label htmlFor="titre">{t("UpdateQuiz.titleQuiz")}</label>
        <input
          id="titre"
          type="text"
          name="titre"
          defaultValue={quizSelected.titre}
        />
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          {t("UpdateQuiz.reset")}
        </button>
        <button type="submit" className="button">
          {t("UpdateQuiz.update")}
        </button>
      </p>
    </form>
  );
}

export default UpdateQuiz;
