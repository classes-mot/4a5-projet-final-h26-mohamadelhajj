import { Link } from "react-router-dom";

import Card from "../UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/quizzes`}>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.quizCount ?? 0} {props.quizCount <= 1 ? "quiz" : "quizzes"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
