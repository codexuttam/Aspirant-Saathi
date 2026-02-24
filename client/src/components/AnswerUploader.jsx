import React from "react";

export default function AnswerUploader({ file, setFile }) {
    return (
        <div className="form-group">
            <div className="file-upload-box">
                <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <span className="upload-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#64748b' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                </span>
                <p className="upload-text">
                    <span>Click to upload</span> or drag and drop<br />
                    handwritten answer image
                </p>
            </div>
            {file && (
                <div className="file-preview">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        {file.name}
                    </span>
                    <button
                        onClick={() => setFile(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
