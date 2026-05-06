import { useTranslation } from "react-i18next";
import QuestionItem from "../questionItem/QuestionItem";
import Card from "../UIElements/Card";
import "./QuestionList.css";

const QuestionList = (props) => {
  const { t } = useTranslation();
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>{t("QuestionList.noQuestion")}</h2>
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
