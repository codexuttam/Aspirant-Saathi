import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { isLoggedIn, getUser } from "../utils/auth";
import "../styles/Pricing.css";

const Pricing = () => {
    const navigate = useNavigate();
    const user = getUser();
    // Dynamically load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        if (!isLoggedIn()) {
            toast.error("Please log in first to upgrade to Pro! 🚀");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        const loadingToast = toast.loading("Initializing payment gateway...");
        try {
            // Get Razorpay key (optional, we could also use env var)
            const { data: config } = await API.get('/payment/config');

            // Create Order
            const { data: order } = await API.post('/payment/create-order');



            const options = {
                key: config.key,
                amount: order.amount,
                currency: "INR",
                name: "Aspirant-Saathi Pro",
                description: "Upgrade to Pro Aspirant",
                order_id: order.id,
                theme: {
                    color: "#3b82f6",
                },
                handler: async function (response) {
                    try {
                        toast.loading("Verifying payment...", { id: loadingToast });
                        const { data } = await API.post('/payment/verify', response);

                        if (data.isPro) {
                            toast.success("Payment Successful! You are now a Pro Aspirant 🎉", { id: loadingToast });
                            // Update user object in local storage so the UI updates immediately
                            const currentUser = JSON.parse(localStorage.getItem('user')) || {};
                            currentUser.isPro = true;
                            currentUser.tokens = 99999;
                            localStorage.setItem('user', JSON.stringify(currentUser));

                            setTimeout(() => window.location.href = "/dashboard", 1500);
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        toast.error("Payment verification failed. Contact support.", { id: loadingToast });
                    }
                },
                prefill: {
                    name: "Aspirant User",
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error("Payment failed or cancelled.", { id: loadingToast });
            });

            toast.dismiss(loadingToast);
            rzp.open();

        } catch (error) {
            console.error("Payment initialization failed", error);
            const errorMsg = error.response?.data?.error || "Failed to initialize payment gateway.";
            toast.error(errorMsg, { id: loadingToast, duration: 5000 });
        }
    };
    return (
        <div className="pricing-wrapper">
            <Navbar />

            <div className="pricing-container">
                <header className="pricing-header">
                    <h1 className="pricing-title">Simple, Transparent Pricing</h1>
                    <p className="pricing-subtitle">
                        Start for free, upgrade for power. No hidden fees.
                    </p>
                </header>

                <div className="pricing-cards">
                    {/* Free Plan */}
                    <div className="pricing-card free">
                        <div className="card-header">
                            <h2 className="plan-name">Starter</h2>
                            <div className="price">
                                <span className="currency">₹</span>0
                                <span className="period">/forever</span>
                            </div>
                            <p className="plan-desc">Perfect for trying out the platform.</p>
                        </div>

                        <div className="features-list">
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span><strong>100 Free Tokens</strong> on sign up</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span><strong>5 Tokens</strong> per evaluation</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Basic Answer Analysis</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Community Support</span>
                            </div>
                        </div>

                        <button className="plan-btn outline" disabled>Current Plan</button>
                    </div>

                    {/* Premium Plan */}
                    <div className="pricing-card premium">
                        <div className="badge">MOST POPULAR</div>
                        <div className="card-header">
                            <h2 className="plan-name">Pro Aspirant</h2>
                            <div className="price">
                                <span className="currency">₹</span>499
                                <span className="period">/month</span>
                            </div>
                            <p className="plan-desc">For serious aspirants needing daily feedback.</p>
                        </div>

                        <div className="features-list">
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span><strong>Unlimited Tokens</strong></span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Detailed AI Feedback with Model Answers</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Priority Evaluation Queue</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>Performance Analytics Dashboard</span>
                            </div>
                            <div className="feature-item">
                                <span className="check">✓</span>
                                <span>24/7 Email Support</span>
                            </div>
                        </div>

                        {user?.isPro ? (
                            <button className="plan-btn outline" disabled>Active Plan</button>
                        ) : (
                            <button className="plan-btn solid" onClick={handlePayment}>
                                Upgrade to Pro 🚀
                            </button>
                        )}
                    </div>
                </div>

                <div className="token-info">
                    <h3>How tokens work?</h3>
                    <p>
                        Every evaluation costs <strong>5 tokens</strong>. You get <strong>100 tokens</strong> for free when you sign up.
                        Need more? Upgrade to Premium for unlimted access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
