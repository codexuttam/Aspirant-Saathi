import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import "../styles/BatchStudio.css";
import InternalLayout from "../components/InternalLayout";
import ExamSelector from "../components/ExamSelector";
import QuestionInput from "../components/QuestionInput";
import { toast } from "react-hot-toast";

export default function BatchStudio() {
    const navigate = useNavigate();
    const user = getUser();
    const fileInputRef = useRef(null);

    const [files, setFiles] = useState([]);
    const [exam, setExam] = useState("UPSC CSE (Mains) - GS");
    const [question, setQuestion] = useState("");
    const [evaluating, setEvaluating] = useState(false);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 10) {
            toast.error("Batch Studio allows a maximum of 10 pages per evaluation ticket.");
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
        if (files.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
        if (!question.trim()) {
            toast.error("Please enter the question for this batch.");
            return;
        }

        setEvaluating(true);
        // Simulate processing for testing UI - In future this will call a special batch API
        setTimeout(() => {
            setEvaluating(false);
            toast.success(`Batch evaluation completed for ${files.length} pages! ✨`, {
                icon: '🚀',
                duration: 5000
            });
            // Reset for next batch
            setFiles([]);
            setQuestion("");
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

                    <div style={{ marginBottom: "24px" }}>
                        <QuestionInput question={question} setQuestion={setQuestion} />
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
            <div className="batch-studio-container" style={{ padding: '40px 20px', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ background: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(10px)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(10px)' }}></div>

                    <div style={{ display: 'inline-flex', background: '#e0e7ff', padding: '16px', borderRadius: '50%', color: '#4f46e5', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.1)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                    </div>

                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px', letterSpacing: '-0.5px' }}>Wanna Explore the Batch Studio?</h2>

                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', margin: '0 auto 32px', maxWidth: '600px', fontWeight: '400' }}>
                        Evaluating answers one by one is for amateurs. Pros upload their entire mock test at once, grab a coffee, and let our AI handle the rest. Why don't you join the elite?
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/premium-details')}
                            style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            Join Premium Today
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
                        >
                            Go Back
                        </button>
                    </div>

                    <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'left' }}>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#6366f1', marginBottom: '12px' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Unlimited Tokens</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Never worry about running out of credits. Evaluate as much as you need.</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#6366f1', marginBottom: '12px' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            </div>
                            <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Batch Processing</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Upload up to 50 answers concurrently. A massive time saver for mock tests.</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#6366f1', marginBottom: '12px' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                            </div>
                            <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Priority AI Waitlist</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Skip the queue. Pro members get top priority when AI servers are busy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </InternalLayout>
    );
}
