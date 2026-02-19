
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/About.css";

export default function About() {
    const steps = [
        {
            id: 1,
            title: "Upload Your Answer",
            description: "Take a clear photo of your handwritten answer or type it directly into our editor. We support various formats to make it easy for you.",
            icon: "📸"
        },
        {
            id: 2,
            title: "AI Analysis",
            description: "Our advanced AI, trained on topper copies and examiner guidelines, scans your answer for structure, content, and keywords.",
            icon: "🤖"
        },
        {
            id: 3,
            title: "Get Instant Feedback",
            description: "Receive a detailed evaluation with marks, strengths, weaknesses, and specific suggestions on how to improve.",
            icon: "📊"
        },
        {
            id: 4,
            title: "View Model Answer",
            description: "Compare your attempt with a high-quality model answer to understand the ideal structure and content depth.",
            icon: "📝"
        }
    ];

    return (
        <div className="about-wrapper">
            <Navbar />

            <main className="about-container">
                <div className="about-header">
                    <h1 className="about-title">How Aspirant-Saathi Works</h1>
                    <p className="about-subtitle">
                        Your personal AI evaluator that helps you master the art of answer writing.
                        Understand the process from submission to evaluation.
                    </p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-visual visual-upload">
                            <div className="upload-doc">
                                <div className="doc-line"></div>
                                <div className="doc-line short"></div>
                                <div className="upload-arrow">↑</div>
                            </div>
                        </div>
                        <h3 className="step-title">Upload Your Answer</h3>
                        <p className="step-description">
                            Take a clear photo of your handwritten answer or type it directly into our editor. We support various formats to make it easy for you.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-visual visual-ai">
                            <div className="ai-brain">
                                <div className="brain-node n1"></div>
                                <div className="brain-node n2"></div>
                                <div className="brain-node n3"></div>
                                <div className="brain-circuit"></div>
                            </div>
                        </div>
                        <h3 className="step-title">AI Analysis</h3>
                        <p className="step-description">
                            Our advanced AI, trained on topper copies and examiner guidelines, scans your answer for structure, content, and keywords.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-visual visual-feedback">
                            <div className="feedback-chart">
                                <div className="chart-bar b1"></div>
                                <div className="chart-bar b2"></div>
                                <div className="chart-bar b3"></div>
                                <div className="chart-tick">✓</div>
                            </div>
                        </div>
                        <h3 className="step-title">Get Instant Feedback</h3>
                        <p className="step-description">
                            Receive a detailed evaluation with marks, strengths, weaknesses, and specific suggestions on how to improve.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <div className="step-visual visual-model">
                            <div className="model-doc">
                                <div className="star-badge">★</div>
                                <div className="doc-content"></div>
                            </div>
                        </div>
                        <h3 className="step-title">View Model Answer</h3>
                        <p className="step-description">
                            Compare your attempt with a high-quality model answer to understand the ideal structure and content depth.
                        </p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2 className="cta-title">Ready to Improve Your Score?</h2>
                    <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>
                        Join thousands of aspirants who are writing better answers every day.
                    </p>
                    <Link to="/submit" className="cta-button">
                        Start Writing Now
                    </Link>
                </div>
            </main>

            <footer className="footer">
                <p>
                    Built for serious aspirants · Structured thinking · Honest feedback
                </p>
            </footer>
        </div>
    );
}
