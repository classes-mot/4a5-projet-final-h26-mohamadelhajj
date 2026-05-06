import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./QuestionForm.css";

const NewQuestion = () => {
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
      <h2>New Question</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <div className="control">
        <label>Question name</label>
        <input type="text" name="nomQuestion" />
      </div>
      <div className="control">
        <label>Type of question</label>
        <select name="typeQuestion">
          <option value="">--Select--</option>
          <option value="Ecrire">Writing</option>
        </select>
      </div>
      <div className="control">
        <label>Answer</label>
        <input type="text" name="reponse" />
      </div>
      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button type="submit" className="button">
          Add
        </button>
      </p>
    </form>
  );
};

export default NewQuestion;
