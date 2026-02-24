import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { getUser } from "../utils/auth";
import InternalLayout from "../components/InternalLayout";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [user] = useState(getUser());
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
    <InternalLayout>
      <div className="dashboard-container" style={{ margin: 0, padding: 0 }}>
        {/* HEADER */}
        <div className="dashboard-header" style={{ marginTop: 0 }}>
          <div className="welcome-text">
            <h1 style={{ fontSize: '28px', color: '#1e293b' }}>Welcome back, {user?.name || "Aspirant"}!</h1>
            <p style={{ color: '#64748b' }}>Track your progress and improve your answer writing skills.</p>
          </div>

          <Link to="/submit" className="new-attempt-btn" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
            </span> Write New Answer
          </Link>
        </div>

        {/* STATS OVERVIEW */}
        <div className="stats-grid">
          <div className="stat-card" style={{ background: '#fff', border: '1px solid #e9ecef', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span className="stat-label">Total Answers</span>
            <span className="stat-value" style={{ color: '#4f46e5' }}>{totalAnswers}</span>
          </div>

          <div className="stat-card" style={{ background: '#fff', border: '1px solid #e9ecef', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span className="stat-label">Average Score</span>
            <span className="stat-value" style={{ color: '#4f46e5' }}>{averageScore}</span>
          </div>

          <div className="stat-card" style={{ background: '#fff', border: '1px solid #e9ecef', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span className="stat-label">Streak</span>
            <span className="stat-value" style={{ color: '#4f46e5' }}>{streak}</span>
          </div>

          <div className="stat-card" style={{ background: '#fff', border: '1px solid #e9ecef', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span className="stat-label">Focus Area</span>
            <span className="stat-value" style={{ color: '#4f46e5' }}>{focusArea}</span>
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
                  style={{ background: '#fff', border: '1px solid #e9ecef', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                >
                  <div className="card-header">
                    <span className="exam-badge" style={{ background: '#eef2ff', color: '#4f46e5' }}>{attempt.exam}</span>
                    <span className="date">
                      {new Date(attempt.createdAt).toDateString()}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="question-preview" style={{ color: '#1e293b' }}>
                      {attempt.question.slice(0, 80)}…
                    </h3>

                    <div className="score-badge">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {attempt.status === "uploaded" ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Pending Evaluation
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            Evaluated
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#94a3b8' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
              </span>
              <h3>No attempts yet</h3>
              <p className="empty-text">
                You haven't submitted any answers for evaluation yet.
                Start writing today to see your progress!
              </p>
            </div>
          )}
        </div>
      </div>
    </InternalLayout>
  );
}
