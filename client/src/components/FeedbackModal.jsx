import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { isLoggedIn } from '../utils/auth';
import '../styles/FeedbackModal.css';

export default function FeedbackModal({ isOpen, onClose, onSuccess, requireLogin = false }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [examType, setExamType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // If requireLogin is set and user is not logged in, redirect to login
        if (requireLogin && !isLoggedIn()) {
            toast('Please login to submit your feedback', { icon: '🔐' });
            onClose();
            navigate('/login');
            return;
        }

        if (rating === 0) {
            toast.error('Please select a star rating');
            return;
        }
        if (!message.trim()) {
            toast.error('Please write a message');
            return;
        }

        setLoading(true);
        try {
            await API.post('/feedback', { rating, message, examType: examType || 'Aspirant' });
            toast.success('Thanks for your feedback! 🎉');
            // Reset state
            setRating(0);
            setHoverRating(0);
            setMessage('');
            setExamType('');
            if (onSuccess) onSuccess();
            else onClose();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                toast.error('Please login to submit feedback');
                onClose();
                navigate('/login');
            } else {
                toast.error('Failed to submit feedback. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="feedback-header">
                    <div className="icon-circle bg-purple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2v1"></path><path d="M12 7a5 5 0 0 0-5 5c0 2 1.5 3 2 5h6c.5-2 2-3 2-5a5 5 0 0 0-5-5Z"></path></svg>
                    </div>
                    <div>
                        <h3>Share Your Experience</h3>
                        <p>Your voice helps us & other aspirants</p>
                    </div>
                </div>

                <div className="feedback-body">
                    <p className="rating-label">
                        <span className="sparkle">✨</span> How would you rate Aspirant-Saathi?
                    </p>

                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill={(hoverRating || rating) >= star ? '#facc15' : 'none'}
                                stroke={(hoverRating || rating) >= star ? '#facc15' : '#cbd5e1'}
                                strokeWidth="1.5"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                cursor="pointer"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        ))}
                    </div>

                    {/* Exam type */}
                    <p className="input-label">Your exam category (optional)</p>
                    <select
                        className="feedback-select"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        style={{ width: '100%', marginBottom: '16px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '14px', background: 'white', color: '#334155', outline: 'none' }}
                    >
                        <option value="">Select category…</option>
                        <option value="UPSC Aspirant">UPSC Aspirant</option>
                        <option value="State PSC Aspirant">State PSC Aspirant</option>
                        <option value="CAPF Candidate">CAPF Candidate</option>
                        <option value="IB/ACIO Candidate">IB/ACIO Candidate</option>
                        <option value="Other">Other</option>
                    </select>

                    <p className="input-label">Share your thoughts</p>
                    <div className="textarea-wrapper">
                        <textarea
                            placeholder="What do you love? What can we improve? Share your honest feedback..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={500}
                        />
                        <span className="char-count">{message.length}/500</span>
                    </div>

                    <button
                        className="submit-feedback-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Your Feedback"}
                    </button>
                    <p className="footer-note">
                        Your review will be shown publicly on the feedbacks page
                    </p>
                </div>
            </div>
        </div>
    );
}
