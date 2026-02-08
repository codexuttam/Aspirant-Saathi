import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ScoreCard from "../components/ScoreCard";
import FeedbackPanel from "../components/FeedbackPanel";
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



  return (
    <div className="attempt-wrapper">
      <Navbar />

      <div className="attempt-container">
        {/* HERO SECTION: SCORE */}
        {/* HERO SECTION: SCORE */}
        <section className="score-hero">
          <ScoreCard attempt={attempt} />

          {/* DYNAMIC EXAM SWITCHER */}
          <div className="exam-switcher-container">
            <label className="exam-switcher-label">Evaluate for:</label>
            <select
              className="exam-switcher-select"
              value={attempt.exam}
              onChange={async (e) => {
                const newExam = e.target.value;
                if (!newExam || newExam === attempt.exam) return;

                if (!window.confirm(`Re-evaluate this answer for ${newExam}? This will overwrite current marks.`)) return;

                try {
                  setLoading(true);
                  const res = await API.post(`/attempts/${id}/re-evaluate`, { exam: newExam });
                  setAttempt(res.data);
                  alert(`Re-evaluated successfully for ${newExam}!`);
                } catch (err) {
                  console.error(err);
                  alert("Re-evaluation failed");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <option value="UPSC">UPSC (Civil Services)</option>
              <option value="IB ACIO">IB ACIO (Tier-2)</option>
              <option value="SSC CGL">SSC CGL (Tier-3)</option>
              <option value="State PSC">State PSC</option>
              <option value="RBI Grade B">RBI Grade B</option>
              <option value="NABARD">NABARD</option>
              <option value="CAPF">CAPF (AC)</option>
            </select>
          </div>
        </section>

        <div className="qa-grid">
          {/* QUESTION */}
          <section className="detail-card question-card">
            <h3 className="section-title">📝 Question</h3>
            <p className="question-text">{attempt.question}</p>
          </section>

          {/* ANSWER */}
          <section className="detail-card answer-card">
            <h3 className="section-title">✍️ Your Answer</h3>
            {attempt.answerText && (
              <div className="answer-text-container">
                <p className="answer-text">{attempt.answerText}</p>
              </div>
            )}

            {attempt.imagePath && (
              <div className="answer-image-container">
                <img
                  src={`http://localhost:5000/${attempt.imagePath}`}
                  alt="Uploaded answer"
                  className="answer-image"
                />
              </div>
            )}
          </section>
        </div>

        {/* FEEDBACK SECTION FULL WIDTH */}
        <div className="feedback-section-full">
          <h2 className="section-header">Evaluation Review</h2>
          <FeedbackPanel attempt={attempt} />
        </div>

        {/* MODEL ANSWER CTA */}
        <div className="model-answer-cta">
          <Link to={`/attempt/${id}/model`} className="model-answer-btn">
            View Model Answer 🌟
          </Link>
          <p>See exactly how a topper would write this answer.</p>
        </div>
      </div>
    </div>
  );
}
