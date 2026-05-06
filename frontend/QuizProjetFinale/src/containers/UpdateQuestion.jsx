import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

function UpdateQuestion() {
  const { quizId, questionId } = useParams();
  const [loadedQuestion, setLoadedQuestion] = useState([]);
  const [typeQuestion, setTypeQuestion] = useState("");
  const [choices, setChoices] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/questions/getQuestions/${quizId}`,
        );

        setLoadedQuestion(response.questions);

        const question = response.questions.find((q) => q._id === questionId);

        if (question) {
          setTypeQuestion(question.typeQuestion);

          if (question.choices && question.choices.length > 0) {
            setChoices(question.choices);
          } else {
            setChoices([""]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [sendRequest, quizId, questionId]);

  const questionSelected = loadedQuestion.find((qu) => qu._id === questionId);

  // changer type
  const handleTypeChange = (e) => {
    setTypeQuestion(e.target.value);
  };

  // modifier choix
  const handleChoiceChange = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  // ajouter choix
  const addChoice = () => {
    setChoices([...choices, ""]);
  };

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
      choices:
        typeQuestion === "choix" || typeQuestion === "choixMultiple"
          ? choices
          : [],
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
          onChange={handleTypeChange}
        >
          <option value="Ecrire">Writing</option>
          <option value="choix">Choice</option>
          <option value="choixMultiple">Multiple choice</option>
        </select>
      </div>

      {(typeQuestion === "choix" || typeQuestion === "choixMultiple") && (
        <div className="control">
          <label>Choices</label>

          {choices.map((choice, index) => (
            <input
              key={index}
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              placeholder={`Choice ${index + 1}`}
            />
          ))}

          <button type="button" onClick={addChoice}>
            + Add choice
          </button>
        </div>
      )}

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
