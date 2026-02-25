import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { getUser } from "../utils/auth";
import InternalLayout from "../components/InternalLayout";
import dashboardHeaderImg from "../assets/dashboard_header_professional.png";
import emptyStateImg from "../assets/empty_state_professional.png";
import "../styles/Dashboard.css";

const MOTIVATIONAL_QUOTES = [
  { text: "“Success is not final, failure is not fatal: it is the courage to continue that counts.”", author: "Mr. Anonymous" },
  { text: "“The only way to achieve the impossible is to believe it is possible.”", author: "Ms. Anonymous" },
  { text: "“Don't watch the clock; do what it does. Keep going.”", author: "Mr. Anonymous" },
  { text: "“The future depends on what you do today.”", author: "Ms. Anonymous" },
  { text: "“Discipline is the bridge between goals and accomplishment.”", author: "Mr. Anonymous" },
  { text: "“It does not matter how slowly you go as long as you do not stop.”", author: "Ms. Anonymous" },
  { text: "“There are no shortcuts to any place worth going.”", author: "Mr. Anonymous" }
];

export default function Dashboard() {
  const [user] = useState(getUser());
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    // Initial random quote on mount/refresh
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

    const quoteInterval = setInterval(() => {
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(quoteInterval);
  }, []);

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

  return (
    <InternalLayout>
      <div className="dashboard-container" style={{ margin: 0, padding: 0 }}>
        {/* HEADER */}
        {/* HEADER HERO */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="welcome-text">
              <h1>Welcome back, {user?.name || "Aspirant"}!</h1>
              <p>Track your progress and let AI mentor you to perfection.</p>
              <Link to="/submit" className="new-attempt-btn">
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                </span> Write New Answer
              </Link>
            </div>
            <div className="header-graphic">
              <img src={dashboardHeaderImg} alt="Dashboard Illustration" className="header-illustration" />
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="stats-grid">
          <div className="stat-card formal-card">
            <div className="stat-icon-square">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Answers</span>
              <span className="stat-value">{totalAnswers}</span>
            </div>
          </div>

          <div className="stat-card formal-card">
            <div className="stat-icon-square">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Average Score</span>
              <span className="stat-value">{averageScore}</span>
            </div>
          </div>

          <div className="stat-card formal-card">
            <div className="stat-icon-square">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Streak</span>
              <span className="stat-value">{streak}</span>
            </div>
          </div>

        </div>

        {/* DAILY FOCUS QUOTE */}
        <div className="daily-focus-container" style={{ margin: "24px 0 48px 0" }}>
          <div className="stat-card formal-card daily-focus-card" style={{ padding: "32px", display: "flex", alignItems: "flex-start", gap: "24px" }}>
            <div className="stat-icon-square" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1.5.5 1.5 1.5L5 15c0 2 0 6-2 6zm15 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.5c0 1.5-.5 3-1.5 3-.25 1-1 4-2 6z"></path></svg>
            </div>
            <div className="stat-info" style={{ flex: 1, gap: "12px" }}>
              <span className="stat-label" style={{ fontSize: "1rem" }}>Daily Focus</span>
              <span className="quote-text" style={{ fontSize: "1.25rem", fontStyle: "italic", color: "#1e293b", lineHeight: "1.6", fontWeight: "500" }}>{quote.text}</span>
              <span className="quote-author" style={{ fontSize: "1rem", color: "#64748b", fontWeight: "600" }}>- {quote.author}</span>
            </div>
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
              <div className="empty-illustration">
                <img src={emptyStateImg} alt="No attempts yet" />
              </div>
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
