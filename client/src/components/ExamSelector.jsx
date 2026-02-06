import React from "react";

export default function ExamSelector({ exam, setExam }) {
    return (
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
    );
}
