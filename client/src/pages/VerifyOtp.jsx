
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { setUser } from "../utils/auth";
import "../styles/VerifyOtp.css";
import toast from "react-hot-toast";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            toast.error("No email to verify. Please login first.");
            navigate("/login");
        }
    }, [email, navigate]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if empty
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pastedData.every(char => !isNaN(char))) {
            const newOtp = [...otp];
            pastedData.forEach((digit, i) => {
                if (i < 6) newOtp[i] = digit;
            });
            setOtp(newOtp);
            // Focus last filled input
            if (inputRefs.current[pastedData.length - 1 < 6 ? pastedData.length - 1 : 5]) {
                inputRefs.current[pastedData.length - 1 < 6 ? pastedData.length - 1 : 5].focus();
            }
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await API.post("/auth/verify-otp", { email, otp: otpValue });

            // Save token and user
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);

            toast.success("Verification successful!");
            navigate(location.state?.from || "/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Verification failed");
            toast.error("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const [timer, setTimer] = useState(40);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        if (!canResend) return;

        setLoading(true);
        try {
            await API.post("/auth/resend-otp", { email });
            setTimer(40);
            setCanResend(false);
            toast.success("Code resent to your email!");
        } catch (err) {
            toast.error("Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <div className="otp-icon">
                    🔐
                </div>
                <h2 className="otp-title">Verify Your Email</h2>
                <p className="otp-subtitle">
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="otp-email-highlight">{email}</span>
                </p>

                <div className="otp-input-group">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="otp-digit-input"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button
                    className="verify-btn"
                    onClick={handleVerify}
                    disabled={loading || otp.join("").length !== 6}
                >
                    {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <div className="resend-section">
                    {canResend ? (
                        <>
                            Didn't receive the code?
                            <span
                                className="resend-link"
                                onClick={handleResend}
                            >
                                Resend Code
                            </span>
                        </>
                    ) : (
                        <>
                            Resend code in <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{timer}s</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
