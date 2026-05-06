import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./QuizForm.css";

const NewQuiz = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  async function addQuizSubmitHandler(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    const newQuiz = {
      titre: data.titre,
      user: auth.userId,
      questions: [],
    };
    console.log(JSON.stringify(newQuiz));

    console.log("---------------");

    await sendRequest(
      "http://localhost:5000/api/quiz/newQuiz",
      "POST",
      JSON.stringify(newQuiz),
      {
        Authorization: "Bearer " + auth.token,
      },
    );
    event.target.reset();
  }

  return (
    <form onSubmit={addQuizSubmitHandler}>
      <h2>{t("newQuiz.title")}</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>

      <div className="control">
        <label htmlFor="titre">{t("newQuiz.titleQuiz")}</label>
        <input id="titre" type="text" name="titre" />
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          {t("newQuiz.reset")}
        </button>
        <button type="submit" className="button">
          {t("newQuiz.add")}
        </button>
      </p>
    </form>
  );
};

export default NewQuiz;
