import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./QuizForm.css";

const NewQuiz = () => {
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
      <h2>New Quiz</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>

      <div className="control">
        <label htmlFor="titre">Quiz title</label>
        <input id="titre" type="text" name="titre" />
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

export default NewQuiz;
