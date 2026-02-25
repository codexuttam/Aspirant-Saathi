import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ScoreCard from "../components/ScoreCard";
import FeedbackPanel from "../components/FeedbackPanel";
import { toast } from "react-hot-toast";
import "../styles/AttemptDetails.css";

// A beautiful premium spinner component
const PremiumLoader = () => (
  <div className="premium-loader-container">
    <div className="spinner-ring"></div>
    <p>AI is analyzing your answer...</p>
    <style>{`
      .premium-loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50vh;
        gap: 20px;
      }
      .spinner-ring {
        width: 60px;
        height: 60px;
        border: 4px solid #e2e8f0;
        border-top: 4px solid #4f46e5;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      .premium-loader-container p {
        color: #64748b;
        font-weight: 500;
        font-size: 1.1rem;
        animation: pulseText 2s ease-in-out infinite;
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes pulseText { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    `}</style>
  </div>
);

export default function AttemptDetails() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmExam, setConfirmExam] = useState(null);

  useEffect(() => {
    API.get(`/attempts/${id}`)
      .then((res) => setAttempt(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load attempt details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReEvaluate = async (examName) => {
    setConfirmExam(null);
    setLoading(true);
    try {
      const res = await API.post(`/attempts/${id}/re-evaluate`, { exam: examName });
      setAttempt(res.data);
      toast.success(`Successfully re-evaluated for ${examName}!`);
    } catch (err) {
      console.error(err);
      toast.error("Re-evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attempt-wrapper">
      <Navbar />

      <div className="attempt-container">
        {loading ? (
          <PremiumLoader />
        ) : !attempt ? (
          <div className="premium-loader-container">
            <p>Attempt not found</p>
          </div>
        ) : (
          <>
            {/* HERO SECTION: SCORE */}
            <section className="score-hero">
              <ScoreCard attempt={attempt} />

              {/* DYNAMIC EXAM SWITCHER */}
              <div className="exam-switcher-container">
                <label className="exam-switcher-label">Evaluate for:</label>
                <select
                  className="exam-switcher-select"
                  value={attempt.exam}
                  onChange={(e) => {
                    const newExam = e.target.value;
                    if (!newExam || newExam === attempt.exam) return;
                    setConfirmExam(newExam);
                  }}
                  disabled={loading}
                >
                  <option value="UPSC">UPSC (Civil Services)</option>
                  <option value="IB ACIO">IB ACIO (Tier-2)</option>
                  <option value="SSC CGL">SSC CGL (Tier-3)</option>
                  <option value="State PSC">State PSC</option>
                  <option value="RBI Grade B">RBI Grade B</option>
                  <option value="NABARD">NABARD</option>
                  <option value="CAPF">CAPF (AC)</option>
                </select>
              </div>
            </section>

            <div className="qa-grid">
              {/* QUESTION */}
              <section className="detail-card question-card">
                <h3 className="section-title">📝 Question</h3>
                <p className="question-text">{attempt.question}</p>
              </section>

              {/* ANSWER */}
              <section className="detail-card answer-card">
                <h3 className="section-title">✍️ Your Answer</h3>
                {attempt.answerText && (
                  <div className="answer-text-container">
                    <p className="answer-text">{attempt.answerText}</p>
                  </div>
                )}

                {attempt.imagePath && (
                  <div className="answer-image-container">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/${attempt.imagePath}`}
                      alt="Uploaded answer"
                      className="answer-image"
                    />
                  </div>
                )}
              </section>
            </div>

            {/* FEEDBACK SECTION FULL WIDTH */}
            <div className="feedback-section-full">
              <h2 className="section-header">Evaluation Review</h2>
              <FeedbackPanel attempt={attempt} />
            </div>

            {/* MODEL ANSWER CTA */}
            <div className="model-answer-cta">
              <Link to={`/attempt/${id}/model`} className="model-answer-btn">
                View Model Answer 🌟
              </Link>
              <p>See exactly how a topper would write this answer.</p>
            </div>
          </>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmExam && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal-box">
            <div className="modal-icon-container warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3>Re-evaluate Answer?</h3>
            <p>
              Are you sure you want to re-evaluate this answer for <strong>{confirmExam}</strong>?
              This will consume a token and <strong>overwrite</strong> your current marks and feedback permanently.
            </p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setConfirmExam(null)}>Cancel</button>
              <button className="modal-btn confirm" onClick={() => handleReEvaluate(confirmExam)}>Proceed</button>
            </div>
          </div>
          <style>{`
            .confirmation-modal-overlay {
              position: fixed;
              top: 0; left: 0; width: 100vw; height: 100vh;
              background: rgba(15, 23, 42, 0.6);
              backdrop-filter: blur(4px);
              display: flex; align-items: center; justify-content: center;
              z-index: 10000;
              animation: fadeIn 0.2s ease;
            }
            .confirmation-modal-box {
              background: white;
              border-radius: 20px;
              padding: 32px;
              width: 90%;
              max-width: 400px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.2);
              text-align: center;
              animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .modal-icon-container {
              width: 48px; height: 48px;
              border-radius: 50%;
              display: inline-flex; align-items: center; justify-content: center;
              margin-bottom: 20px;
            }
            .modal-icon-container.warning {
              background: #fef2f2;
              color: #ef4444;
            }
            .confirmation-modal-box h3 {
              margin: 0 0 12px 0;
              color: #0f172a;
              font-size: 1.25rem;
            }
            .confirmation-modal-box p {
              color: #64748b;
              font-size: 0.95rem;
              line-height: 1.5;
              margin: 0 0 24px 0;
            }
            .modal-actions {
              display: flex;
              gap: 12px;
            }
            .modal-btn {
              flex: 1;
              padding: 12px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.2s;
              border: none;
            }
            .modal-btn.cancel {
              background: #f1f5f9;
              color: #475569;
            }
            .modal-btn.cancel:hover { background: #e2e8f0; }
            .modal-btn.confirm {
              background: #4f46e5;
              color: white;
            }
            .modal-btn.confirm:hover { background: #4338ca; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
            @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}
    </div>
  );
}
