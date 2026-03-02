import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InternalLayout from "../components/InternalLayout";
import ExamSelector from "../components/ExamSelector";
import QuestionInput from "../components/QuestionInput";
import AnswerUploader from "../components/AnswerUploader";
import { countWords } from "../utils/wordCounter";
import { getUser, setUser } from "../utils/auth";
import { toast } from "react-hot-toast";
import "../styles/Submit.css";

const SUBMISSION_QUOTES = [
    { text: "“Cooked and delivered. Now let the AI judge.”", author: "Answer Chef", icon: "🔥" },
    { text: "“W rizz in answer writing. Great job!”", author: "The Rizzler", icon: "✨" },
    { text: "“Main character energy activated. Your answer is in.”", author: "Main Character", icon: "👑" },
    { text: "“Ate that question and left absolutely no crumbs.”", author: "Hype Man", icon: "🍽️" },
    { text: "“Sent to the cloud. Hope you used the right keywords.”", author: "Tech Bro", icon: "☁️" },
    { text: "“Secured the bag. Time for the evaluation.”", author: "Hustle Mentor", icon: "💰" }
];

export default function Submit() {
    const navigate = useNavigate();
    const user = getUser();
    const [exam, setExam] = useState("UPSC CSE (Mains) - GS");
    const [marks, setMarks] = useState(10);
    const [showPopup, setShowPopup] = useState(false);
    const [showTokenConfirm, setShowTokenConfirm] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showIrrelevantPopup, setShowIrrelevantPopup] = useState(false);
    const [irrelevantMessage, setIrrelevantMessage] = useState("");

    const getMarksOptions = (examName) => {
        if (!examName) return [10, 15]; // Default

        if (examName.includes("Essay") && examName.includes("UPSC")) return [125];
        if (examName.includes("Essay")) return [25, 50, 100, 125]; // Generic Essay

        // UPSC / State PSC (GS/Optional)
        if (examName.includes("UPSC") || examName.includes("State PSC")) return [10, 15, 20];

        // CAPF / IB / Defence
        if (examName.includes("CAPF") || examName.includes("IB") || examName.includes("CDS")) return [10, 15, 20, 25];

        // SSC
        if (examName.includes("SSC")) return [25, 50];

        // Judiciary
        if (examName.includes("Judicial")) return [10, 15, 20, 25, 40];

        return [10, 15, 20]; // Default fallback
    };

    const allowedMarks = getMarksOptions(exam);

    useEffect(() => {
        const options = getMarksOptions(exam);
        if (!options.includes(marks)) {
            setMarks(options[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exam]);

    const handleSubmit = () => {
        if (!question || (!answer && !file)) {
            setShowPopup(true);
            return;
        }

        setShowTokenConfirm(true);
    };

    const processSubmit = async () => {
        setShowTokenConfirm(false);
        const formData = new FormData();
        formData.append("exam", exam);
        formData.append("marks", marks);
        formData.append("question", question);
        formData.append("answerText", answer);
        if (file) formData.append("answerImage", file);

        try {
            setLoading(true);
            const res = await API.post("/submit", formData);

            const randomQuote = SUBMISSION_QUOTES[Math.floor(Math.random() * SUBMISSION_QUOTES.length)];

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(147, 197, 253, 0.3)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        maxWidth: '380px',
                        color: '#fff',
                        fontFamily: "'Inter', sans-serif",
                        transform: t.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        cursor: 'pointer'
                    }}
                    onClick={() => toast.dismiss(t.id)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                        <div style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>Answer Submitted Successfully!</span>
                    </div>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{randomQuote.icon}</div>
                    <div style={{ fontSize: '15.5px', fontWeight: '600', lineHeight: '1.5', letterSpacing: '-0.2px', marginBottom: '10px', color: '#f8fafc' }}>
                        {randomQuote.text}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        — {randomQuote.author}
                    </div>
                </div>
            ), { duration: 5000, position: 'top-center' });

            console.log(res.data);

            if (res.data.tokens !== undefined) {
                const currentUser = getUser();
                if (currentUser) {
                    currentUser.tokens = res.data.tokens;
                    setUser(currentUser);
                    window.dispatchEvent(new Event("userUpdated"));
                }
            }

            setQuestion("");
            setAnswer("");
            setFile(null);
        } catch (err) {
            if (err.response && err.response.status === 402) {
                toast.error("Insufficient tokens! Redirecting to pricing...", { duration: 4000 });
                navigate("/pricing");
            } else if (err.response && err.response.status === 400 && err.response.data.error === "Irrelevant question") {
                setIrrelevantMessage(err.response.data.message);
                setShowIrrelevantPopup(true);

                // Keep tokens in sync for irrelevant question penalties
                if (err.response.data.tokens !== undefined) {
                    const currentUser = getUser();
                    if (currentUser) {
                        currentUser.tokens = err.response.data.tokens;
                        setUser(currentUser);
                        window.dispatchEvent(new Event("userUpdated"));
                    }
                }
            } else {
                setErrorMessage(err.response?.data?.error || err.message);
                setShowError(true);
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <InternalLayout>
            <div className="submit-container" style={{ margin: "0 auto", padding: "0" }}>
                <header className="submit-header" style={{ marginTop: "0", marginBottom: "32px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)", transform: "rotate(-5deg)"
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(5deg)" }}>
                                <path d="M12 2L2 7l10 5 10-5-10-5Z"></path>
                                <path d="M2 17l10 5 10-5"></path>
                                <path d="M2 12l10 5 10-5"></path>
                            </svg>
                        </div>
                        <h1 className="submit-title" style={{ fontSize: "36px", margin: 0, color: "#1e293b", fontWeight: "800", letterSpacing: "-1px" }}>
                            Aspirant <span style={{ background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Saathi</span>
                        </h1>
                    </div>
                </header>

                <div className="submit-card" style={{ padding: "32px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e9ecef", backgroundColor: "#fff" }}>
                    <div className="form-grid">
                        <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <ExamSelector exam={exam} setExam={setExam} />
                            </div>
                            <div style={{ flex: 0.5 }}>
                                <label className="form-label">Marks</label>
                                <select
                                    className="form-select"
                                    value={marks}
                                    onChange={(e) => setMarks(Number(e.target.value))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: '500' }}
                                >
                                    {allowedMarks.map(m => (
                                        <option key={m} value={m}>{m} Marks</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <QuestionInput question={question} setQuestion={setQuestion} />

                        <div className="form-group" style={{ marginTop: '24px' }}>
                            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Your Answer</span>
                                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "normal" }}>
                                    {countWords(answer)} words
                                </span>
                            </label>
                            <textarea
                                className="form-textarea"
                                rows="8"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '16px', backgroundColor: '#f8fafc' }}
                            />
                        </div>

                        <div className="divider" style={{ margin: '32px 0', borderTop: '0', display: 'flex', alignItems: 'center', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>
                            <span style={{ borderBottom: '1px solid #e2e8f0', flex: 1 }}></span>
                            <span style={{ margin: '0 16px' }}>OR UPLOAD IMAGE</span>
                            <span style={{ borderBottom: '1px solid #e2e8f0', flex: 1 }}></span>
                        </div>

                        <AnswerUploader file={file} setFile={setFile} />

                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', width: '100%', marginTop: '32px', borderRadius: '12px', padding: '16px', fontSize: '16px' }}
                        >
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                                    Processing...
                                </div>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Evaluate Answer
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                                </span>
                            )}
                        </button>

                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#eab308' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <h3 className="popup-title">Missing Details!</h3>
                        <p className="popup-text">
                            Please provide a question and either an answer text or an image to proceed.
                        </p>
                        <button className="popup-btn" onClick={() => setShowPopup(false)}>
                            Got it!
                        </button>
                    </div>
                </div>
            )}
            {showTokenConfirm && (
                <div className="popup-overlay" onClick={() => setShowTokenConfirm(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#token-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="token-gradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                                <path d="M12 18V6"></path>
                            </svg>
                        </div>
                        <h3 className="popup-title" style={{ color: '#1e293b' }}>Confirm Usage</h3>
                        <p className="popup-text" style={{ fontSize: '1.05rem', margin: '16px 0 24px 0', color: '#475569' }}>
                            {user?.isPro ? (
                                <>
                                    Ready to evaluate? Your <strong>Pro Plan</strong> includes <br />
                                    <strong style={{ fontSize: '1.4rem', color: '#4f46e5', display: 'inline-block', marginTop: '8px' }}>Unlimited Evaluations</strong>
                                </>
                            ) : (
                                <>
                                    Ready to evaluate? This action will use <br />
                                    <strong style={{ fontSize: '1.4rem', color: '#4f46e5', display: 'inline-block', marginTop: '8px' }}>{file ? 20 : 5} Tokens</strong>
                                </>
                            )}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                            <button className="popup-btn" style={{ background: '#f1f5f9', color: '#475569', flex: 1, boxShadow: 'none' }} onClick={() => setShowTokenConfirm(false)}>
                                Cancel
                            </button>
                            <button className="popup-btn" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)', flex: 1.5, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }} onClick={processSubmit}>
                                {user?.isPro ? "Evaluate Now" : "Deduct Tokens"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showIrrelevantPopup && (
                <div className="popup-overlay" onClick={() => setShowIrrelevantPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ border: '2px solid #f43f5e', background: 'linear-gradient(to bottom, #fff, #fff1f2)' }}>
                        <div className="popup-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', fontSize: '64px' }}>
                            ⚠️
                        </div>
                        <h3 className="popup-title" style={{ color: '#e11d48', fontWeight: '800' }}>Hold up, bestie!</h3>
                        <p className="popup-text" style={{ fontSize: '1.15rem', margin: '16px 0 12px 0', color: '#475569', fontWeight: '500' }}>
                            {irrelevantMessage}
                        </p>

                        {!user?.isPro && (
                            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px dashed #f43f5e', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="4" y2="12"></line></svg>
                                    -10 Tokens Penalized
                                </span>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#9f1239', marginTop: '6px', fontWeight: '600' }}>
                                    Warning: Keep questions relevant to the exam!
                                </span>
                            </div>
                        )}

                        <button className="popup-btn" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)' }} onClick={() => setShowIrrelevantPopup(false)}>
                            Got it, I'll be serious! ✨
                        </button>
                    </div>
                </div>
            )}
            {showError && (
                <div className="popup-overlay" onClick={() => setShowError(false)}>
                    <div className="popup-content popup-error" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#ef4444' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <h3 className="popup-title">Evaluation Failed</h3>
                        <p className="popup-text" style={{ fontSize: '14px' }}>
                            {errorMessage || "An unexpected error occurred while evaluating your answer. Please try again."}
                        </p>
                        <button className="popup-btn btn-error" onClick={() => setShowError(false)}>
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </InternalLayout>
    );
}
