import { useParams } from "react-router-dom";
import { useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./QuestionForm.css";

const NewQuestion = () => {
  const quizId = useParams().quizId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [typeQuestion, setTypeQuestion] = useState("");
  const [choices, setChoices] = useState([""]);

  // gérer changement type
  const handleTypeChange = (e) => {
    setTypeQuestion(e.target.value);
  };

  // modifier un choix
  const handleChoiceChange = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  // ajouter un choix
  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  async function addQuestionSubmitHandler(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    const newQuestion = {
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
      `http://localhost:5000/api/questions/newQuestion/${quizId}`,
      "POST",
      JSON.stringify(newQuestion),
    );

    event.target.reset();
    setChoices([""]);
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
        <select name="typeQuestion" onChange={handleTypeChange}>
          <option value="">--Select--</option>
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
