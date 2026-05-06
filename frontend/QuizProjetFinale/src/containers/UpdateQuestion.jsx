import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

function UpdateQuestion() {
  const { quizId, questionId } = useParams();
  const [loadedQuestion, setLoadedQuestion] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    //ne pas faire de fonction asynchrone dans useEffect qui retourne une promise, useEffect n'aime pas ca..
    const fetchQuestions = async () => {
      try {
        console.log("questions");
        const response = await sendRequest(
          `http://localhost:5000/api/questions/getQuestions/${quizId}`,
        );
        console.log(response);
        setLoadedQuestion(response.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [sendRequest, quizId]);

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
    console.log(JSON.stringify(updatedQuestion));
    console.log("---------------");

    await sendRequest(
      `http://localhost:5000/api/questions/updateQuestion/${questionId}`,
      "PATCH",
      JSON.stringify(updatedQuestion),
    );
    event.target.reset();
  }

  return (
    <form onSubmit={UpdateQuestionSubmitHandler}>
      <h2>Update question</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>

      <div className="control">
        <label htmlFor="nomQuestion">Question name</label>
        <input
          id="nomQuestion"
          type="text"
          name="nomQuestion"
          defaultValue={questionSelected.nomQuestion}
        />
      </div>

      <div className="control">
        <label htmlFor="typeQuestion">Type of question</label>
        <select
          name="typeQuestion"
          id="typeQuestion"
          defaultValue={questionSelected.typeQuestion}
        >
          <option value="Ecrire">Writing</option>
          <option value="choix">Choice</option>
          <option value="choixMultiple">Multiple choice</option>
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
