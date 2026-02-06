import { useParams } from "react-router-dom";
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
        <ScoreCard attempt={attempt} />

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

        <FeedbackPanel attempt={attempt} />
      </div>
    </div>
  );
}
