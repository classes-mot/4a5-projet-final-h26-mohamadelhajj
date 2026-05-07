import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import QuestionList from "../components/questionList/QuestionList";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import Card from "../components/UIElements/Card";
import "./QuestionQuiz.css";

const QuestionQuiz = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const quizId = useParams().quizId;
  const [loadedQuestion, setLoadedQuestion] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    //ne pas faire de fonction asynchrone dans useEffect qui retourne une promise, useEffect n'aime pas ca..
    const fetchQuestions = async () => {
      try {
        console.log("questions");
        const response = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `questions/getQuestions/${quizId}`,
        );
        console.log(response);
        setLoadedQuestion(response.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [sendRequest, quizId]);

  const questionDeleteHandler = (deletedQuestionId) => {
    setLoadedQuestion((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== deletedQuestionId),
    );
  };

  if (loadedQuestion.length === 0) {
    return (
      <div>
        {auth.isLoggedIn && (
          <div className="question-quiz__actions">
            <Link to={`/${quizId}/question/add`}>
              <button className="btn-primary">
                {t("QuestionQuiz.ajouter")}
              </button>
            </Link>
          </div>
        )}

        <div className="center">
          <Card>
            <h2>{t("QuestionQuiz.noQuestion")}</h2>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      {auth.isLoggedIn && (
        <div className="question-quiz__actions">
          <Link to={`/${quizId}/question/add`}>
            <button className="btn-primary">ADD QUESTION</button>
          </Link>
        </div>
      )}
      <QuestionList items={loadedQuestion} onDelete={questionDeleteHandler} />
    </>
  );
};

export default QuestionQuiz;
