
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getUser, setUser } from "../utils/auth";
import "../styles/Profile.css";

export default function Profile() {
    const [user, setUserState] = useState(getUser());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ attempts: 0, average: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", email: "" });

    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name || "", email: user.email || "" });
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
        <div className="profile-wrapper">
            <Navbar />

            <main className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar-large" style={{
                        backgroundImage: (user?.profileImage && (user.profileImage.startsWith('http') || user.profileImage.startsWith('data:')))
                            ? `url(${user.profileImage})`
                            : user?.profileImage
                                ? `url(http://localhost:5000${user.profileImage})`
                                : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                        onClick={() => document.getElementById('avatar-upload').click()}
                    >
                        {!user?.profileImage && (user?.name?.charAt(0).toUpperCase() || "A")}
                        <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#3b82f6', borderRadius: '50%', padding: '5px', fontSize: '1rem' }}>📷</div>
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

                <section className="profile-section">
                    <div className="section-title">
                        <span>📝</span> My Statistics
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

                <section className="profile-section">
                    <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><span>👤</span> Account Details</div>
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
                            <span className="info-label">User ID</span>
                            <span className="info-value" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{user?.id || user?._id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">February 2026</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
