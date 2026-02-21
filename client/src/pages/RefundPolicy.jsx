import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { isLoggedIn, getUser } from '../utils/auth';
import '../styles/RefundPolicy.css';

const RefundPolicy = () => {
    const user = getUser();
    const [issue, setIssue] = useState("");
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState(user?.email || "");
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!issue || !file) {
            alert("Please provide the issue details and a screenshot.");
            return;
        }

        const formData = new FormData();
        formData.append("issue", issue);
        formData.append("email", email);
        formData.append("name", user?.name || ""); // Optional
        formData.append("screenshot", file);

        try {
            setStatus("loading");
            await API.post("/refund/request", formData);
            setStatus("success");
            setIssue("");
            setFile(null);
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="refund-page">
            <Navbar />
            <div className="policy-container">
                <h1 className="policy-title">Refund Policy & Claims</h1>

                <div className="policy-content">
                    <section>
                        <h2>1. Our Guarantee</h2>
                        <p>
                            We value your satisfaction. If you are not completely satisfied with our AI evaluation services, you can request a full refund within <strong>14 days</strong> of your purchase or token usage. We process all valid refund claims promptly.
                        </p>
                    </section>

                    <section>
                        <h2>2. How to Claim</h2>
                        <p>
                            To file a claim, please fill out the form below. You must provide a clear description of the issue and a screenshot of the payment transaction or the error you encountered.
                        </p>
                    </section>

                    <div className="refund-form-container">
                        <h3>File a Refund Claim</h3>
                        {status === "success" ? (
                            <div className="success-message">
                                ✅ Your refund request has been submitted successfully! We will review it and get back to you within 14 days.
                            </div>
                        ) : (
                            <form className="refund-form" onSubmit={handleSubmit}>
                                {!isLoggedIn() && (
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your registered email"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Describe the Issue</label>
                                    <textarea
                                        rows="5"
                                        value={issue}
                                        onChange={(e) => setIssue(e.target.value)}
                                        placeholder="Why are you requesting a refund?"
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Upload Payment Screenshot / Proof</label>
                                    <div className="file-input-wrapper">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            required
                                        />
                                        {file && <span className="file-name">{file.name}</span>}
                                    </div>
                                </div>

                                <button type="submit" className="submit-claim-btn" disabled={status === "loading"}>
                                    {status === "loading" ? "Submitting..." : "Submit Claim"}
                                </button>

                                {status === "error" && (
                                    <p className="error-message">Failed to submit request. Please try again.</p>
                                )}
                            </form>
                        )}
                    </div>

                    <section style={{ marginTop: '40px' }}>
                        <h2>3. Contact Support</h2>
                        <p>
                            If you have trouble using this form, you can email us directly at <strong>aspirantsaathisuppport@gmail.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
