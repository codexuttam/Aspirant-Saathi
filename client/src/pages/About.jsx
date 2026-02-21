import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/About.css";

export default function About() {
    return (
        <div className="about-wrapper">
            <Navbar />

            <main className="about-container">
                {/* WHAT IS ASPIRANT SAATHI */}
                <section className="about-hero">
                    <div className="about-hero-text">
                        <span className="pill-badge about-badge">About the Platform</span>
                        <h1 className="about-title">What is <span className="brand-text">Aspirant-Saathi</span>?</h1>
                        <p className="about-subtitle">
                            Aspirant-Saathi is an advanced AI-powered mentor designed specifically for UPSC, State PSC, and competitive exam aspirants.
                            We bridge the gap between rigorous preparation and definitive feedback, transforming how you practice answer writing.
                            No more waiting days for evaluations—get actionable insights instantly.
                        </p>
                    </div>

                    <div className="about-hero-visuals">
                        <div className="hero-stat-card c1">
                            <h3>Focus</h3>
                            <p>Examiner Logic</p>
                            <span className="hero-emoji">🧠</span>
                        </div>
                        <div className="hero-stat-card c2">
                            <h3>Speed</h3>
                            <p>60 Seconds</p>
                            <span className="hero-emoji">⚡</span>
                        </div>
                        <div className="hero-stat-card c3">
                            <h3>Goal</h3>
                            <p>Better Ranks</p>
                            <span className="hero-emoji">🏆</span>
                        </div>
                    </div>
                </section>

                {/* INTERESTING FACTS */}
                <section className="facts-section">
                    <h2 className="facts-title">Interesting Facts</h2>
                    <div className="facts-grid">
                        <div className="fact-card">
                            <div className="fact-icon">📉</div>
                            <h3 className="fact-stat">85%</h3>
                            <p className="fact-desc">of serious aspirants cite lack of regular answer evaluation as their biggest hurdle in Mains prep.</p>
                        </div>
                        <div className="fact-card">
                            <div className="fact-icon">⏳</div>
                            <h3 className="fact-stat">3-7 Days</h3>
                            <p className="fact-desc">is the average time taken by traditional coaching institutes to return evaluated copies.</p>
                        </div>
                        <div className="fact-card">
                            <div className="fact-icon">🤖</div>
                            <h3 className="fact-stat">10,000+</h3>
                            <p className="fact-desc">high-scoring copies analyzed by our AI to understand exact patterns and examiner expectations.</p>
                        </div>
                    </div>
                </section>

                <div className="section-divider"></div>

                {/* HOW IT WORKS */}
                <div className="about-header">
                    <h2 className="about-title">How Aspirant-Saathi Works</h2>
                    <p className="about-subtitle">
                        From submission to deep analysis in seconds. Here is how your answer gets transformed into insights.
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
