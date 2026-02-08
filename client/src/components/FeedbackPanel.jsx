import React from "react";

export default function FeedbackPanel({ attempt }) {
    const { evaluation, structureAnalysis } = attempt;

    return (
        <div className="feedback-grid">
            {/* STRUCTURE ANALYSIS */}
            <section className="card">
                <h3>Structure Analysis</h3>
                <ul className="structure-list">
                    <li>Introduction: {structureAnalysis?.intro?.present ? "✔️" : "❌"}</li>
                    <li>Body: {structureAnalysis?.body?.present ? "✔️" : "❌"}</li>
                    <li>Conclusion: {structureAnalysis?.conclusion?.present ? "✔️" : "❌"}</li>
                </ul>
            </section>

            {/* STRENGTHS */}
            {evaluation?.strengths?.length > 0 && (
                <section className="card feedback strength">
                    <h3>Strengths</h3>
                    <ul>
                        {evaluation.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* WEAKNESSES */}
            {evaluation?.weaknesses?.length > 0 && (
                <section className="card feedback weakness">
                    <h3>Weaknesses</h3>
                    <ul>
                        {evaluation.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* SUGGESTIONS */}
            {evaluation?.suggestions?.length > 0 && (
                <section className="card feedback suggestion">
                    <h3>Suggestions for Improvement</h3>
                    <ul>
                        {evaluation.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
