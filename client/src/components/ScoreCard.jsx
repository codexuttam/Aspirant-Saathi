import React from "react";

export default function ScoreCard({ attempt }) {
    const { evaluation, exam, status } = attempt;

    return (
        <>
            {/* SCORE HEADER */}
            <div className="score-card">
                <div>
                    <span className="exam-tag">{exam}</span>
                    <h1 className="score">
                        {evaluation?.totalMarks ?? "-"} / {evaluation?.maxMarks ?? 10}
                    </h1>
                    <span className={`status ${status}`}>
                        {status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* MARKS BREAKUP - Integrated into ScoreCard usage area */}
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
        </>
    );
}
