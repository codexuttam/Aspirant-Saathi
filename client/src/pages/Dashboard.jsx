import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/attempts")
      .then((res) => setAttempts(res.data))
      .catch((err) => console.error("Failed to load attempts", err))
      .finally(() => setLoading(false));
  }, []);

  // Derived stats
  const totalAnswers = attempts.length;
  // Calculate Average Score
  const evaluatedAttempts = attempts.filter(
    (a) => a.status === "evaluated" && a.evaluation
  );
  const totalScore = evaluatedAttempts.reduce(
    (sum, a) => sum + (a.evaluation.totalMarks || 0),
    0
  );
  const averageScore =
    evaluatedAttempts.length > 0
      ? (totalScore / evaluatedAttempts.length).toFixed(1)
      : "-";

  // Calculate Streak
  const uniqueDates = new Set(
    attempts.map((a) => new Date(a.createdAt).toDateString())
  );

  let streakCount = 0;
  let d = new Date();

  // If today is not recorded, check yesterday to continue streak
  if (!uniqueDates.has(d.toDateString())) {
    d.setDate(d.getDate() - 1);
  }

  if (uniqueDates.has(d.toDateString())) {
    while (uniqueDates.has(d.toDateString())) {
      streakCount++;
      d.setDate(d.getDate() - 1);
    }
  }

  const streak = `${streakCount} Days`;
  const focusArea = attempts[0]?.exam || "UPSC";

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <div className="welcome-text">
            <h1>Welcome back, Aspirant! 👋</h1>
            <p>Track your progress and improve your answer writing skills.</p>
          </div>

          <Link to="/submit" className="new-attempt-btn">
            <span>✏️</span> Write New Answer
          </Link>
        </div>

        {/* STATS OVERVIEW */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Answers</span>
            <span className="stat-value">{totalAnswers}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{averageScore}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{streak}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Focus Area</span>
            <span className="stat-value">{focusArea}</span>
          </div>
        </div>

        {/* RECENT ATTEMPTS */}
        <div className="recent-attempts">
          <h2 className="section-title">Recent Evaluations</h2>

          {loading ? (
            <p>Loading your attempts…</p>
          ) : attempts.length > 0 ? (
            <div className="attempts-grid">
              {attempts.slice(0, 6).map((attempt) => (
                <Link
                  to={`/attempt/${attempt._id}`}
                  key={attempt._id}
                  className="attempt-card"
                >
                  <div className="card-header">
                    <span className="exam-badge">{attempt.exam}</span>
                    <span className="date">
                      {new Date(attempt.createdAt).toDateString()}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="question-preview">
                      {attempt.question.slice(0, 80)}…
                    </h3>

                    <div className="score-badge">
                      <span>
                        {attempt.status === "uploaded"
                          ? "⏳ Pending Evaluation"
                          : "⚡ Evaluated"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>No attempts yet</h3>
              <p className="empty-text">
                You haven't submitted any answers for evaluation yet.
                Start writing today to see your progress!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
