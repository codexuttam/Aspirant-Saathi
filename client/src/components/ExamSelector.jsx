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
                <optgroup label="Civil Services & Administration">
                    <option value="UPSC CSE (Mains) - GS">UPSC CSE (Generals Studies)</option>
                    <option value="UPSC CSE (Mains) - Optional">UPSC CSE (Optional)</option>
                    <option value="UPSC CSE (Mains) - Essay">UPSC CSE (Essay)</option>
                    <option value="State PSC - GS">State PSC (UPPSC, BPSC, etc.)</option>
                </optgroup>
                <optgroup label="Defence & Paramilitary">
                    <option value="CAPF (AC) - Essay">CAPF (AC) - Essay</option>
                    <option value="CAPF (AC) - GS">CAPF (AC) - General Studies</option>
                    <option value="CDS / NDA (SSB)">CDS / NDA (SSB Perspective)</option>
                </optgroup>
                <optgroup label="Intelligence & Security">
                    <option value="IB ACIO - Descriptive">IB ACIO (Descriptive)</option>
                    <option value="RAW / Intelligence Assessment">Assessment (RAW/Intel)</option>
                </optgroup>
                <optgroup label="Recruitment & Clerical">
                    <option value="SSC CGL - Tier III">SSC CGL (Tier III)</option>
                    <option value="SSC CHSL - Descriptive">SSC CHSL (Descriptive)</option>
                </optgroup>
                <optgroup label="Judiciary & Law">
                    <option value="Judicial Services (Mains)">Judicial Services (Mains)</option>
                </optgroup>
            </select>
        </div>
    );
}
