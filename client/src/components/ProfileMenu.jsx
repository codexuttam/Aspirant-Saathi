import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout, getUser } from "../utils/auth";
import "./ProfileMenu.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUserState] = useState(getUser());
  const menuRef = useRef(null);

  // Listen for user updates (e.g., token deduction)
  useEffect(() => {
    const handleUserUpdate = () => setUserState(getUser());
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Determine the correct image URL
  const getProfileImageUrl = () => {
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith("http")) return user.profileImage;
    return `http://localhost:5000${user.profileImage}`;
  };

  const imageUrl = getProfileImageUrl();

  return (
    <div className="profile-container" ref={menuRef}>
      <div
        className="profile-avatar"
        title={user?.name || "Profile"}
        onClick={() => setOpen(!open)}
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: imageUrl ? 'transparent' : '#111827', // Fallback color
          color: imageUrl ? 'transparent' : 'white',
          border: '2px solid #e2e8f0' // Optional: adds a nice border like Gmail
        }}
      >
        {!imageUrl && (user?.name?.charAt(0).toUpperCase() || "👤")}
      </div>

      {open && (
        <div className="profile-card">
          <p className="profile-name">{user?.name || "Aspirant"}</p>
          <p className="profile-email-small" style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "10px" }}>
            {user?.email}
          </p>

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '6px', marginBottom: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#3b82f6' }}>
              🪙 {user?.tokens !== undefined ? user.tokens : '...'} Tokens
            </span>
            <Link to="/pricing" style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', marginTop: '4px' }}>
              Get more →
            </Link>
          </div>

          <Link to="/" className="menu-item">
            🏠 Home
          </Link>

          <Link to="/profile" className="menu-item">
            👤 Profile
          </Link>

          <Link to="/dashboard" className="menu-item">
            📊 Dashboard
          </Link>

          <hr />

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
