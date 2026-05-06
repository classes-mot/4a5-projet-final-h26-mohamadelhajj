import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import Card from "../UIElements/Card";
import { AuthContext } from "../../context/auth-context";
import "./QuestionItem.css";

const QuestionItem = (props) => {
  const auth = useContext(AuthContext);
  const quizId = useParams().quizId;
  return (
    <>
      <li>
        <Card>
          <div>
            <div>
              <h2>{props.nomQuestion}</h2>
            </div>
            {auth.isLoggedIn && (
              <div className="question-item__actions">
                <Link to={`/${quizId}/question/edit/${props.id}`}>
                  <button>EDIT</button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default QuestionItem;
