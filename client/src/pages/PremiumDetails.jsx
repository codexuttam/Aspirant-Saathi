import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import InternalLayout from "../components/InternalLayout";
import "../styles/PremiumDetails.css";

export default function PremiumDetails() {
    const navigate = useNavigate();
    const user = getUser();

    // Since this is static for now, we simulate a join date
    const premiumDate = new Date();
    // Simulate they joined today (or 1 day ago)
    premiumDate.setDate(premiumDate.getDate() - 1);
    const validUntil = new Date(premiumDate);
    validUntil.setMonth(validUntil.getMonth() + 1);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };


    if (!user?.isPro) {
        return (
            <InternalLayout>
                <div className="premium-details-container">
                    <div className="premium-card">
                        <h2>No Premium Access</h2>
                        <p>You currently do not have a Pro Aspirant subscription.</p>
                        <button className="premium-btn" onClick={() => navigate("/pricing")}>View Pricing</button>
                    </div>
                </div>
            </InternalLayout>
        );
    }

    return (
        <InternalLayout>
            <div className="premium-details-container">
                <div className="premium-card premium-active">
                    <div className="premium-header">
                        <div className="premium-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="url(#goldGradient)" stroke="none">
                                <defs>
                                    <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#fef08a" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#854d0e" />
                                    </linearGradient>
                                </defs>
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <h1 className="premium-title">Pro Aspirant Subscription</h1>
                        <p className="premium-status">Active & Unlimited</p>
                    </div>

                    <div className="premium-welcome-box">
                        <p className="welcome-text">
                            <strong>Thank you for upgrading, {user.name || "Aspirant"}! 🎖️</strong><br />
                            We are absolutely thrilled to welcome you to the Pro family. Aspirant-Saathi was built to give edge-case advantages to serious learners who refuse to settle. With your Pro plan, the competition literally doesn’t stand a chance. Now, let’s go secure that rank.
                        </p>
                        <button className="email-action-btn" onClick={() => navigate('/batch-studio')} style={{ cursor: 'pointer' }}>
                            Explore the Pro Dashboard
                        </button>
                    </div>

                    <div className="premium-info-grid">
                        <div className="info-item">
                            <span className="info-label">Current Plan</span>
                            <span className="info-value">Pro Aspirant (Monthly)</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">{formatDate(premiumDate)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Valid Until</span>
                            <span className="info-value">{formatDate(validUntil)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Remaining Tokens</span>
                            <span className="info-value text-gradient">Unlimited ∞</span>
                        </div>
                    </div>

                    <div className="premium-benefits">
                        <h3>Your Benefits Unlock:</h3>
                        <ul>
                            <li><span className="checkmark">✓</span> <strong>Unlimited Token Access</strong> - No more token recharges</li>
                            <li><span className="checkmark">✓</span> <strong>Batch Studio</strong> - Bulk evaluation of answers at once</li>
                            <li><span className="checkmark">✓</span> <strong>Detailed Model Answers</strong> - Access to top-tier AI generated answers</li>
                            <li><span className="checkmark">✓</span> <strong>Priority Queue</strong> - Get your evaluations before anyone else</li>
                            <li><span className="checkmark">✓</span> <strong>Deep Performance Analytics</strong> - See overall streak & trends</li>
                        </ul>
                    </div>

                    <div className="premium-footer">
                        <div className="support-box">
                            <p>Having issues or need a refund?</p>
                            <button className="support-link-btn" onClick={() => navigate('/refund-policy')}>
                                View Refund Policy & Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </InternalLayout>
    );
}
