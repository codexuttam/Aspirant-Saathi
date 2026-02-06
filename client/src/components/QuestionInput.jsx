import React from "react";

export default function QuestionInput({ question, setQuestion }) {
    return (
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
    );
}
