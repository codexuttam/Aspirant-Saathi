import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // 'checking', 'error', 'valid'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setEmailStatus(null);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      if (res.data.otpSent) {
        toast.success("OTP Sent! Please verify.");
        navigate("/verify-otp", { state: { email: form.email, from: "/" } });
      } else {
        // Fallback for dev mode without OTP or legacy users
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Login to access your evaluations</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              required
              className={`form-input ${emailStatus === 'error' ? 'error-border' : ''} ${emailStatus === 'valid' ? 'valid-border' : ''}`}
              style={emailStatus === 'error' ? { borderColor: 'red' } : emailStatus === 'valid' ? { borderColor: 'green' } : {}}
            />
            {emailStatus === 'valid' && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'green' }}>✅</span>}
            {emailStatus === 'error' && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'red' }}>❌</span>}
          </div>
        </div>

        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                userSelect: 'none',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? (
                // Eye Off (Hide)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                // Eye (Show)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading} className="primary-btn-full">
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
