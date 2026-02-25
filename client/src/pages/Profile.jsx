
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InternalLayout from "../components/InternalLayout";
import API from "../services/api";
import { getUser, setUser } from "../utils/auth";
import "../styles/Profile.css";

const motivationalQuotes = [
    "The future belongs to those who believe in the beauty of their dreams.",
    "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    "Your preparation today determines your success tomorrow.",
    "Don't stop when you're tired. Stop when you're done."
];

export default function Profile() {
    const [user, setUserState] = useState(getUser());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ attempts: 0, average: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", email: "", exam: "", hobbies: "" });
    const [quote, setQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name || "", email: user.email || "", exam: user.exam || "", hobbies: user.hobbies || "" });
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        try {
            const res = await API.put("/auth/update-profile", editForm);
            setUserState(res.data);
            setUser(res.data);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to update profile");
        }
    };

    useEffect(() => {
        // Determine if we need to fetch user data
        if (!user) {
            API.get("/auth/me")
                .then((res) => {
                    setUserState(res.data);
                    setUser(res.data); // Update local storage
                })
                .catch((err) => {
                    console.error("Failed to fetch user", err);
                });
        }

        // Fetch stats (optional but nice)
        API.get("/attempts")
            .then((res) => {
                const attempts = res.data;
                const evaluated = attempts.filter(a => a.status === 'evaluated');
                const totalScore = evaluated.reduce((sum, a) => sum + (a.evaluation?.totalMarks || 0), 0);
                const avg = evaluated.length ? (totalScore / evaluated.length).toFixed(1) : 0;

                setStats({
                    attempts: attempts.length,
                    average: avg
                });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [user]); // Run when user state changes (handles initial load)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            // Optimistic update
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserState(prev => ({ ...prev, profileImage: e.target.result }));
            };
            reader.readAsDataURL(file);

            const res = await API.post("/auth/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser(res.data); // Update local storage
            setUserState(res.data); // Update state with confirmed URL
            window.location.reload(); // Force reload to update Navbar/ProfileMenu image which relies on localStorage
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload image");
        }
    };

    if (loading && !user) return <div className="loading-spinner">Loading profile...</div>;

    return (
        <InternalLayout>
            <div className="profile-wrapper" style={{ minHeight: 'auto', background: 'transparent' }}>
                <main className="profile-content">
                    <div className="profile-header" style={{ marginBottom: '24px' }}>
                        <div className="profile-avatar-large" style={{
                            backgroundImage: (user?.profileImage && (user.profileImage.startsWith('http') || user.profileImage.startsWith('data:')))
                                ? `url(${user.profileImage})`
                                : user?.profileImage
                                    ? `url(${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}${user.profileImage})`
                                    : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                            onClick={() => document.getElementById('avatar-upload').click()}
                        >
                            {!user?.profileImage && (user?.name?.charAt(0).toUpperCase() || "A")}
                            <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#3b82f6', borderRadius: '50%', padding: '6px', fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            </div>
                        </div>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <div className="profile-info">
                            <h1>{user?.name || "Aspirant"}</h1>
                            <p className="profile-email">{user?.email || "user@example.com"}</p>
                        </div>
                    </div>

                    <section className="profile-section" style={{ padding: '24px', marginBottom: '24px' }}>
                        <div className="section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
                            My Statistics
                        </div>

                        <div className="stats-summary">
                            <div className="stat-box">
                                <span className="stat-number">{stats.attempts}</span>
                                <span className="stat-desc">Total Submissions</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number">{stats.average}</span>
                                <span className="stat-desc">Average Score</span>
                            </div>
                        </div>
                    </section>

                    <section className="profile-section" style={{ padding: '24px', marginBottom: '24px' }}>
                        <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Account Details
                            </div>
                            <button
                                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                style={{
                                    background: isEditing ? '#10b981' : 'transparent',
                                    color: isEditing ? 'white' : '#3b82f6',
                                    border: isEditing ? 'none' : '1px solid #3b82f6',
                                    padding: '6px 16px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isEditing ? "Save Changes" : "Edit Profile"}
                            </button>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Full Name</span>
                                {isEditing ? (
                                    <input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="edit-input"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            width: '100%',
                                            fontSize: '1rem',
                                            marginTop: '4px',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <span className="info-value">{user?.name}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email Address</span>
                                {isEditing ? (
                                    <input
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        type="email"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            width: '100%',
                                            fontSize: '1rem',
                                            marginTop: '4px',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <span className="info-value">{user?.email}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <span className="info-label">Current Goal / Exam</span>
                                {isEditing ? (
                                    <input
                                        value={editForm.exam}
                                        onChange={(e) => setEditForm({ ...editForm, exam: e.target.value })}
                                        className="edit-input"
                                        placeholder="e.g. UPSC CSE"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            width: '100%',
                                            fontSize: '1rem',
                                            marginTop: '4px',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <span className="info-value">{user?.exam || <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>Not set</span>}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <span className="info-label">Hobbies & Interests</span>
                                {isEditing ? (
                                    <input
                                        value={editForm.hobbies}
                                        onChange={(e) => setEditForm({ ...editForm, hobbies: e.target.value })}
                                        className="edit-input"
                                        placeholder="e.g. Reading, Traveling"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            width: '100%',
                                            fontSize: '1rem',
                                            marginTop: '4px',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <span className="info-value">{user?.hobbies || <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>Not set</span>}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <span className="info-label">User ID</span>
                                <span className="info-value" style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#64748b' }}>{user?.id || user?._id}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Member Since</span>
                                <span className="info-value">February 2026</span>
                            </div>
                        </div>
                    </section>

                    <section className="profile-section" style={{ padding: '24px', background: 'linear-gradient(to right, #e0e7ff, #ede9fe)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ color: '#6366f1', padding: '8px', background: 'white', borderRadius: '50%', display: 'flex' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1.5.5 1.5 1.714Z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h6.5C19.5 13.5 19 19 15 21Z"></path></svg>
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#1e293b' }}>Daily Motivation</h3>
                                <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                                    "{quote}"
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </InternalLayout>
    );
}
