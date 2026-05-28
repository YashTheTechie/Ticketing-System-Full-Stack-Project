import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    // Strict Frontend validation for the single admin account
    if (email.trim().toLowerCase() !== "champyash21@gmail.com") {
      setError("Access Denied. Enter correct admin email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin/login", { email });
      if (res.data.step2Required) {
        setStep(2); // Slide forward to OTP input view
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
      const res = await axios.post("http://localhost:5000/api/auth/admin/verify-otp", {
        email,
        otp,
      });

      // 🔐 Save Admin Token Context
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Route to master admin dashboard grid layout
      navigate("/admin/all-tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2.5rem 2rem", maxWidth: "400px", width: "100%", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
        
        {/* Branding header block */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "32px", marginBottom: "0.5rem" }}>👑</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Admin Portal</h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
            {step === 1 ? "Enter your email to receive a secure login OTP code." : "A 6-digit security code has been logged."}
          </p>
        </div>

        {error && (
          <div style={{ padding: "10px 12px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "13px", fontWeight: "500" }}>
            🚨 {error}
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: EMAIL INPUT FORM */
          <form onSubmit={handleRequestOtp}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Admin Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@company.com"
                style={inputStyle}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending Code..." : "Send OTP Verification Code"}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP INPUT FORM */
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>6-Digit Verification Code</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow digits
                placeholder="Enter 6-digit OTP"
                style={{ ...inputStyle, letterSpacing: "4px", textAlign: "center", fontSize: "18px", fontWeight: "700" }}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Verifying..." : "Verify & Access Dashboard"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ width: "100%", background: "none", border: "none", color: "#64748b", marginTop: "1rem", cursor: "pointer", fontSize: "13px", fontWeight: "500", textDecoration: "underline" }}
            >
              ← Back to email changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px"
};

const inputStyle = {
  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#0f172a", outline: "none", boxSizing: "border-box"
};

const btnStyle = (loading) => ({
  width: "100%", padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: loading ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer"
});