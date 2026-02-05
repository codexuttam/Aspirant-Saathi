import { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import "./ProfileMenu.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-avatar" onClick={() => setOpen(!open)}>
        👤
      </div>

      {open && (
        <div className="profile-card">
          <p className="profile-name">Aspirant</p>

          <button onClick={() => alert("Profile page coming soon")}>
            Profile
          </button>

          <Link to="/dashboard" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            Dashboard
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
