import { Link } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import HeroImage from "../assets/hero-illustration.png";
import { isLoggedIn } from "../utils/auth";
import ProfileMenu from "../components/ProfileMenu";


export default function Home() {
  return (
    <div className="home-wrapper">
      {/* NAVBAR */}
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <main className="hero-container">
        <div className="hero-content">
          <div className="badge-container">
            <span className="pill-badge">UPSC</span>
            <span className="pill-badge">CAPF</span>
            <span className="pill-badge">IB</span>
            <span className="pill-badge">State PSC</span>
          </div>

          <h1 className="hero-title">
            Write answers like an <span className="highlight">aspirant</span>.
            <br />
            Get evaluated like an <span className="highlight">examiner</span>.
          </h1>

          <p className="hero-subtitle">
            Aspirant-Saathi evaluates your handwritten or typed answers
            using real examiner logic for competitive exams.
            Get instant, honest feedback.
          </p>

          <div className="hero-actions">
            <Link to="/submit" className="primary-btn glow-effect">
              Evaluate My Answer
            </Link>
            <Link to="/about" className="text-link">
              How it works
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-backdrop"></div>
          <img
            src={HeroImage}
            alt="AI Evaluation Illustration"
            className="hero-image floating-anim"
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          Built for serious aspirants · Structured thinking · Honest feedback
        </p>
      </footer>
    </div>
  );
}
