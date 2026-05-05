import QuestionItem from "../questionItem/QuestionItem";
import Card from "../UIElements/Card";
import "./QuestionList.css";

const QuestionList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Questions found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="question-list">
      {props.items.map((question) => (
        <QuestionItem
          key={question.id}
          id={question.id}
          nomQuestion={question.nomQuestion}
          reponse={question.reponse}
          onDelete={props.onDelete}
        />
      ))}
    </ul>
  );
};

export default QuestionList;
