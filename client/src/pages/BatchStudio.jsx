import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import "../styles/BatchStudio.css";
import InternalLayout from "../components/InternalLayout";
import ExamSelector from "../components/ExamSelector";

export default function BatchStudio() {
    const navigate = useNavigate();
    const user = getUser();
    const fileInputRef = useRef(null);

    const [files, setFiles] = useState([]);
    const [exam, setExam] = useState("UPSC CSE (Mains) - GS");
    const [evaluating, setEvaluating] = useState(false);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 10) {
            alert("Batch Studio allows a maximum of 10 pages per evaluation ticket.");
            return;
        }

        // Generate Object URLs for preview
        const newFiles = selectedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file: file,
            preview: URL.createObjectURL(file)
        }));

        setFiles([...files, ...newFiles]);
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const handleStartBatch = () => {
        if (files.length === 0) return;

        setEvaluating(true);
        // Simulate processing for testing UI
        setTimeout(() => {
            setEvaluating(false);
            alert(`Batch evaluation simulated for ${files.length} pages! Redirecting to report...`);
        }, 3000);
    };

    if (user && user.isPro) {
        return (
            <InternalLayout>
                <div className="batch-studio-container" style={{ padding: "32px", width: "100%", maxWidth: "1000px", margin: "0 auto", display: "block", minHeight: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <div>
                            <h1 style={{ fontSize: "28px", color: "#1e293b", margin: "0 0 8px 0", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                                Batch Studio
                                <span style={{ background: "linear-gradient(135deg, #eab308 0%, #b45309 100%)", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", color: "white", textTransform: "uppercase" }}>PRO</span>
                            </h1>
                            <p style={{ color: "#64748b", margin: 0 }}>Evaluate multiple pages of a test series simultaneously.</p>
                        </div>
                        <div style={{ width: "250px" }}>
                            <ExamSelector exam={exam} setExam={setExam} />
                        </div>
                    </div>

                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>

                        <div
                            style={{ border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "40px", textAlign: "center", cursor: "pointer", background: "#f8fafc", transition: "all 0.2s", marginBottom: '24px' }}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                                handleFileSelect({ target: { files: droppedFiles } });
                            }}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />
                            <div style={{ width: "64px", height: "64px", background: "#e0e7ff", color: "#4f46e5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <h3 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "18px" }}>Click to upload or drag pages here</h3>
                            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Max 10 images allowed per batch. Supported: JPG, PNG, WEBP.</p>
                        </div>

                        {files.length > 0 && (
                            <div style={{ marginTop: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h4 style={{ margin: 0, color: "#334155", fontSize: "16px" }}>Selected Pages ({files.length}/10)</h4>
                                    <button
                                        onClick={() => setFiles([])}
                                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", fontWeight: "600", padding: "6px 12px", borderRadius: "6px" }}
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
                                    {files.map((fileObj, index) => (
                                        <div key={fileObj.id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", aspectRatio: "3/4", background: "#f1f5f9" }}>
                                            <img src={fileObj.preview} alt={`Page ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 8px", fontSize: "12px", fontWeight: "600" }}>
                                                Page {index + 1}
                                            </div>
                                            <button
                                                onClick={() => removeFile(fileObj.id)}
                                                style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(239, 68, 68, 0.9)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: "32px", borderTop: "1px solid #e2e8f0", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                                    <button
                                        onClick={handleStartBatch}
                                        disabled={evaluating}
                                        style={{
                                            background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", color: "white", border: "none", padding: "14px 32px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: evaluating ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)", opacity: evaluating ? 0.8 : 1, display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        {evaluating ? (
                                            <>
                                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                                                Processing Batch...
                                            </>
                                        ) : (
                                            <>
                                                Start Batch Evaluation
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '32px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '20px', color: '#1e293b', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upcoming Batch Features</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Our engineers are cooking up tools that scale your preparation effortlessly.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '12px', borderRadius: '10px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e293b' }}>Aggregated Performance Analytics</h4>
                                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>View a macro-level report aggregating the feedback from multiple tests to find recurring weaknesses in specific topics.</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '10px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e293b' }}>PDF Export Hub</h4>
                                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>Download compiled, professionally formatted PDF reports containing your entire batch's model answers and structural critique.</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '10px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e293b' }}>Background Processing Queue</h4>
                                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>Upload up to 50 answers at once. Feel free to close the tab and log off—we'll evaluate them in the background and notify your email.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </InternalLayout>
        );
    }

    return (
        <InternalLayout>
            <div className="batch-studio-container">
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
        </InternalLayout>
    );
}
