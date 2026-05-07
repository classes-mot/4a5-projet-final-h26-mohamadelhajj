import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import "./PlayQuiz.css";

const SCORE_LABELS = [
  "Retente ta chance !",
  "Pas mal !",
  "Très bien !",
  "Excellent !",
  "Parfait !",
];

const isCorrect = (userAnswer, reponse) =>
  userAnswer.trim().toLowerCase() === reponse.trim().toLowerCase();

const PlayQuiz = () => {
  const { t } = useTranslation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [openAnswer, setOpenAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `questions/getQuestions/${quizId}`,
        );
        setQuestions(response.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [sendRequest, quizId]);

  const handleSubmitOpen = () => {
    if (answered || !openAnswer.trim()) return;
    const q = questions[current];
    const correct = isCorrect(openAnswer, q.reponse);
    setAnswered(true);
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setOpenAnswer("");
      setAnswered(false);
      setLastCorrect(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setOpenAnswer("");
    setAnswered(false);
    setLastCorrect(false);
    setDone(false);
  };

  if (isLoading)
    return (
      <div className="pq-spinner-wrap">
        <Spinner />
      </div>
    );

  if (error) return <ModalMessageErreur error={error} onClear={clearError} />;

  if (!questions.length) return null;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const labelIdx = Math.min(
      Math.floor((pct / 100) * (SCORE_LABELS.length - 1)),
      SCORE_LABELS.length - 1,
    );

    return (
      <div className="pq-wrap">
        <div className="pq-score-card">
          <p className="pq-score-big">
            {score} / {questions.length}
          </p>
          <p className="pq-score-label">{SCORE_LABELS[labelIdx]}</p>
          <div className="pq-btn-row">
            <button className="pq-btn-secondary" onClick={handleRestart}>
              {t("PlayQuiz.restart")}
            </button>
            <button className="pq-btn-primary" onClick={() => navigate("/")}>
              {t("PlayQuiz.accueil")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = Math.round((current / questions.length) * 100);

  return (
    <div className="pq-wrap">
      <div className="pq-progress-bg">
        <div className="pq-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="pq-meta">
        <span className="pq-badge">
          Question {current + 1} / {questions.length}
        </span>
        <span className="pq-meta-score">Score : {score}</span>
      </div>

      <div className="pq-question-card">
        <p className="pq-question-text">{q.nomQuestion}</p>
        <p className="pq-question-type">{q.typeQuestion}</p>
      </div>

      <div>
        <textarea
          className="pq-open-input"
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          placeholder="Tape ta réponse ici..."
          disabled={answered}
        />
        {!answered && (
          <button className="pq-open-submit" onClick={handleSubmitOpen}>
            Valider
          </button>
        )}
      </div>

      {answered && (
        <div className={`pq-feedback ${lastCorrect ? "ok" : "ko"}`}>
          {lastCorrect ? (
            <>✓ Bonne réponse !</>
          ) : (
            <>
              ✗ La bonne réponse était : <strong>{q.reponse}</strong>
            </>
          )}
        </div>
      )}

      {answered && (
        <div className="pq-nav">
          <button className="pq-btn-primary" onClick={handleNext}>
            {current + 1 < questions.length ? "Suivant →" : "Voir mon score"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayQuiz;
