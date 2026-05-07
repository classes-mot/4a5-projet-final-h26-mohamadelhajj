import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

function UpdateQuestion() {
  const { t } = useTranslation();
  const quizId = useParams().quizId;
  const questionId = useParams().questionId;
  const [loadedQuestion, setLoadedQuestion] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `questions/getQuestions/${quizId}`,
        );
        setLoadedQuestion(response.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [sendRequest, quizId, questionId]);

  const questionSelected = loadedQuestion.find((qu) => qu._id === questionId);

  if (!questionSelected) {
    return (
      <div className="center">
        <h2>{t("UpdateQuestion.noQuestion")}</h2>
      </div>
    );
  }

  async function UpdateQuestionSubmitHandler(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    const updatedQuestion = {
      id: questionId,
      nomQuestion: data.nomQuestion,
      typeQuestion: data.typeQuestion,
      reponse: data.reponse,
      quiz: quizId,
    };

    await sendRequest(
      `http://localhost:5000/api/questions/updateQuestion/${questionId}`,
      "PATCH",
      JSON.stringify(updatedQuestion),
    );
  }

  return (
    <form onSubmit={UpdateQuestionSubmitHandler}>
      <h2>{t("UpdateQuestion.title")}</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <div className="control">
        <label>{t("UpdateQuestion.nom")}</label>
        <input
          type="text"
          name="nomQuestion"
          defaultValue={questionSelected.nomQuestion}
        />
      </div>
      <div className="control">
        <label>{t("UpdateQuestion.typeQuestion")}</label>
        <select
          name="typeQuestion"
          defaultValue={questionSelected.typeQuestion}
        >
          <option value="Ecrire">{t("UpdateQuestion.write")}</option>
        </select>
      </div>
      <div className="control">
        <label htmlFor="reponse">{t("UpdateQuestion.reponse")}</label>
        <input
          id="reponse"
          type="text"
          name="reponse"
          defaultValue={questionSelected.reponse}
        />
      </div>
      <p className="form-actions">
        <button type="reset" className="button button-flat">
          {t("UpdateQuestion.reset")}
        </button>
        <button type="submit" className="button">
          {t("UpdateQuestion.update")}
        </button>
      </p>
    </form>
  );
}

export default UpdateQuestion;
