import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // ✅ SAFE TOKEN HANDLING (FIXED)
      const token = res.data?.token;
      const user = res.data?.user;

      if (!token) {
        throw new Error("Token not received from server");
      }

      // ✅ IMPORTANT FIX: unified key name
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
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
        padding: "2.5rem", width: "100%", maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>

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
            Welcome Back!
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Login to your SupportDesk account
          </p>
        </div>

        <div style={{
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: "8px", padding: "10px 14px", marginBottom: "1.5rem",
        }}>
          <p style={{ fontSize: "12px", color: "#2563eb", margin: "0 0 2px 0", fontWeight: "600" }}>
            🔐 Admin Login
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Email: admin@supportdesk.com · Password: admin123
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={inputStyle(errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Password <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={inputStyle(errors.password)}
          />
          {errors.password && <p style={errorStyle}>{errors.password}</p>}
        </div>

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", margin: 0 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
            Sign up here
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