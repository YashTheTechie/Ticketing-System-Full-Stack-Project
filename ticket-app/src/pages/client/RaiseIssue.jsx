import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ⚡ Added useLocation to read passed state
import axios from "axios";

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
  const location = useLocation(); // ⚡ Initialize location state listener

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    priority: "Medium",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverTicketId, setServerTicketId] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌟 NEW: Automatically capture and select the category passed from the Home page card
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setForm((prevForm) => ({
        ...prevForm,
        category: location.state.selectedCategory,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.category)           newErrors.category    = "Please select a category";
    if (!form.title.trim())       newErrors.title       = "Issue title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
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
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ server: "Authentication token missing. Please log in again." });
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/tickets",
        {
          category: form.category,
          title: form.title,
          description: form.description,
          priority: form.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServerTicketId(res.data.ticketNumber);
      setSubmitted(true);
    } catch (err) {
      console.error("Ticket Submission Failure:", err);
      setErrors({
        server: err.response?.data?.message || "Failed to transmit ticket details to server.",
      });
    } finally {
      setLoading(false);
    }
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
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Your Official Ticket ID</p>
            <p style={{ fontSize: "22px", fontWeight: "700", color: "#2563eb", margin: 0, fontFamily: "monospace" }}>
              {serverTicketId}
            </p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0 0" }}>
              This ID is safely logged in your Atlas database index
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
              onClick={() => { 
                setSubmitted(false); 
                setForm({ category: "", title: "", description: "", priority: "Medium" }); 
                setErrors({});
              }}
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

        {/* Form Card */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "2rem" }}>
          
          {errors.server && (
            <div style={{ padding: "10px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: "8px", marginBottom: "1rem", fontSize: "14px" }}>
              {errors.server}
            </div>
          )}

          {/* Row — Category & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Category <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={inputStyle(errors.category)}
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              placeholder="Describe your issue in detail — what happened, when it started..."
              rows={5}
              style={{ ...inputStyle(errors.description), resize: "vertical" }}
              disabled={loading}
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: "8px",
                fontSize: "15px", fontWeight: "600",
                background: loading ? "#93c5fd" : "#2563eb", color: "#fff",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
            <button
              onClick={() => navigate("/client/my-tickets")}
              disabled={loading}
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