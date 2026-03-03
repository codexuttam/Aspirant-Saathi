import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import InternalLayout from "../components/InternalLayout";
import "../styles/PremiumDetails.css";

export default function PremiumDetails() {
    const navigate = useNavigate();
    const user = getUser();

    const premiumDate = new Date();
    premiumDate.setDate(premiumDate.getDate() - 1);
    const validUntil = new Date(premiumDate);
    validUntil.setMonth(validUntil.getMonth() + 1);

    const formatDate = (date) =>
        date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    if (!user?.isPro) {
        return (
            <InternalLayout>
                <div className="pd-container">
                    <div className="pd-upgrade-wrapper">
                        {/* Crown icon */}
                        <div className="pd-crown-ring">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="crownGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#fde68a" />
                                        <stop offset="50%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#92400e" />
                                    </linearGradient>
                                </defs>
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                    fill="url(#crownGrad)"
                                />
                            </svg>
                        </div>

                        <h1 className="pd-upgrade-title">Unlock Pro Aspirant</h1>
                        <p className="pd-upgrade-subtitle">
                            You're on the free plan. Upgrade to get unlimited AI evaluations,
                            Batch Studio, priority queue, and deep analytics — everything a
                            serious aspirant needs to crack the exam.
                        </p>

                        {/* Feature chips */}
                        <div className="pd-feature-chips">
                            {[
                                "∞ Unlimited Tokens",
                                "⚡ Priority Queue",
                                "📊 Deep Analytics",
                                "📝 Batch Studio",
                                "🤖 Model Answers",
                            ].map((f) => (
                                <span key={f} className="pd-chip">{f}</span>
                            ))}
                        </div>

                        {/* Pricing CTA */}
                        <button
                            className="pd-cta-btn"
                            onClick={() => navigate("/pricing")}
                        >
                            <span>See Plans &amp; Pricing</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>

                        <p className="pd-hint">Cancel anytime · Secure via Razorpay</p>
                    </div>
                </div>
            </InternalLayout>
        );
    }

    return (
        <InternalLayout>
            <div className="pd-container">
                <div className="pd-pro-card">
                    <div className="pd-pro-glow" />

                    <div className="pd-pro-header">
                        <div className="pd-pro-icon">
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="goldGrad2" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#fef08a" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#854d0e" />
                                    </linearGradient>
                                </defs>
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                    fill="url(#goldGrad2)"
                                />
                            </svg>
                        </div>
                        <span className="pd-active-badge">● Active</span>
                        <h1 className="pd-pro-title">Pro Aspirant</h1>
                        <p className="pd-pro-sub">Unlimited Access · Premium Member</p>
                    </div>

                    {/* Welcome */}
                    <div className="pd-welcome">
                        <p className="pd-welcome-text">
                            <strong>Welcome to the elite, {user.name || "Aspirant"}! 🎖️</strong>
                            <br />
                            Your Pro plan is live. Crush the competition with unlimited AI
                            evaluations, batch analysis, and priority everything.
                        </p>
                        <button className="pd-explore-btn" onClick={() => navigate("/batch-studio")}>
                            Open Batch Studio →
                        </button>
                    </div>

                    {/* Info grid */}
                    <div className="pd-info-grid">
                        {[
                            { label: "Plan", value: "Pro Aspirant (Monthly)" },
                            { label: "Member Since", value: formatDate(premiumDate) },
                            { label: "Valid Until", value: formatDate(validUntil) },
                            { label: "Tokens", value: "Unlimited ∞", gold: true },
                        ].map(({ label, value, gold }) => (
                            <div key={label} className="pd-info-cell">
                                <span className="pd-info-label">{label}</span>
                                <span className={`pd-info-value${gold ? " gold" : ""}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div className="pd-benefits">
                        <h3 className="pd-benefits-title">Your Pro Benefits</h3>
                        <ul className="pd-benefits-list">
                            {[
                                ["Unlimited Token Access", "No more recharges, ever"],
                                ["Batch Studio", "Evaluate answers in bulk instantly"],
                                ["Model AI Answers", "Top-tier reference answers on demand"],
                                ["Priority Queue", "Your evaluations go first"],
                                ["Deep Analytics", "Streak, trends & performance dashboard"],
                            ].map(([title, desc]) => (
                                <li key={title} className="pd-benefit-item">
                                    <span className="pd-check">✓</span>
                                    <div>
                                        <strong>{title}</strong>
                                        <span className="pd-benefit-desc"> — {desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="pd-pro-footer">
                        <p className="pd-footer-text">Need help or want a refund?</p>
                        <button className="pd-refund-btn" onClick={() => navigate("/refund-policy")}>
                            Refund Policy &amp; Support
                        </button>
                    </div>
                </div>
            </div>
        </InternalLayout>
    );
}