import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizList from "../components/quizList/QuizList";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

const UserQuiz = () => {
  const userId = useParams().userId;
  const [loadedquiz, setLoadedQuiz] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    //ne pas faire de fonction asynchrone dans useEffect qui retourne une promise, useEffect n'aime pas ca..
    const fetchQuizzes = async () => {
      try {
        console.log("quizzes");
        const response = await sendRequest(
          `http://localhost:5000/api/quiz/getQuiz/${userId}`,
        );
        console.log(response);
        setLoadedQuiz(response.quiz);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, [sendRequest, userId]);

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <QuizList items={loadedquiz} />
    </>
  );
};

export default UserQuiz;
