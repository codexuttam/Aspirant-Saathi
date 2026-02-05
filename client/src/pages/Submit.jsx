import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
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
                        <div className="form-group">
                            <label className="form-label">Exam Category</label>
                            <select
                                className="form-select"
                                value={exam}
                                onChange={(e) => setExam(e.target.value)}
                            >
                                <option value="UPSC">UPSC (Civil Services)</option>
                                <option value="CAPF">CAPF</option>
                                <option value="IB">IB</option>
                                <option value="State PSC">State PSC</option>
                            </select>
                        </div>

                        {/* Question Input */}
                        <div className="form-group">
                            <label className="form-label">Question</label>
                            <textarea
                                className="form-textarea"
                                rows="3"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter the exact question here..."
                            />
                        </div>

                        {/* Answer Input */}
                        <div className="form-group">
                            <label className="form-label">Your Answer</label>
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
                        <div className="form-group">
                            <div className="file-upload-box">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <span className="upload-icon">📷</span>
                                <p className="upload-text">
                                    <span>Click to upload</span> or drag and drop<br />
                                    handwritten answer image
                                </p>
                            </div>
                            {file && (
                                <div className="file-preview">
                                    <span>📄 {file.name}</span>
                                    <button
                                        onClick={() => setFile(null)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>

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
