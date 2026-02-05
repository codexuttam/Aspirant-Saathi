import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/AttemptDetails.css";

export default function AttemptDetails() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/attempts/${id}`)
      .then((res) => setAttempt(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="center">Loading evaluation…</p>;
  if (!attempt) return <p className="center">Attempt not found</p>;

  const { evaluation, structureAnalysis } = attempt;

  return (
    <div className="attempt-wrapper">
      <Navbar />

      <div className="attempt-container">
        {/* SCORE HEADER */}
        <div className="score-card">
          <div>
            <span className="exam-tag">{attempt.exam}</span>
            <h1 className="score">
              {evaluation?.totalMarks ?? "-"} / {evaluation?.maxMarks ?? 10}
            </h1>
            <span className={`status ${attempt.status}`}>
              {attempt.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* QUESTION */}
        <section className="card">
          <h3>Question</h3>
          <p>{attempt.question}</p>
        </section>

        {/* ANSWER */}
        <section className="card">
          <h3>Your Answer</h3>
          <p className="answer-text">{attempt.answerText}</p>

          {attempt.imagePath && (
            <img
              src={`http://localhost:5000/${attempt.imagePath}`}
              alt="Uploaded answer"
              className="answer-image"
            />
          )}
        </section>

        {/* STRUCTURE ANALYSIS */}
        <section className="card">
          <h3>Structure Analysis</h3>
          <ul className="structure-list">
            <li>Introduction: {structureAnalysis.intro.present ? "✔️" : "❌"}</li>
            <li>Body: {structureAnalysis.body.present ? "✔️" : "❌"}</li>
            <li>Conclusion: {structureAnalysis.conclusion.present ? "✔️" : "❌"}</li>
          </ul>
        </section>

        {/* MARKS BREAKUP */}
        {evaluation && (
          <section className="card">
            <h3>Marks Breakup</h3>
            <ul className="marks-list">
              <li>Introduction: {evaluation.breakup.introduction}</li>
              <li>Body: {evaluation.breakup.body}</li>
              <li>Conclusion: {evaluation.breakup.conclusion}</li>
            </ul>
          </section>
        )}

        {/* EXAMINER FEEDBACK */}
        {evaluation && (
          <section className="card feedback">
            <h3>Examiner Feedback</h3>
            <ul>
              {evaluation.feedback.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
