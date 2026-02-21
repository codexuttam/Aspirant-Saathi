import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import ProfileMenu from "./ProfileMenu";
import "../styles/Navbar.css";

export default function Navbar() {


    return (
        <header className="navbar">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="logo">Aspirant-Saathi</div>
            </Link>

            <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: 'auto', marginRight: '30px' }}>
                <Link to="/contact" className="nav-contact-btn">
                    <span className="contact-icon">💬</span> Contact Us
                </Link>
            </div>

            <div className="auth-buttons">


                {isLoggedIn() ? (
                    <ProfileMenu />
                ) : (
                    <>
                        <Link to="/login" className="nav-cta secondary">
                            Sign In
                        </Link>
                        <Link to="/register" className="nav-cta primary">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
