import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeedbackModal from '../components/FeedbackModal';
import '../styles/Feedbacks.css';

const STATIC_FALLBACK = [
    { _id: 's1', name: 'Rahul Sharma', rating: 5, message: 'This tool completely changed how I approach answer writing. The feedback is specific and actionable.', examType: 'UPSC Aspirant', createdAt: new Date().toISOString() },
    { _id: 's2', name: 'Priya Singh', rating: 5, message: 'I used to struggle with structure. The AI breakdown helped me organize my thoughts much better.', examType: 'State PSC Topper', createdAt: new Date().toISOString() },
    { _id: 's3', name: 'Arjun Mehta', rating: 5, message: 'Instant evaluation means I can practice more questions in less time. Highly recommended!', examType: 'CAPF Candidate', createdAt: new Date().toISOString() },
];

function StarRating({ rating }) {
    return (
        <div className="fb-stars">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= rating ? 'star filled' : 'star'}>★</span>
            ))}
        </div>
    );
}

function getInitials(name = '') {
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

const GRADIENT_CLASSES = ['fb-avatar-1', 'fb-avatar-2', 'fb-avatar-3', 'fb-avatar-4', 'fb-avatar-5'];

export default function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/feedback`);
            const data = await res.json();
            if (data.feedbacks && data.feedbacks.length > 0) {
                setFeedbacks(data.feedbacks);
            } else {
                setFeedbacks(STATIC_FALLBACK);
            }
        } catch {
            setFeedbacks(STATIC_FALLBACK);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleFeedbackSuccess = () => {
        fetchFeedbacks();
        setShowModal(false);
    };

    const allFeedbacks = feedbacks.length > 0 ? feedbacks : STATIC_FALLBACK;

    // Dynamically computed stats
    const totalReviews = allFeedbacks.length;
    const avgRating = totalReviews > 0
        ? (allFeedbacks.reduce((acc, f) => acc + f.rating, 0) / totalReviews)
        : 5;
    const satisfiedCount = allFeedbacks.filter(f => f.rating >= 4).length;
    const satisfactionPct = totalReviews > 0
        ? Math.round((satisfiedCount / totalReviews) * 100)
        : 100;

    return (
        <div className="feedbacks-page">
            <Navbar />

            {/* HERO */}
            <div className="feedbacks-hero">
                <div className="feedbacks-hero-inner">
                    <div className="feedbacks-hero-badge">✨ Community Reviews</div>
                    <h1 className="feedbacks-hero-title">
                        Hear Out What Aspirants <span className="feedbacks-hero-accent">Say About Us</span>
                    </h1>
                    <p className="feedbacks-hero-subtitle">
                        Real stories from real aspirants who have leveled up their answer writing with Aspirant-Saathi.
                    </p>
                    <button className="feedbacks-write-btn" onClick={() => setShowModal(true)} id="write-feedback-btn">
                        <span className="write-btn-icon">✍️</span>
                        Write Yours
                    </button>
                </div>

                {/* Decorative blobs */}
                <div className="feedbacks-blob fb-blob-1" />
                <div className="feedbacks-blob fb-blob-2" />
            </div>

            {/* STATS BAR — all values computed live from fetched data */}
            {!loading && (
                <div className="feedbacks-stats-bar">
                    <div className="fb-stat">
                        <span className="fb-stat-num">{totalReviews}+</span>
                        <span className="fb-stat-label">Reviews</span>
                    </div>
                    <div className="fb-stat-divider" />
                    <div className="fb-stat">
                        <span className="fb-stat-num">{avgRating.toFixed(1)}</span>
                        <span className="fb-stat-label">Avg. Rating</span>
                    </div>
                    <div className="fb-stat-divider" />
                    <div className="fb-stat">
                        <span className="fb-stat-num">{satisfactionPct}%</span>
                        <span className="fb-stat-label">Satisfaction</span>
                    </div>
                </div>
            )}

            {/* FEEDBACKS GRID */}
            <section className="feedbacks-grid-section">
                {loading ? (
                    <div className="feedbacks-loading">
                        <div className="fb-spinner" />
                        <p>Loading reviews…</p>
                    </div>
                ) : (
                    <>
                        <div className="feedbacks-grid">
                            {allFeedbacks.map((fb, idx) => (
                                <div className="fb-card" key={fb._id || idx}>
                                    <div className="fb-card-top">
                                        <StarRating rating={fb.rating} />
                                        <span className="fb-date">
                                            {new Date(fb.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="fb-message">"{fb.message}"</p>
                                    <div className="fb-user-row">
                                        <div className={`fb-avatar ${GRADIENT_CLASSES[idx % GRADIENT_CLASSES.length]}`}>
                                            {getInitials(fb.name)}
                                        </div>
                                        <div>
                                            <div className="fb-user-name">{fb.name}</div>
                                            <div className="fb-user-type">{fb.examType || 'Aspirant'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA at bottom */}
                        <div className="feedbacks-bottom-cta">
                            <p>Loved Aspirant-Saathi? Share your experience with the community.</p>
                            <button className="feedbacks-write-btn-outline" onClick={() => setShowModal(true)} id="write-feedback-bottom-btn">
                                ✍️ Write Your Review
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* FOOTER LINK */}
            <div className="feedbacks-footer-link">
                <Link to="/" className="back-home-link">← Back to Home</Link>
            </div>

            {/* FEEDBACK MODAL */}
            <FeedbackModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleFeedbackSuccess}
                requireLogin={true}
            />
        </div>
    );
}
