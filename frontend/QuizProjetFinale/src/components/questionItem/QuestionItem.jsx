import Card from "../UIElements/Card";
import { Link } from "react-router-dom";
import "./QuestionItem.css";

const QuestionItem = (props) => {
  return (
    <>
      <li>
        <Card>
          <div>
            <div>
              <h2>{props.nomQuestion}</h2>
            </div>
            <div className="question-item__actions">
              <Link to={`/question/edit/${props.id}`}>
                <button>EDIT</button>
              </Link>
            </div>
          </div>
        </Card>
      </li>
    </>
  );
};

export default QuestionItem;
