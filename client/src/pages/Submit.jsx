import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ExamSelector from "../components/ExamSelector";
import QuestionInput from "../components/QuestionInput";
import AnswerUploader from "../components/AnswerUploader";
import { countWords } from "../utils/wordCounter";
import "../styles/Submit.css";

export default function Submit() {
    const [exam, setExam] = useState("UPSC");
    const [showPopup, setShowPopup] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!question || (!answer && !file)) {
            setShowPopup(true);
            return;
        }

        const formData = new FormData();
        formData.append("exam", exam);
        formData.append("question", question);
        formData.append("answerText", answer);
        if (file) formData.append("answerImage", file);

        try {
            setLoading(true);
            const res = await API.post("/submit", formData);
            alert("Answer submitted successfully");
            console.log(res.data);
            // Optional: Reset form
            setQuestion("");
            setAnswer("");
            setFile(null);
        } catch (err) {
            alert("Submission failed");
            console.error(err);
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
                        <ExamSelector exam={exam} setExam={setExam} />

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
