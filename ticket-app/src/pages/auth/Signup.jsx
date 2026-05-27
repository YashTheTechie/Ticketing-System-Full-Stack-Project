import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      if (msg.includes("email")) {
        setErrors({ email: msg });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
            Account Created!
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "440px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px auto", fontSize: "22px",
          }}>
            🎧
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
            Create Account
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Join SupportDesk to raise IT tickets
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem",
          }}>
            <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>{errors.general}</p>
          </div>
        )}

        {/* Full Name */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Kumar"
            style={inputStyle(errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. rahul@company.com"
            style={inputStyle(errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Password <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            style={inputStyle(errors.password)}
          />
          {errors.password && <p style={errorStyle}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Confirm Password <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            style={inputStyle(errors.confirmPassword)}
          />
          {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "12px", borderRadius: "8px",
            fontSize: "15px", fontWeight: "600",
            background: loading ? "#93c5fd" : "#2563eb", color: "#fff",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "1rem",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", margin: 0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: "600",
  color: "#374151", marginBottom: "6px",
};

const inputStyle = (error) => ({
  width: "100%", padding: "10px 12px", borderRadius: "8px",
  border: `1px solid ${error ? "#ef4444" : "#e2e8f0"}`,
  fontSize: "14px", color: "#0f172a", outline: "none",
  background: "#fff", boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
});

const errorStyle = {
  fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0",
};