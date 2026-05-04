import { Link } from "react-router-dom";

import Card from "../UIElements/Card";
import "./QuizItem.css";

const QuizItem = (props) => {
  return (
    <li className="quiz-item">
      <Card className="quiz-item__content">
        <Link to={`/${props.id}/questions`}>
          <div className="quiz-item__info">
            <h2>{props.titre}</h2>
            <h3>
              {props.questionCount ?? 0}{" "}
              {props.questionCount <= 1 ? "question" : "questions"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default QuizItem;
