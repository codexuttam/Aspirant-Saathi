import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/auth";
import { toast } from "react-hot-toast";
import API from "../services/api";
import "../styles/Pricing.css";

const Pricing = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!isLoggedIn()) {
            toast.error("Please log in first to upgrade to Pro! 🚀");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Preparing secure checkout...");

        try {
            // 1. Create order on backend
            const { data: order } = await API.post("/payment/create-order");

            // 2. Fetch Razorpay config (key)
            const { data: config } = await API.get("/payment/config");

            const options = {
                key: config.key,
                amount: order.amount,
                currency: order.currency,
                name: "Aspirant-Saathi",
                description: "Pro Aspirant Monthly Plan",
                order_id: order.id,
                handler: async (response) => {
                    const vToastId = toast.loading("Verifying payment...");
                    try {
                        const verifyRes = await API.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.isPro) {
                            // Update local user state
                            const updatedUser = { ...user, isPro: true, tokens: 99999 };
                            localStorage.setItem("user", JSON.stringify(updatedUser));

                            toast.success("Welcome to Pro! Your account is now upgraded. 🎖️", { id: vToastId });
                            setTimeout(() => navigate("/premium-details"), 2000);
                        }
                    } catch (err) {
                        console.error("Verification failed:", err);
                        toast.error("Payment verification failed. Please contact support.", { id: vToastId });
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phoneNumber || "",
                },
                theme: {
                    color: "#7c3aed",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error("Payment failed: " + response.error.description);
            });

            rzp.open();
            toast.dismiss(toastId); // 🚀 Remove "Preparing..." toast as modal opens
        } catch (error) {
            console.error("Payment Error:", error);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.error || "Failed to initialize payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pricing-wrapper">
            <Navbar />

            <div className="pricing-container">
                <header className="pricing-header">
                    <h1 className="pricing-title">Simple, Transparent Pricing</h1>
                    <p className="pricing-subtitle">Start for free, upgrade for power. No hidden fees.</p>
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
                            <div className="feature-item"><span className="check">✓</span><span><strong>100 Free Tokens</strong> on sign up</span></div>
                            <div className="feature-item"><span className="check">✓</span><span><strong>5 Tokens</strong> per text evaluation</span></div>
                            <div className="feature-item"><span className="check">✓</span><span><strong>20 Tokens</strong> per image upload</span></div>
                            <div className="feature-item"><span className="check">✓</span><span>Basic Answer Analysis</span></div>
                            <div className="feature-item"><span className="check">✓</span><span>Community Support</span></div>
                        </div>
                        <button className="plan-btn outline" disabled>Current Plan</button>
                    </div>

                    {/* Pro Plan */}
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
                            <div className="feature-item"><span className="check">✓</span><span><strong>Unlimited Tokens</strong></span></div>
                            <div className="feature-item"><span className="check">✓</span><span>Detailed AI Feedback with Model Answers</span></div>
                            <div className="feature-item"><span className="check">✓</span><span>Priority Evaluation Queue</span></div>
                            <div className="feature-item"><span className="check">✓</span><span>Performance Analytics Dashboard</span></div>
                            <div className="feature-item"><span className="check">✓</span><span>24/7 Email Support</span></div>
                        </div>
                        {user?.isPro ? (
                            <button className="plan-btn outline" disabled>Active Plan ✓</button>
                        ) : (
                            <button
                                className="plan-btn solid"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? "Preparing Checkout..." : "Upgrade to Pro 🚀"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="token-info">
                    <h3>How tokens work?</h3>
                    <p>
                        Every evaluation costs <strong>5 tokens</strong> for typed text and
                        <strong> 20 tokens</strong> for handwritten image uploads. You get
                        <strong> 100 tokens</strong> for free when you sign up. Need more?
                        Upgrade to Pro for unlimited access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
