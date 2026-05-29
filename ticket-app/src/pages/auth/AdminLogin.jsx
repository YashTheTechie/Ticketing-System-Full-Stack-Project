import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  .al-root {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: stretch;
  }

  .al-left {
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

  .al-left::before {
    content: '';
    position: absolute;
    top: -40%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .al-left::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .al-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .al-brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .al-brand-icon svg {
    width: 18px;
    height: 18px;
    stroke: #818cf8;
  }

  .al-brand-name {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: -0.01em;
  }

  .al-tagline {
    max-width: 340px;
  }

  .al-tagline h1 {
    font-size: 2.4rem;
    font-weight: 300;
    color: #f8fafc;
    letter-spacing: -0.04em;
    line-height: 1.15;
    margin: 0 0 1rem;
  }

  .al-tagline h1 em {
    font-style: normal;
    color: #818cf8;
  }

  .al-tagline p {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    line-height: 1.7;
    margin: 0;
  }

  .al-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.2);
    font-family: 'JetBrains Mono', monospace;
  }

  .al-meta-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #10b981;
    animation: al-pulse 2s infinite;
  }

  @keyframes al-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .al-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #0d0d14;
  }

  .al-card {
    width: 100%;
    max-width: 380px;
  }

  .al-card-header {
    margin-bottom: 2rem;
  }

  .al-step-track {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 1.75rem;
  }

  .al-step-node {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255,255,255,0.25);
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .al-step-node.active {
    border-color: #818cf8;
    background: rgba(99,102,241,0.15);
    color: #818cf8;
  }

  .al-step-node.done {
    border-color: #10b981;
    background: rgba(16,185,129,0.12);
    color: #10b981;
  }

  .al-step-bar {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
    transition: background 0.3s;
  }

  .al-step-bar.done {
    background: rgba(16,185,129,0.35);
  }

  .al-card-title {
    font-size: 22px;
    font-weight: 500;
    color: #f8fafc;
    letter-spacing: -0.03em;
    margin: 0 0 6px;
  }

  .al-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    line-height: 1.6;
    margin: 0;
  }

  .al-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    margin-bottom: 1.25rem;
    font-size: 13px;
    color: #fca5a5;
    line-height: 1.5;
  }

  .al-error svg {
    width: 15px;
    height: 15px;
    stroke: #f87171;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .al-field {
    margin-bottom: 1.1rem;
  }

  .al-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .al-input {
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

  .al-input::placeholder {
    color: rgba(255,255,255,0.18);
  }

  .al-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
  }

  .al-input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .al-input-otp {
    letter-spacing: 10px;
    text-align: center;
    font-size: 22px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }

  .al-hint {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    margin-bottom: 1.1rem;
  }

  .al-hint svg {
    width: 15px;
    height: 15px;
    stroke: rgba(255,255,255,0.3);
    flex-shrink: 0;
  }

  .al-hint span {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  .al-hint strong {
    color: rgba(255,255,255,0.7);
    font-weight: 500;
  }

  .al-btn {
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
    margin-top: 0.25rem;
    background: #4f46e5;
    color: #fff;
  }

  .al-btn:hover:not(:disabled) {
    opacity: 0.88;
  }

  .al-btn:active:not(:disabled) {
    transform: scale(0.99);
  }

  .al-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .al-btn svg {
    width: 15px;
    height: 15px;
    stroke: currentColor;
    flex-shrink: 0;
  }

  .al-btn-ghost {
    width: 100%;
    background: none;
    border: none;
    color: rgba(255,255,255,0.25);
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    padding: 9px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 6px;
    margin-top: 0.5rem;
    transition: color 0.15s;
  }

  .al-btn-ghost:hover {
    color: rgba(255,255,255,0.55);
  }

  .al-btn-ghost svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
  }

  .al-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 1.5rem 0;
  }

  .al-footer-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.18);
    font-family: 'JetBrains Mono', monospace;
  }

  .al-footer-note svg {
    width: 12px;
    height: 12px;
    stroke: rgba(255,255,255,0.18);
  }

  .al-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: al-spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes al-spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .al-root { flex-direction: column; }
    .al-left {
      flex: none;
      padding: 1.5rem;
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .al-left::before, .al-left::after { display: none; }
    .al-tagline { display: none; }
    .al-meta { display: none; }
    .al-right {
      width: 100%;
      padding: 2rem 1.25rem;
      flex: 1;
    }
    .al-card { max-width: 100%; }
    .al-input { font-size: 16px; }
  }

  @media (max-width: 420px) {
    .al-left { padding: 1.25rem; }
    .al-right { padding: 1.5rem 1rem; }
    .al-card-title { font-size: 20px; }
  }
`;

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim().toLowerCase() !== "champyash21@gmail.com") {
      setError("Access Denied. Enter correct admin email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/admin/login", { email });
      if (res.data.step2Required) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to transmit login request.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/admin/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="al-root">

        {/* Left decorative panel */}
        <div className="al-left">
          <div className="al-brand">
            <div className="al-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <span className="al-brand-name">Admin Portal</span>
          </div>

          <div className="al-tagline">
            <h1>Secure<br /><em>admin</em><br />access.</h1>
            <p>Two-factor authenticated entry to the master control panel. Authorized personnel only.</p>
          </div>

          <div className="al-meta">
            <div className="al-meta-dot" />
            system operational &nbsp;·&nbsp; 2FA enabled
          </div>
        </div>

        {/* Right login panel */}
        <div className="al-right">
          <div className="al-card">

            <div className="al-card-header">
              {/* Step progress track */}
              <div className="al-step-track">
                <div className={`al-step-node ${step === 1 ? "active" : "done"}`}>
                  {step > 1 ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11, stroke: "currentColor" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : "1"}
                </div>
                <div className={`al-step-bar ${step > 1 ? "done" : ""}`} />
                <div className={`al-step-node ${step === 2 ? "active" : ""}`}>2</div>
              </div>

              <h2 className="al-card-title">
                {step === 1 ? "Verify identity" : "Enter your code"}
              </h2>
              <p className="al-card-sub">
                {step === 1
                  ? "Enter your admin email address to receive a one-time passcode."
                  : "A 6-digit code was sent to your inbox. It expires in 10 minutes."}
              </p>
            </div>

            {error && (
              <div className="al-error">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <div className="al-field">
                  <label className="al-label">Admin email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    className="al-input"
                    disabled={loading}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="al-btn">
                  {loading ? (
                    <>
                      <div className="al-spinner" />
                      Sending code…
                    </>
                  ) : (
                    <>
                      Send verification code
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="al-hint">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Sent to <strong>{email}</strong></span>
                </div>
                <div className="al-field">
                  <label className="al-label">6-digit code</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="al-input al-input-otp"
                    disabled={loading}
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
                <button type="submit" disabled={loading} className="al-btn">
                  {loading ? (
                    <>
                      <div className="al-spinner" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify &amp; access dashboard
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="al-btn-ghost"
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Use a different email
                </button>
              </form>
            )}

            <div className="al-divider" />
            <div className="al-footer-note">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              secured with 2FA authentication
            </div>

          </div>
        </div>

      </div>
    </>
  );
}