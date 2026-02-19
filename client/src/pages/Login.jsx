import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [form, setForm] = useState({
    email: "",
    password: "",
    phoneNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // 'checking', 'error', 'valid'

  // Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await API.post("/auth/google", {
          access_token: tokenResponse.access_token
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.user.detailsRequired) {
          toast.success("Please complete your profile details.");
          navigate("/complete-profile");
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        toast.error("Google Login Failed");
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setEmailStatus(null);
  };

  // Check Email Existence
  const handleEmailBlur = async () => {
    if (!form.email || !form.email.includes('@')) return;

    setEmailStatus('checking');
    try {
      const res = await API.post("/auth/check-email", { email: form.email });
      if (res.data.exists) {
        setEmailStatus('valid');
      } else {
        setEmailStatus('error');
        toast.error("Email not found. Please register.");
      }
    } catch (err) {
      console.error(err);
      setEmailStatus(null);
    }
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginMethod === "email") {
        const res = await API.post("/auth/login", { email: form.email, password: form.password });
        if (res.data.otpSent) {
          toast.success("OTP Sent! Please verify.");
          navigate("/verify-otp", { state: { email: form.email, from: "/" } });
        } else {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        // Phone Login
        const res = await API.post("/auth/send-otp-phone", { phoneNumber: form.phoneNumber });
        if (res.data.otpSent) {
          toast.success("OTP Sent to Phone!");
          // Log simulated OTP for user convenience if returned
          console.log("Simulated OTP:", res.data.dev_otp);
          navigate("/verify-otp", { state: { phoneNumber: form.phoneNumber, from: "/" } });
        }
      }

    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>

        {/* Header Section */}
        <div className="auth-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>

        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">
          New to Aspirant Saathi? <Link to="/register">Create an account</Link>
        </p>

        {/* Tabs */}
        <div className="auth-tabs" style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            className={`auth-tab ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
          <button
            type="button"
            className={`auth-tab ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginMethod('phone')}
          >
            Phone
          </button>
        </div>

        {/* Google Button - Only show on email tab or both? Usually distinct from phone but okay to keep */}
        {loginMethod === 'email' && (
          <>
            <button
              type="button"
              className="google-btn"
              onClick={() => googleLogin()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>
          </>
        )}

        {loginMethod === 'email' ? (
          <>
            {/* Email Input */}
            <div className="form-group">
              <label className="input-label">Email Address <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  required
                  className={`form-input ${emailStatus === 'error' ? 'error-border' : ''} ${emailStatus === 'valid' ? 'valid-border' : ''}`}
                />
                {/* Validation Icons */}
                {emailStatus === 'checking' && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  </span>
                )}
                {emailStatus === 'valid' && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                )}
                {emailStatus === 'error' && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </span>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="input-label">Password <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex'
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94m9.9.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Phone Input */
          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="input-label">Phone Number <span>*</span></label>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="primary-btn-full">
          {loading ? "Processing..." : (loginMethod === 'email' ? "Sign In" : "Send OTP")}
        </button>

        <p className="auth-footer-text">
          By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
