import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  .cl-root {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: stretch;
  }

  .cl-left {
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

  .cl-left::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .cl-left::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .cl-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cl-brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cl-brand-icon svg {
    width: 18px;
    height: 18px;
    stroke: #34d399;
  }

  .cl-brand-name {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: -0.01em;
  }

  .cl-tagline {
    max-width: 340px;
  }

  .cl-tagline h1 {
    font-size: 2.4rem;
    font-weight: 300;
    color: #f8fafc;
    letter-spacing: -0.04em;
    line-height: 1.15;
    margin: 0 0 1rem;
  }

  .cl-tagline h1 em {
    font-style: normal;
    color: #34d399;
  }

  .cl-tagline p {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    line-height: 1.7;
    margin: 0;
  }

  .cl-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 2rem;
  }

  .cl-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  .cl-feature-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #34d399;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .cl-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.2);
    font-family: 'JetBrains Mono', monospace;
  }

  .cl-meta-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #34d399;
    animation: cl-pulse 2s infinite;
  }

  @keyframes cl-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .cl-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #0d0d14;
  }

  .cl-card {
    width: 100%;
    max-width: 380px;
  }

  .cl-card-header {
    margin-bottom: 2rem;
  }

  .cl-card-title {
    font-size: 22px;
    font-weight: 500;
    color: #f8fafc;
    letter-spacing: -0.03em;
    margin: 0 0 6px;
  }

  .cl-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    line-height: 1.6;
    margin: 0;
  }

  .cl-field {
    margin-bottom: 1rem;
  }

  .cl-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .cl-input-wrap {
    position: relative;
  }

  .cl-input {
    width: 100%;
    padding: 11px 14px;
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

  .cl-input::placeholder {
    color: rgba(255,255,255,0.18);
  }

  .cl-input:focus {
    border-color: rgba(16,185,129,0.4);
    background: rgba(16,185,129,0.04);
  }

  .cl-input.error {
    border-color: rgba(239,68,68,0.4);
  }

  .cl-input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .cl-input-pw {
    padding-right: 44px;
  }

  .cl-pw-toggle {
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

  .cl-pw-toggle:hover { color: rgba(255,255,255,0.5); }
  .cl-pw-toggle svg { width: 16px; height: 16px; stroke: currentColor; }

  .cl-field-error {
    font-size: 12px;
    color: #fca5a5;
    margin: 5px 0 0 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cl-field-error svg {
    width: 12px;
    height: 12px;
    stroke: currentColor;
    flex-shrink: 0;
  }

  .cl-btn {
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
    margin-top: 1.25rem;
    background: #059669;
    color: #fff;
  }

  .cl-btn:hover:not(:disabled) { opacity: 0.88; }
  .cl-btn:active:not(:disabled) { transform: scale(0.99); }
  .cl-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .cl-btn svg {
    width: 15px;
    height: 15px;
    stroke: currentColor;
    flex-shrink: 0;
  }

  .cl-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 1.5rem 0;
  }

  .cl-signup-row {
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.25);
  }

  .cl-signup-row a {
    color: #34d399;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .cl-signup-row a:hover { opacity: 0.75; }

  .cl-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cl-spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes cl-spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .cl-root { flex-direction: column; }
    .cl-left {
      flex: none;
      padding: 1.5rem;
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .cl-left::before, .cl-left::after { display: none; }
    .cl-tagline { display: none; }
    .cl-meta { display: none; }
    .cl-right { width: 100%; padding: 2rem 1.25rem; flex: 1; }
    .cl-card { max-width: 100%; }
    .cl-input { font-size: 16px; }
  }

  @media (max-width: 420px) {
    .cl-left { padding: 1.25rem; }
    .cl-right { padding: 1.5rem 1rem; }
    .cl-card-title { font-size: 20px; }
  }
`;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await axios.post(`${baseURL}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token) throw new Error("Token not received from server");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Something went wrong";
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cl-root">

        {/* Left panel */}
        <div className="cl-left">
          <div className="cl-brand">
            <div className="cl-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="cl-brand-name">SupportDesk</span>
          </div>

          <div className="cl-tagline">
            <h1>Your issues,<br /><em>resolved</em><br />faster.</h1>
            <p>Raise tickets, track progress, and get real-time updates — all in one place.</p>
            <div className="cl-features">
              <div className="cl-feature"><div className="cl-feature-dot" />Raise and track support tickets</div>
              <div className="cl-feature"><div className="cl-feature-dot" />Real-time status updates</div>
              <div className="cl-feature"><div className="cl-feature-dot" />Full history and audit trail</div>
            </div>
          </div>

          <div className="cl-meta">
            <div className="cl-meta-dot" />
            support system online &nbsp;·&nbsp; v2.0
          </div>
        </div>

        {/* Right login panel */}
        <div className="cl-right">
          <div className="cl-card">

            <div className="cl-card-header">
              <h2 className="cl-card-title">Welcome back</h2>
              <p className="cl-card-sub">Sign in to your SupportDesk account to continue.</p>
            </div>

            <div className="cl-field">
              <label className="cl-label">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="you@company.com"
                className={`cl-input${errors.email ? " error" : ""}`}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="cl-field-error">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="cl-field">
              <label className="cl-label">Password</label>
              <div className="cl-input-wrap">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                  className={`cl-input cl-input-pw${errors.password ? " error" : ""}`}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cl-pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="cl-field-error">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <button onClick={handleSubmit} disabled={loading} className="cl-btn">
              {loading ? (
                <>
                  <div className="cl-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <div className="cl-divider" />

            <p className="cl-signup-row">
              Don't have an account?{" "}
              <Link to="/signup">Create one here</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}