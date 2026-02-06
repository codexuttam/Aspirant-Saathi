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
    );
}
