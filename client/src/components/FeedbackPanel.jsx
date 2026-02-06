import React from "react";

export default function FeedbackPanel({ attempt }) {
    const { evaluation, structureAnalysis } = attempt;

    return (
        <>
            {/* STRUCTURE ANALYSIS */}
            <section className="card">
                <h3>Structure Analysis</h3>
                <ul className="structure-list">
                    <li>Introduction: {structureAnalysis.intro.present ? "✔️" : "❌"}</li>
                    <li>Body: {structureAnalysis.body.present ? "✔️" : "❌"}</li>
                    <li>Conclusion: {structureAnalysis.conclusion.present ? "✔️" : "❌"}</li>
                </ul>
            </section>

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
        </>
    );
}
