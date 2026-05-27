import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Auto generate ticket ID
const generateTicketId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${num}`;
};

const CATEGORIES = [
  "Network / Internet",
  "Hardware",
  "Software / Application",
  "Email / Outlook",
  "VPN / Remote Access",
  "Printer / Scanner",
  "Account / Password",
  "Other",
];

export default function RaiseIssue() {
  const navigate = useNavigate();
  const ticketId = generateTicketId();

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    title: "",
    description: "",
    priority: "Medium",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())        newErrors.name        = "Name is required";
    if (!form.email.trim())       newErrors.email       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.category)           newErrors.category    = "Please select a category";
    if (!form.title.trim())       newErrors.title       = "Issue title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  // Success screen
  if (submitted) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "calc(100vh - 64px)",
        background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: "#fff", borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "3rem 2rem", textAlign: "center",
          maxWidth: "440px", width: "100%",
        }}>
          <div style={{ fontSize: "56px", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
            Ticket Raised Successfully!
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" }}>
            Your ticket has been submitted. Our IT team will get back to you shortly.
          </p>

          <div style={{
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: "10px", padding: "1rem", marginBottom: "2rem",
          }}>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Your Ticket ID</p>
            <p style={{ fontSize: "22px", fontWeight: "700", color: "#2563eb", margin: 0, fontFamily: "monospace" }}>
              {ticketId}
            </p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0 0" }}>
              Save this ID to track your ticket
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/client/my-tickets")}
              style={{
                padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
                fontWeight: "600", background: "#2563eb", color: "#fff",
                border: "none", cursor: "pointer",
              }}
            >
              View My Tickets
            </button>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", title: "", description: "", priority: "Medium" }); }}
              style={{
                padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
                fontWeight: "600", background: "#f1f5f9", color: "#475569",
                border: "1px solid #e2e8f0", cursor: "pointer",
              }}
            >
              Raise Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
            Raise a Support Ticket
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Fill in the details below and our IT team will assist you shortly.
          </p>
        </div>

        {/* Ticket ID Preview */}
        <div style={{
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: "10px", padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}>
          <div>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 2px 0" }}>Auto-generated Ticket ID</p>
            <p style={{ fontSize: "18px", fontWeight: "700", color: "#2563eb", margin: 0, fontFamily: "monospace" }}>
              {ticketId}
            </p>
          </div>
          <div style={{ fontSize: "24px" }}>🎫</div>
        </div>

        {/* Form Card */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "2rem",
        }}>

          {/* Row — Name & Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
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
            <div>
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
          </div>

          {/* Row — Category & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Category <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={inputStyle(errors.category)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p style={errorStyle}>{errors.category}</p>}
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                style={inputStyle()}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Issue Title */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Issue Title <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. VPN not connecting after Windows update"
              style={inputStyle(errors.title)}
            />
            {errors.title && <p style={errorStyle}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Description <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail — what happened, when it started, what you've already tried..."
              rows={5}
              style={{ ...inputStyle(errors.description), resize: "vertical" }}
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1, padding: "12px", borderRadius: "8px",
                fontSize: "15px", fontWeight: "600",
                background: "#2563eb", color: "#fff",
                border: "none", cursor: "pointer",
              }}
            >
              Submit Ticket
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 20px", borderRadius: "8px",
                fontSize: "15px", fontWeight: "500",
                background: "#f1f5f9", color: "#475569",
                border: "1px solid #e2e8f0", cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Styles
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