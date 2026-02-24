import { Link } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import HeroImage from "../assets/hero-illustration.png";
import { isLoggedIn } from "../utils/auth";
import ProfileMenu from "../components/ProfileMenu";
import { toast } from "react-hot-toast";

const MOTIVATIONAL_QUOTES = [
  { text: "“Stop scrolling and start grinding, bestie. The merit list is waiting.”", author: "Chief Energy Officer", icon: "💅" },
  { text: "“Manifesting that AIR 1 energy fr fr. No cap.”", author: "Vibe Curator", icon: "✨" },
  { text: "“It's giving... future bureaucrat.”", author: "Main Character", icon: "👑" },
  { text: "“Lock in. The syllabus ain't gonna finish itself.”", author: "The Reality Check", icon: "🔒" },
  { text: "“Main character energy is clearing prelims on the first attempt.”", author: "Your Future Self", icon: "🎬" },
  { text: "“W rizz in interview, but you gotta pass mains first.”", author: "The Rizzler", icon: "🗣️" },
  { text: "“POV: You literally practiced answer writing instead of just watching strat vids.”", author: "Based Mentor", icon: "✍️" },
  { text: "“Valid feelings, but those Laxmikanth chapters won't read themselves.”", author: "Polity Bro", icon: "📚" },
  { text: "“Consistency is the only cheat code. Keep cooking.”", author: "The Chef", icon: "👨‍🍳" },
  { text: "“You dropped this 👑. Now get back to answer writing.”", author: "Aspirant-Saathi", icon: "🔥" },
  { text: "“Bro literally thought watching 10 topper talks equals studying 💀”", author: "Fact Checker", icon: "🤡" },
  { text: "“Rent was due and you delivered that flawless essay answer.”", author: "Essay Evaluator", icon: "💸" },
  { text: "“That answer structure is lowkey kinda fire though.”", author: "The Aesthetic Nerd", icon: "🔥" },
  { text: "“Touch grass for 10 mins, then get back to the grind.”", author: "Wellness Check", icon: "🌿" },
  { text: "“Bro thinks he's him passing without making notes.”", author: "The Note Taker", icon: "📝" },
  { text: "“Secured the bag? Nah, secured the rank.”", author: "Hustle Mentor", icon: "💰" },
  { text: "“The syllabus is massive, but so is your delusion. Go study.”", author: "Reality Check", icon: "👀" },
  { text: "“Don't let LBSNAA be just an aesthetic on your Pinterest board.”", author: "Vibe Check", icon: "📌" },
  { text: "“Stop letting the competition out-grind you while you doomscroll.”", author: "The Antagonist", icon: "📱" },
  { text: "“Ate that mock test and left absolutely no crumbs.”", author: "Hype Man", icon: "🍽️" }
];

