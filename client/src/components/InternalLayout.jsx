import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import "../styles/InternalLayout.css";
import ProfileMenu from "./ProfileMenu";
import FeedbackModal from "./FeedbackModal";

export default function InternalLayout({ children }) {
    const location = useLocation();
    const user = getUser();
    const [showMenu, setShowMenu] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    React.useEffect(() => {
        // Force evaluation after mount to handle dynamic screen sizings reliably
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }

        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMobileNavClick = () => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    const isActive = (path) => location.pathname === path ? "active" : "";

    return (
        <div className={`internal-layout ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
            <aside className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
                <div className="sidebar-header">
                    <h2>Aspirant-Saathi</h2>
                </div>
                <div className="sidebar-nav">
                    <div className="nav-section">
                        <p className="nav-label">MAIN</p>
                        <Link to="/dashboard" onClick={handleMobileNavClick} className={`nav-link ${isActive('/dashboard')}`}>
                            <span className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                            </span> Dashboard
                        </Link>
                        <Link to="/" onClick={handleMobileNavClick} className="nav-link">
                            <span className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </span> Home
                        </Link>
                    </div>

                    <div className="nav-section">
                        <p className="nav-label">AI TOOLS</p>
                        <Link to="/submit" onClick={handleMobileNavClick} className={`nav-link ${isActive('/submit')}`}>
                            <span className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                            </span> Answer Evaluator
                        </Link>
                        <Link to="/batch-studio" onClick={handleMobileNavClick} className={`nav-link ${isActive('/batch-studio')}`}>
                            <span className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                            </span> Batch Studio
                        </Link>
                    </div>
                </div>

                <div className="sidebar-footer" style={{ position: 'relative' }}>
                    {showMenu && (
                        <div className="settings-menu-popup" style={{
                            position: 'absolute', bottom: '100%', left: '0', width: '100%', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 -4px 15px rgba(0,0,0,0.1)', padding: '12px', zIndex: 10, marginBottom: '8px', border: '1px solid #e2e8f0'
                        }}>
                            <Link to="/batch-studio" className="nav-link premium-btn" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#b45309', border: '1px solid #fcd34d', borderRadius: '8px', marginBottom: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    GO PREMIUM
                                </div>
                                <span style={{ fontSize: '11px', color: '#b45309', opacity: 0.8, marginTop: '2px' }}>Unlock All features</span>
                            </Link>

                            <button className="nav-link" onClick={() => { setShowFeedback(true); setShowMenu(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', fontSize: '14px', color: '#475569', display: 'flex', gap: '10px', alignItems: 'center', borderRadius: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                Share Feedback
                            </button>

                            <a href="mailto:aspirantsaathisuppport@gmail.com" className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', fontSize: '14px', color: '#475569', display: 'flex', gap: '10px', alignItems: 'center', borderRadius: '8px', textDecoration: 'none' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Support Chat
                            </a>

                            <button className="nav-link" onClick={() => logout()} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', fontSize: '14px', color: '#475569', display: 'flex', gap: '10px', alignItems: 'center', borderRadius: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6366f1' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                    <button onClick={() => setShowMenu(!showMenu)} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: showMenu ? '#f1f5f9' : 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'background-color 0.2s', color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            Settings & Support
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#94a3b8' }}><path d="m6 9 6 6 6-6"></path></svg>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="main-header">
                    <div className="header-left">
                        <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isSidebarOpen ? (
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                ) : (
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                )}
                            </svg>
                        </button>
                    </div>
                    {(location.pathname === '/submit' || location.pathname === '/batch-studio') && (
                        <div className="top-tabs">
                            <Link to="/submit" className={`top-tab ${isActive('/submit')}`}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                                    Answer Evaluator
                                </span>
                            </Link>
                            <Link to="/batch-studio" className={`top-tab ${isActive('/batch-studio')}`}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                                    Batch Studio
                                </span>
                            </Link>
                        </div>
                    )}
                    <div className="header-right">
                        {!user?.isPro && (
                            <Link to="/pricing" className="upgrade-pro-btn">Upgrade to Pro</Link>
                        )}
                        <ProfileMenu />
                    </div>
                </header>
                <div className="content-area">
                    {children}
                </div>
            </main>

            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
        </div>
    );
}
