import { useNavigate } from "react-router-dom";
import "../styles/BulkEvaluator.css";

export default function BulkEvaluator() {
    const navigate = useNavigate();

    return (
        <div className="bulk-evaluator-container">
            <div className="pro-feature-card">
                <div className="pro-icon-container">
                    <div className="pro-icon" style={{ display: 'flex', color: '#4f46e5' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                    </div>
                </div>
                <h2 className="pro-title">Pro Feature</h2>
                <p className="pro-description">
                    Evaluate multiple answers at once with AI-powered analysis. This feature is available exclusively to Pro users.
                </p>
                <button className="upgrade-action-btn" onClick={() => navigate("/pricing")}>
                    Upgrade to Pro
                </button>
                <button className="go-back-link" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        </div>
    );
}