export default function Home() {
  const handleEasterEggClick = () => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

    toast.custom((t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          }`}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(147, 197, 253, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: '380px',
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
          transform: t.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer'
        }}
        onClick={() => toast.dismiss(t.id)}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{randomQuote.icon}</div>
        <div style={{ fontSize: '15.5px', fontWeight: '600', lineHeight: '1.5', letterSpacing: '-0.2px', marginBottom: '10px', color: '#f8fafc' }}>
          {randomQuote.text}
        </div>
        <div style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
          — {randomQuote.author}
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-right',
    });
  };

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
          <div
            className="hero-css-composition"
            onClick={handleEasterEggClick}
            style={{ cursor: 'pointer' }}
          >
            {/* Floating Papers Stack */}
            <div className="paper-stack">
              <div className="paper p1"></div>
              <div className="paper p2"></div>
              <div className="paper p3">
                <div className="paper-content">
                  <div className="p-line l1"></div>
                  <div className="p-line l2"></div>
                  <div className="p-line l3"></div>
                  <div className="p-circle"></div>
                </div>
                {/* Scanning Beam */}
                <div className="scan-beam"></div>
              </div>
            </div>

            {/* Floating Elements (Badges/Icons) */}
            <div className="float-icon icon-1">📝</div>
            <div className="float-icon icon-2">✨</div>
            <div className="float-icon icon-3">A+</div>

            {/* Background Blob */}
            <div className="hero-blob"></div>
          </div>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need to Rank</h2>
        <p className="section-subtitle">
          A comprehensive toolkit designed to transform your preparation strategy.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper blue-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="feature-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <h3>Instant Evaluation</h3>
            <p>Get detailed, line-by-line feedback in seconds. No more waiting for manual reviews.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper purple-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="feature-icon"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3>Deep Analytics</h3>
            <p>Track your structure, content, and keyword usage over time with granular metrics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper green-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="feature-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3>Model Answers</h3>
            <p>Access AI-generated ideal answers for every question to understand the gold standard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper orange-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="feature-icon"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
            </div>
            <h3>Score Prediction</h3>
            <p>Get a realistic estimate of your potential mains score based on historical trends.</p>
          </div>
        </div>
      </section>

      {/* ALTERNATING CONTENT SECTIONS */}
      <section className="content-section">
        <div className="content-wrapper">
          <div className="content-text">
            <h2 className="content-title">Master the Art of Answer Writing</h2>
            <p className="content-desc">
              Writing a good answer is more than just knowledge. It's about structure, flow, and presentation.
            </p>
            <ul className="content-list">
              <li>
                <span className="check-icon">✓</span> Learn to structure your thoughts
              </li>
              <li>
                <span className="check-icon">✓</span> Improve detailed presentation
              </li>
              <li>
                <span className="check-icon">✓</span> Write concisely and effectively
              </li>
            </ul>
          </div>
          <div className="content-visual visual-left">
            {/* Abstract Visual Representation */}
            <div className="abstract-card">
              <div className="card-header">
                <div className="dot red"></div><div className="dot yellow"></div><div className="dot green"></div>
              </div>
              <div className="card-body">
                <div className="line full"></div>
                <div className="line full"></div>
                <div className="line three-quarter"></div>
                <div className="line half"></div>
                <div className="highlight-box">
                  <span>Introduction Strong</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: AI MENTOR (BLUE) SECTION */}
      <section className="mentor-section">
        <div className="content-wrapper">
          <div className="mentor-visual">
            {/* CSS Illustration of a "Mentor" / Robot */}
            <div className="ai-bot-visual">
              <div className="bot-head">
                <div className="bot-eye left"></div>
                <div className="bot-eye right"></div>
              </div>
              <div className="bot-body">
                <div className="bot-screen">
                  <div className="typing-dots"><span>.</span><span>.</span><span>.</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mentor-text">
            <h2>You Are Not Alone</h2>
            <p>
              We've created an all-in-one AI companion that doesn't just grade—it teaches.
              Assess, Analyze, and Enhance your writing style with actionable insights that feel like
              a personal mentor sitting right beside you 24/7.
            </p>
            <Link to="/register" className="white-btn">Start Evaluating Now</Link>
          </div>
        </div>
      </section>

      <section className="content-section reverse">
        <div className="content-wrapper">
          <div className="content-text">
            <h2 className="content-title">Lightning-Fast Insights</h2>
            <p className="content-desc">
              Why wait for weeks? Get instant feedback that helps you iterate and improve continuously.
            </p>
            <p className="content-desc">
              Our AI analyzes your answers for keyword density, contextual relevance, and formatting to give you an edge.
            </p>
          </div>
          <div className="content-visual visual-right">
            <div className="stats-visual">
              <div className="bar-chart">
                <div className="bar" style={{ height: '40%' }}></div>
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
                <div className="bar active" style={{ height: '95%' }}></div>
              </div>
              <div className="float-tag">Growth 🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: WHY CHOOSE US (STATS) SECTION */}
      <section className="why-us-section">
        <div className="content-wrapper">
          <div className="why-us-text">
            <h2 className="content-title" style={{ textAlign: 'left' }}>Why Choose Aspirant-Saathi</h2>
            <p className="content-desc">
              Traditional coaching evaluation takes days. We take seconds. Get feedback while your thoughts are still fresh.
            </p>

            <div className="feature-list-check">
              <div className="check-item">
                <span className="icon-box">⚡</span>
                <div>
                  <h4>Lightning Fast Results</h4>
                  <p>Don't break your flow. Get instant analysis and move to the next question immediately.</p>
                </div>
              </div>
              <div className="check-item">
                <span className="icon-box">🎯</span>
                <div>
                  <h4>Exam-Oriented Feedback</h4>
                  <p>Our AI analyzes your structure and keywords to align with competitive exam standards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid-visual">
            <div className="stat-card-mini">
              <div className="stat-icon-circle blue">⏱️</div>
              <h3>60s</h3>
              <p>Avg. Evaluation Time</p>
            </div>
            <div className="stat-card-mini">
              <div className="stat-icon-circle green">🤖</div>
              <h3>AI</h3>
              <p>Instant Analysis</p>
            </div>
            <div className="stat-card-mini wide">
              <div className="stat-icon-circle purple">🌙</div>
              <h3>24/7</h3>
              <p>Available Anytime</p>
            </div>
          </div>
        </div>
      </section>



      {/* PRECISE FEEDBACK SECTION used to be dark blue */}
      <section className="feedback-section">
        <h2 className="light-title">Precise Feedback for Better Answers</h2>
        <p className="light-subtitle">Our platform guides you at every step with granular tags.</p>

        <div className="tags-cloud">
          <span className="tag glow-tag">Structure Analysis</span>
          <span className="tag glow-tag">Content Relevance</span>
          <span className="tag glow-tag">Concise & Crisp</span>
          <span className="tag glow-tag">Professional Tone</span>
          <span className="tag glow-tag">Data Integration</span>
          <span className="tag glow-tag">Critical Analysis</span>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <h2 className="section-title">Why Aspirants Love Us</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>"This tool completely changed how I approach answer writing. The feedback is specific and actionable."</p>
            <div className="user-info">
              <div className="user-avatar gradient-1">R</div>
              <div>
                <h4>Rahul Sharma</h4>
                <span>UPSC Aspirant</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>"I used to struggle with structure. The AI breakdown helped me organize my thoughts much better."</p>
            <div className="user-info">
              <div className="user-avatar gradient-2">P</div>
              <div>
                <h4>Priya Singh</h4>
                <span>State PSC Topper</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>"Instant evaluation means I can practice more questions in less time. Highly recommended!"</p>
            <div className="user-info">
              <div className="user-avatar gradient-3">A</div>
              <div>
                <h4>Arjun Mehta</h4>
                <span>CAPF Candidate</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* NEW: FINAL CALL TO ACTION */}
      <section className="final-cta-section">
        <h2 className="final-title">Write Confidently, Score Higher with <span className="brand-text">Aspirant-Saathi</span></h2>
        <p className="final-subtitle">
          Refine your UPSC/PCS Mains answers with precision. Our AI-driven evaluation ensures clarity,
          relevance, and structured writing—helping you improve with every attempt.
        </p>
        <Link to="/register" className="primary-btn glow-effect large">Start Writing Now</Link>
      </section>

      {/* NEW: COMPREHENSIVE FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Aspirant-Saathi</h3>
            <p>Your personal AI answer writing mentor.</p>
            <p className="copyright">© 2026 Aspirant-Saathi. All rights reserved.</p>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              {!isLoggedIn() && (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Contact</h4>
            <ul>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
