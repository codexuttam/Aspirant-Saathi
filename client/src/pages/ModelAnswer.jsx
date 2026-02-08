
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/ModelAnswer.css";

export default function ModelAnswer() {
    const { id } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/attempts/${id}`)
            .then((res) => setAttempt(res.data))
            .catch((err) => console.error("Failed to fetch attempt", err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (!attempt) return <div className="error-message">Attempt not found</div>;

    const { evaluation, question } = attempt;
    const improvedAnswer = evaluation?.improvedAnswer || "No model answer generated yet.";

    return (
        <div className="model-answer-wrapper">
            <Navbar />

            <div className="model-answer-container">
                <header className="page-header">
                    <Link to={`/attempt/${id}`} className="back-link">← Back to Analysis</Link>
                    <h1>Pro-Level Model Answer 🏆</h1>
                    <p>See how an expert would tackle this question to score maximum marks.</p>
                </header>

                <section className="question-recap">
                    <h3>Question</h3>
                    <p>{question}</p>
                </section>

                <div className="model-paper">
                    <div className="paper-texture"></div>
                    <div className="model-content">
                        {improvedAnswer.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                    <div className="examiner-seal">
                        <span>EXAMINER APPROVED</span>
                    </div>
                </div>

                <div className="action-area">
                    <p>Compare this structure with your own attempt to identify gaps in flow and content depth.</p>
                </div>
            </div>
        </div>
    );
}
