import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout, getUser } from "../utils/auth";
import "./ProfileMenu.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const user = getUser();
  const menuRef = useRef(null);

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

  return (
    <div className="profile-container" ref={menuRef}>
      <div className="profile-avatar"
        onClick={() => setOpen(!open)}
        style={{
          backgroundImage: user?.profileImage ? `url(http://localhost:5000${user.profileImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: user?.profileImage ? 'transparent' : 'white'
        }}
      >
        {user?.name?.charAt(0).toUpperCase() || "👤"}
      </div>

      {open && (
        <div className="profile-card">
          <p className="profile-name">{user?.name || "Aspirant"}</p>
          <p className="profile-email-small" style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "10px" }}>
            {user?.email}
          </p>

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
