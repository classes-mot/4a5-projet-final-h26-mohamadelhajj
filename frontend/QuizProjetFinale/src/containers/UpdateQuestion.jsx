import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

function UpdateQuestion() {
  const quizId = useParams().quizId;
  const questionId = useParams().questionId;
  const [loadedQuestion, setLoadedQuestion] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/questions/getQuestions/${quizId}`,
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
        <h2>Could not find question!</h2>
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
      <h2>Update question</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <div className="control">
        <label>Question name</label>
        <input
          type="text"
          name="nomQuestion"
          defaultValue={questionSelected.nomQuestion}
        />
      </div>
      <div className="control">
        <label>Type of question</label>
        <select
          name="typeQuestion"
          defaultValue={questionSelected.typeQuestion}
        >
          <option value="Ecrire">Writing</option>
        </select>
      </div>
      <div className="control">
        <label htmlFor="reponse">Answer</label>
        <input
          id="reponse"
          type="text"
          name="reponse"
          defaultValue={questionSelected.reponse}
        />
      </div>
      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button type="submit" className="button">
          Update
        </button>
      </p>
    </form>
  );
}

export default UpdateQuestion;
