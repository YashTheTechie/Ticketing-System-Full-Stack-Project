import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  .su-root {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: stretch;
  }

  .su-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    border-right: 1px solid rgba(255,255,255,0.06);
    background: #0a0a0f;
    position: relative;
    overflow: hidden;
  }

  .su-left::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .su-left::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .su-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .su-brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(139,92,246,0.12);
    border: 1px solid rgba(139,92,246,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .su-brand-icon svg {
    width: 18px;
    height: 18px;
    stroke: #a78bfa;
  }

  .su-brand-name {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: -0.01em;
  }

  .su-tagline {
    max-width: 340px;
  }

  .su-tagline h1 {
    font-size: 2.4rem;
    font-weight: 300;
    color: #f8fafc;
    letter-spacing: -0.04em;
    line-height: 1.15;
    margin: 0 0 1rem;
  }

  .su-tagline h1 em {
    font-style: normal;
    color: #a78bfa;
  }

  .su-tagline p {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    line-height: 1.7;
    margin: 0;
  }

  .su-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 2rem;
  }

  .su-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  .su-feature-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #a78bfa;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .su-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.2);
    font-family: 'JetBrains Mono', monospace;
  }

  .su-meta-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #a78bfa;
    animation: su-pulse 2s infinite;
  }

  @keyframes su-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .su-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #0d0d14;
  }

  .su-card {
    width: 100%;
    max-width: 380px;
  }

  .su-card-header {
    margin-bottom: 1.75rem;
  }

  .su-card-title {
    font-size: 22px;
    font-weight: 500;
    color: #f8fafc;
    letter-spacing: -0.03em;
    margin: 0 0 6px;
  }

  .su-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    line-height: 1.6;
    margin: 0;
  }

  .su-general-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    margin-bottom: 1.1rem;
    font-size: 13px;
    color: #fca5a5;
    line-height: 1.5;
  }

  .su-general-error svg {
    width: 15px;
    height: 15px;
    stroke: #f87171;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .su-field {
    margin-bottom: 0.9rem;
  }

  .su-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .su-input-wrap {
    position: relative;
  }

  .su-input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    color: #f1f5f9;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, background 0.2s;
    -webkit-appearance: none;
  }

  .su-input::placeholder { color: rgba(255,255,255,0.18); }

  .su-input:focus {
    border-color: rgba(139,92,246,0.4);
    background: rgba(139,92,246,0.04);
  }

  .su-input.error { border-color: rgba(239,68,68,0.4); }
  .su-input.valid { border-color: rgba(16,185,129,0.35); }
  .su-input:disabled { opacity: 0.4; cursor: not-allowed; }
  .su-input-pw { padding-right: 44px; }

  .su-pw-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    color: rgba(255,255,255,0.25);
    transition: color 0.15s;
  }

  .su-pw-toggle:hover { color: rgba(255,255,255,0.5); }
  .su-pw-toggle svg { width: 16px; height: 16px; stroke: currentColor; }

  .su-field-error {
    font-size: 12px;
    color: #fca5a5;
    margin: 4px 0 0 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .su-field-error svg { width: 12px; height: 12px; stroke: currentColor; flex-shrink: 0; }

  .su-pw-strength {
    display: flex;
    gap: 4px;
    margin-top: 6px;
  }

  .su-pw-bar {
    flex: 1;
    height: 2px;
    border-radius: 2px;
    background: rgba(255,255,255,0.07);
    transition: background 0.3s;
  }

  .su-pw-bar.weak { background: #ef4444; }
  .su-pw-bar.fair { background: #f59e0b; }
  .su-pw-bar.strong { background: #10b981; }

  .su-pw-label {
    font-size: 11px;
    margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  .su-pw-label.weak { color: #f87171; }
  .su-pw-label.fair { color: #fbbf24; }
  .su-pw-label.strong { color: #34d399; }

  .su-btn {
    width: 100%;
    padding: 11px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Sora', sans-serif;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s, transform 0.1s;
    margin-top: 1.1rem;
    background: #7c3aed;
    color: #fff;
  }

  .su-btn:hover:not(:disabled) { opacity: 0.88; }
  .su-btn:active:not(:disabled) { transform: scale(0.99); }
  .su-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .su-btn svg { width: 15px; height: 15px; stroke: currentColor; flex-shrink: 0; }

  .su-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 1.25rem 0; }

  .su-login-row {
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.25);
  }

  .su-login-row a {
    color: #a78bfa;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .su-login-row a:hover { opacity: 0.75; }

  .su-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: su-spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes su-spin { to { transform: rotate(360deg); } }

  .su-success {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
  }

  .su-success-inner {
    text-align: center;
    max-width: 320px;
    padding: 2rem;
  }

  .su-success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  .su-success-icon svg { width: 26px; height: 26px; stroke: #34d399; }

  .su-success-inner h2 {
    font-size: 20px;
    font-weight: 500;
    color: #f8fafc;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }

  .su-success-inner p {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    line-height: 1.6;
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
  }

  @media (max-width: 768px) {
    .su-root { flex-direction: column; }
    .su-left {
      flex: none;
      padding: 1.5rem;
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .su-left::before, .su-left::after { display: none; }
    .su-tagline { display: none; }
    .su-meta { display: none; }
    .su-right { width: 100%; padding: 2rem 1.25rem; flex: 1; }
    .su-card { max-width: 100%; }
    .su-input { font-size: 16px; }
  }

  @media (max-width: 420px) {
    .su-left { padding: 1.25rem; }
    .su-right { padding: 1.5rem 1rem; }
    .su-card-title { font-size: 20px; }
  }
`;

function getPasswordStrength(pw) {
  if (!pw) return null;
  if (pw.length < 6) return "weak";
  if (pw.length < 10 || !/[^a-zA-Z0-9]/.test(pw)) return "fair";
  return "strong";
}

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())         newErrors.name            = "Full name is required";
    if (!form.email.trim())        newErrors.email           = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password)            newErrors.password        = "Password is required";
    else if (form.password.length < 6) newErrors.password    = "Password must be at least 6 characters";
    if (!form.confirmPassword)     newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.post(`${baseURL}/api/auth/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      if (msg.includes("email")) setErrors({ email: msg });
      else setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  const pwStrength = getPasswordStrength(form.password);

  if (success) {
    return (
      <>
        <style>{styles}</style>
        <div className="su-success">
          <div className="su-success-inner">
            <div className="su-success-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Account created</h2>
            <p>redirecting to login…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="su-root">

        {/* Left panel */}
        <div className="su-left">
          <div className="su-brand">
            <div className="su-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="su-brand-name">SupportDesk</span>
          </div>

          <div className="su-tagline">
            <h1>Get support,<br /><em>effortlessly</em><br />every time.</h1>
            <p>Create your account and start raising tickets in under a minute.</p>
            <div className="su-features">
              <div className="su-feature"><div className="su-feature-dot" />Instant ticket submission</div>
              <div className="su-feature"><div className="su-feature-dot" />Live status tracking</div>
              <div className="su-feature"><div className="su-feature-dot" />Secure and private</div>
            </div>
          </div>

          <div className="su-meta">
            <div className="su-meta-dot" />
            support system online &nbsp;·&nbsp; v2.0
          </div>
        </div>

        {/* Right panel */}
        <div className="su-right">
          <div className="su-card">

            <div className="su-card-header">
              <h2 className="su-card-title">Create account</h2>
              <p className="su-card-sub">Fill in your details to get started with SupportDesk.</p>
            </div>

            {errors.general && (
              <div className="su-general-error">
                <ErrorIcon />
                {errors.general}
              </div>
            )}

            {/* Full Name */}
            <div className="su-field">
              <label className="su-label">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Rahul Kumar"
                className={`su-input${errors.name ? " error" : form.name ? " valid" : ""}`}
                disabled={loading}
                autoComplete="name"
              />
              {errors.name && <p className="su-field-error"><ErrorIcon />{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="you@company.com"
                className={`su-input${errors.email ? " error" : form.email && /\S+@\S+\.\S+/.test(form.email) ? " valid" : ""}`}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && <p className="su-field-error"><ErrorIcon />{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-input-wrap">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Minimum 6 characters"
                  className={`su-input su-input-pw${errors.password ? " error" : ""}`}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" className="su-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="su-pw-strength">
                    <div className={`su-pw-bar ${pwStrength === "weak" || pwStrength === "fair" || pwStrength === "strong" ? pwStrength : ""}`} />
                    <div className={`su-pw-bar ${pwStrength === "fair" || pwStrength === "strong" ? pwStrength : ""}`} />
                    <div className={`su-pw-bar ${pwStrength === "strong" ? "strong" : ""}`} />
                  </div>
                  <p className={`su-pw-label ${pwStrength}`}>{pwStrength}</p>
                </>
              )}
              {errors.password && <p className="su-field-error"><ErrorIcon />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="su-field">
              <label className="su-label">Confirm password</label>
              <div className="su-input-wrap">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Re-enter your password"
                  className={`su-input su-input-pw${errors.confirmPassword ? " error" : form.confirmPassword && form.confirmPassword === form.password ? " valid" : ""}`}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" className="su-pw-toggle" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Hide password" : "Show password"}>
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && <p className="su-field-error"><ErrorIcon />{errors.confirmPassword}</p>}
            </div>

            <button onClick={handleSubmit} disabled={loading} className="su-btn">
              {loading ? (
                <><div className="su-spinner" />Creating account…</>
              ) : (
                <>
                  Create account
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <div className="su-divider" />

            <p className="su-login-row">
              Already have an account?{" "}
              <Link to="/login">Sign in here</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}