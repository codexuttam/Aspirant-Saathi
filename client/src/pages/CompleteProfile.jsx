import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { getUser, setUser } from "../utils/auth";
import toast from "react-hot-toast";
import "../styles/Auth.css";

export default function CompleteProfile() {
    const navigate = useNavigate();
    const [user, setCurrentUser] = useState(getUser());
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        exam: ""
    });

    const exams = [
        "UPSC CSE",
        "State PSC",
        "SSC CGL",
        "Banking PO",
        "CAT",
        "GATE",
        "Other"
    ];

    useEffect(() => {
        const u = getUser();
        if (!u) {
            navigate("/login");
            return;
        }
        setCurrentUser(u);
        setForm({
            name: u.name || "",
            email: u.email || "",
            exam: u.exam || ""
        });
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/complete-profile", form);

            // Update local user
            const updatedUser = { ...user, ...res.data.user, detailsRequired: false };
            setUser(updatedUser);

            toast.success("Profile Updated!");
            navigate("/submit"); // Redirect to submission platform
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Complete Your Profile</h2>
                <p className="auth-subtitle">
                    Please provide a few more details to continue.
                </p>

                {/* Name */}
                <div className="form-group">
                    <label className="input-label">Full Name <span>*</span></label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="form-input"
                        required
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label className="input-label">Email Address <span>*</span></label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="form-input"
                        required
                    />
                </div>

                {/* Exam */}
                <div className="form-group">
                    <label className="input-label">Target Exam <span>*</span></label>
                    <div style={{ position: 'relative' }}>
                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            className="form-input"
                            required
                            style={{
                                appearance: 'none',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="" disabled>Select an Exam</option>
                            {exams.map(ex => (
                                <option key={ex} value={ex}>{ex}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="primary-btn-full">
                    {loading ? "Saving..." : "Continue to Platform"}
                </button>
            </form>
        </div>
    );
}
