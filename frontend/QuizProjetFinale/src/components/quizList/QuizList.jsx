import QuizItem from "../quizItem/QuizItem";
import Card from "../UIElements/Card";
import "./QuizList.css";

const QuizList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Quizzes found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="quiz-list">
      {props.items.map((quiz) => (
        <QuizItem
          key={quiz.id}
          id={quiz.id}
          name={quiz.name}
          questionCount={quiz.questions.length}
        />
      ))}
    </ul>
  );
};

export default QuizList;
