import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';
import '../styles/FeedbackModal.css';

export default function FeedbackModal({ isOpen, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a star rating');
            return;
        }

        setLoading(true);
        try {
            await API.post('/feedback', { rating, message });
            toast.success('Thanks for your feedback! Check your email.');
            onClose();
            // Reset
            setRating(0);
            setHoverRating(0);
            setMessage('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit feedback');
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
                        <h3>Help Us Improve</h3>
                        <p>Your insights drive our platform forward</p>
                    </div>
                </div>

                <div className="feedback-body">
                    <p className="rating-label">
                        <span className="sparkle">✨</span> How would you rate your learning experience?
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

                    <p className="input-label">Share your thoughts</p>
                    <div className="textarea-wrapper">
                        <textarea
                            placeholder="What can we do better? Any features you'd like to see..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={1000}
                        />
                        <span className="char-count">{message.length}/1000</span>
                    </div>

                    <div className="contact-box">
                        <p>Need immediate help?</p>
                        <a href="mailto:aspirantsaathisuppport@gmail.com" className="email-us-btn">
                            Mail us <span className="arrow">→</span>
                        </a>
                    </div>

                    <button
                        className="submit-feedback-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Your Feedback"}
                    </button>
                    <p className="footer-note">
                        Every piece of feedback helps us build a better learning experience for you
                    </p>
                </div>
            </div>
        </div>
    );
}
