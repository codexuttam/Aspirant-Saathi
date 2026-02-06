import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/Report.css";

export default function Report() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/attempts")
            .then((res) => setAttempts(res.data))
            .catch((err) => console.error("Failed to load attempts", err))
            .finally(() => setLoading(false));
    }, []);

    // Compute Statistics
    const totalAttempts = attempts.length;
    const evaluatedAttempts = attempts.filter((a) => a.status === "evaluated");

    // Exam Distribution
    const examCounts = attempts.reduce((acc, curr) => {
        acc[curr.exam] = (acc[curr.exam] || 0) + 1;
        return acc;
    }, {});
    const exams = Object.keys(examCounts);

    // Score Calculations
    const averageScore =
        evaluatedAttempts.length > 0
            ? (
                evaluatedAttempts.reduce((sum, a) => sum + (a.evaluation?.totalMarks || 0), 0) /
                evaluatedAttempts.length
            ).toFixed(1)
            : 0;

    const maxScore = 10; // Assuming 10 for now as per other files

    return (
        <div className="report-wrapper">
            <Navbar />

            <div className="report-container">
                <div className="report-header">
                    <h1 className="report-title">Performance Analytics 📊</h1>
                    <p className="report-subtitle">Deep dive into your answer writing progress</p>
                </div>

                {loading ? (
                    <p style={{ textAlign: "center" }}>Loading report...</p>
                ) : totalAttempts === 0 ? (
                    <div className="empty-state">
                        <span style={{ fontSize: "3rem" }}>📉</span>
                        <h3>No data to report</h3>
                        <p>Start submitting answers to see your analytics here.</p>
                    </div>
                ) : (
                    <>
                        <div className="analytics-grid">

                            {/* Exam Distribution Card */}
                            <div className="analytics-card">
                                <h3 className="card-title">📚 Exam Coverage</h3>
                                <div className="distribution-list">
                                    {exams.map((exam) => (
                                        <div key={exam} className="dist-item">
                                            <span className="dist-label">{exam}</span>
                                            <div className="dist-bar-container">
                                                <div
                                                    className="dist-bar"
                                                    style={{
                                                        width: `${(examCounts[exam] / totalAttempts) * 100}%`,
                                                        backgroundColor: getRandomColor(exam)
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="dist-value">{examCounts[exam]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Average Score Card */}
                            <div className="analytics-card">
                                <h3 className="card-title">🎯 Average Score</h3>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "150px", flexDirection: "column" }}>
                                    <span style={{ fontSize: "4rem", fontWeight: "800", color: "#3b82f6" }}>
                                        {averageScore}
                                    </span>
                                    <span style={{ color: "#64748b" }}>/ {maxScore}</span>
                                </div>
                            </div>

                            {/* Recent Performance Trend (Last 5) */}
                            <div className="analytics-card">
                                <h3 className="card-title">📈 Recent Trend</h3>
                                <div className="score-trend">
                                    {evaluatedAttempts.slice(0, 7).reverse().map((attempt, i) => (
                                        <div key={i} className="trend-bar-group">
                                            <div
                                                className="trend-bar"
                                                style={{ height: `${(attempt.evaluation.totalMarks / 10) * 100}%` }}
                                                title={`Score: ${attempt.evaluation.totalMarks}`}
                                            ></div>
                                            {/* <span className="trend-date">{new Date(attempt.createdAt).getDate()}</span> */}
                                        </div>
                                    ))}
                                    {evaluatedAttempts.length === 0 && <p className="text-muted">No evaluations yet</p>}
                                </div>
                            </div>

                        </div>

                        {/* Detailed Table */}
                        <div className="analytics-card">
                            <h3 className="card-title">📝 Detailed Log</h3>
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Exam</th>
                                            <th>Question Preview</th>
                                            <th>Status</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((attempt) => (
                                            <tr key={attempt._id}>
                                                <td>{new Date(attempt.createdAt).toLocaleDateString()}</td>
                                                <td>{attempt.exam}</td>
                                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {attempt.question}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${attempt.status}`}>
                                                        {attempt.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {attempt.status === 'evaluated' ? attempt.evaluation?.totalMarks : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function getRandomColor(str) {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
