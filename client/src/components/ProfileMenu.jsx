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
        {!imageUrl && (user?.name?.charAt(0).toUpperCase() || (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        ))}
      </div>

      {open && (
        <div className="profile-card">
          <p className="profile-name" style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name || "Aspirant"}
          </p>
          <p className="profile-email-small" style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 12px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.email}
          </p>

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px 8px', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="4" y2="12"></line></svg>
              {user?.tokens !== undefined ? user.tokens : '...'} Tokens
            </span>
            <Link to="/pricing" style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', marginTop: '6px' }}>
              Get more →
            </Link>
          </div>

          <Link to="/" className="menu-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#475569', padding: '8px', borderRadius: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Home
          </Link>

          <Link to="/profile" className="menu-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#475569', padding: '8px', borderRadius: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Profile
          </Link>

          <Link to="/dashboard" className="menu-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#475569', padding: '8px', borderRadius: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg> Dashboard
          </Link>

          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          <button className="logout-btn" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'none', color: '#dc2626', fontWeight: '600' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg> Logout
          </button>
        </div>
      )}
    </div>
  );
}
