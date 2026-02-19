import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/Pricing.css";

const Pricing = () => {
    return (
        <div className="pricing-wrapper">
            <Navbar />

            <div className="pricing-container">
                <header className="pricing-header">
                    <h1 className="pricing-title">Simple, Transparent Pricing</h1>
                    <p className="pricing-subtitle">
                        Start for free, upgrade for power. No hidden fees.
                    </p>
                </header>

                <div className="pricing-cards">
                    {/* Free Plan */}
                    <div className="pricing-card free">
                        <div className="card-header">
                            <h2 className="plan-name">Starter</h2>
                            <div className="price">
                                <span className="currency">₹</span>0
                                <span className="period">/forever</span>
                            </div>
                            <p className="plan-desc">Perfect for trying out the platform.</p>
                        </div>

                        <div className="features-list">
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span><strong>100 Free Tokens</strong> on sign up</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span><strong>5 Tokens</strong> per evaluation</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Basic Answer Analysis</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Community Support</span>
                            </div>
                        </div>

                        <button className="plan-btn outline" disabled>Current Plan</button>
                    </div>

                    {/* Premium Plan */}
                    <div className="pricing-card premium">
                        <div className="badge">MOST POPULAR</div>
                        <div className="card-header">
                            <h2 className="plan-name">Pro Aspirant</h2>
                            <div className="price">
                                <span className="currency">₹</span>499
                                <span className="period">/month</span>
                            </div>
                            <p className="plan-desc">For serious aspirants needing daily feedback.</p>
                        </div>

                        <div className="features-list">
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span><strong>Unlimited Tokens</strong></span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Detailed AI Feedback with Model Answers</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Priority Evaluation Queue</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Performance Analytics Dashboard</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>24/7 Email Support</span>
                            </div>
                        </div>

                        <button className="plan-btn solid" onClick={() => alert("Premium gateway coming soon!")}>
                            Explore Premium
                        </button>
                    </div>
                </div>

                <div className="token-info">
                    <h3>How tokens work?</h3>
                    <p>
                        Every evaluation costs <strong>5 tokens</strong>. You get <strong>100 tokens</strong> for free when you sign up.
                        Need more? Upgrade to Premium for unlimted access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
