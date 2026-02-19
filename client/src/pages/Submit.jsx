import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ExamSelector from "../components/ExamSelector";
import QuestionInput from "../components/QuestionInput";
import AnswerUploader from "../components/AnswerUploader";
import { countWords } from "../utils/wordCounter";
import { getUser, setUser } from "../utils/auth";
import "../styles/Submit.css";

export default function Submit() {
    const navigate = useNavigate();
    // Not changing this state, just noting it is correct.
    const [exam, setExam] = useState("UPSC CSE (Mains) - GS");
    const [marks, setMarks] = useState(10);
    const [showPopup, setShowPopup] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Helper to get allowed marks for the selected exam
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
            alert("Answer submitted successfully");
            console.log(res.data);

            // Update local user tokens
            if (res.data.tokens !== undefined) {
                const currentUser = getUser();
                if (currentUser) {
                    currentUser.tokens = res.data.tokens;
                    setUser(currentUser);
                    // Dispatch event for Navbar/ProfileMenu to listen
                    window.dispatchEvent(new Event("userUpdated"));
                }
            }

            // Optional: Reset form
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
        <div className="submit-wrapper">
            <Navbar />

            <div className="submit-container">
                <header className="submit-header">
                    <h1 className="submit-title">Submit Your Answer</h1>
                    <p className="submit-subtitle">
                        Get instant AI evaluation based on real examiner criteria.
                    </p>
                </header>

                <div className="submit-card">
                    <div className="form-grid">

                        {/* Exam Selection */}
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
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0' }}
                                >
                                    {allowedMarks.map(m => (
                                        <option key={m} value={m}>{m} Marks</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Question Input */}
                        <QuestionInput question={question} setQuestion={setQuestion} />

                        {/* Answer Input */}
                        <div className="form-group">
                            <label className="form-label">
                                Your Answer
                                <span style={{ float: "right", fontSize: "0.85rem", color: "#64748b", fontWeight: "normal" }}>
                                    {countWords(answer)} words
                                </span>
                            </label>
                            <textarea
                                className="form-textarea"
                                rows="10"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                            />
                        </div>

                        <div className="divider">OR UPLOAD IMAGE</div>

                        {/* File Upload */}
                        <AnswerUploader file={file} setFile={setFile} />

                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>Evaluate Answer ✨</>
                            )}
                        </button>

                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-icon">⚠️</div>
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
        </div>
    );
}
