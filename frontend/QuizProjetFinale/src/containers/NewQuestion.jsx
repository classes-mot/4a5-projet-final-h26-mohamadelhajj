import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./QuestionForm.css";

const NewQuestion = () => {
  const { t } = useTranslation();
  const quizId = useParams().quizId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  async function addQuestionSubmitHandler(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    const newQuestion = {
      nomQuestion: data.nomQuestion,
      typeQuestion: data.typeQuestion,
      reponse: data.reponse,
      quiz: quizId,
    };

    await sendRequest(
      `http://localhost:5000/api/questions/newQuestion/${quizId}`,
      "POST",
      JSON.stringify(newQuestion),
    );
    event.target.reset();
  }

  return (
    <form onSubmit={addQuestionSubmitHandler}>
      <h2>{t("newQuestion.title")}</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <div className="control">
        <label>{t("newQuestion.nom")}</label>
        <input type="text" name="nomQuestion" />
      </div>
      <div className="control">
        <label>{t("newQuestion.typeQuestion")}</label>
        <select name="typeQuestion">
          <option value="">{t("newQuestion.select")}</option>
          <option value="Ecrire">{t("newQuestion.write")}</option>
        </select>
      </div>
      <div className="control">
        <label>{t("newQuestion.reponse")}</label>
        <input type="text" name="reponse" />
      </div>
      <p className="form-actions">
        <button type="reset" className="button button-flat">
          {t("newQuestion.reset")}
        </button>
        <button type="submit" className="button">
          {t("newQuestion.add")}
        </button>
      </p>
    </form>
  );
};

export default NewQuestion;
