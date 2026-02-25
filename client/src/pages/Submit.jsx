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
    const [exam, setExam] = useState("UPSC CSE (Mains) - GS");
    const [marks, setMarks] = useState(10);
    const [showPopup, setShowPopup] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
    }, [exam]);

    const handleSubmit = async () => {
        if (!question || (!answer && !file)) {
            setShowPopup(true);
            return;
        }

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
                alert("Insufficient tokens! Redirecting to pricing...");
                navigate("/pricing");
            } else {
                alert("Submission failed");
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
        </InternalLayout>
    );
}
