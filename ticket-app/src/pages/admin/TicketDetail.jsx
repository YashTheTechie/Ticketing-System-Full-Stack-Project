import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QUICK_REPLIES = [
  "We have received your ticket and are looking into it.",
  "Your issue has been assigned to our IT team.",
  "We are currently investigating the issue.",
  "Please restart your system and try again.",
  "Issue has been identified and fix is in progress.",
  "Your issue has been resolved successfully.",
];

const priorityStyle = {
  High: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  Medium: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Low: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
};

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("Open");
  const [noteInput, setNoteInput] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      setError(null);
      const res = await axios.get(`/api/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
    } catch (error) {
      console.error("Error fetching ticket:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load ticket data.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(`/api/tickets/${id}/status`, { status: newStatus });
      setTicket(res.data);
      setStatus(res.data.status);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      alert(`Status Update Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const addNote = async () => {
    if (!noteInput.trim()) return;
    try {
      const res = await axios.post(`/api/tickets/${id}/note`, { text: noteInput.trim() });
      setTicket(prev => ({ ...prev, notes: res.data }));
      setNoteInput("");
    } catch (error) {
      console.error("Error adding note:", error.response?.data || error.message);
      alert(`Failed to save note: ${error.response?.data?.message || error.message}`);
    }
  };

  const sendMessage = async () => {
    if (!msgInput.trim()) return;
    try {
      const res = await axios.post(`/api/tickets/${id}/message`, { text: msgInput.trim() });
      setTicket(prev => ({ ...prev, messages: res.data }));
      setMsgInput("");
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "2rem", borderRadius: "12px", display: "inline-block" }}>
          <p style={{ color: "#ef4444", fontWeight: "600", margin: "0 0 1rem 0" }}>⚠️ {error}</p>
          <button onClick={() => navigate("/admin/all-tickets")} style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Go Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ padding: "3rem", fontSize: "18px", fontWeight: "600", textAlign: "center", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
        Loading ticket...
      </div>
    );
  }

  const isResolved = status === "Resolved";
  const isInProgress = status === "In Progress";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* BACK ACTION ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/admin/all-tickets")}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: "500", color: "#475569", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
          >
            ← Back to All Tickets
          </button>
          <span style={{ fontSize: "14px", color: "#64748b", fontFamily: "monospace", background: "#e2e8f0", padding: "4px 10px", borderRadius: "6px" }}>
            {ticket.ticketNumber}
          </span>
        </div>

        {/* RESOLVED BANNER */}
        {isResolved && (
          <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px 20px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>✅</span>
            <div>
              <h4 style={{ margin: 0, color: "#15803d", fontWeight: "700" }}>Ticket Resolved Successfully</h4>
              <p style={{ margin: "2px 0 0 0", fontSize: "14px", color: "#166534" }}>This issue is closed. Status controls and text panels have been locked down.</p>
            </div>
          </div>
        )}

        {/* MAIN BODY LAYOUT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* TICKET CARD SUMMARY */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: priorityStyle[ticket.priority]?.color, background: priorityStyle[ticket.priority]?.bg, border: `1px solid ${priorityStyle[ticket.priority]?.border}` }}>
              {ticket.priority} Priority
            </span>
            
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "12px 0" }}>{ticket.title}</h1>
            
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "14px", color: "#475569", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "1rem" }}>
              <div><strong>Category:</strong> <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>{ticket.category}</span></div>
              <div><strong>Customer:</strong> {ticket.user?.name || "N/A"} ({ticket.user?.email || "N/A"})</div>
              <div><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem 2rem", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginTop: 0, marginBottom: "0.5rem" }}>Issue Description</h3>
            <p style={{ color: "#334155", lineHeight: "1.6", margin: 0, whiteSpace: "pre-line" }}>{ticket.description}</p>
          </div>

          {/* SYSTEM AUDIT HISTORY */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem 2rem", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginTop: 0, marginBottom: "1rem" }}>System Audit History</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ticket.timeline?.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%", marginTop: "6px" }} />
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#334155" }}>{item.message}</p>
                    <small style={{ color: "#94a3b8" }}>{new Date(item.time).toLocaleString("en-IN")}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATUS PANEL */}
          {!isResolved && (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem 2rem", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginTop: 0, marginBottom: "1rem" }}>Update Ticket Progress</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {["Open", "In Progress", "Resolved"].map((s) => {
                  const isDisabled = isInProgress && (s === "Open" || s === "In Progress");
                  const isActive = status === s;

                  return (
                    <button
                      key={s}
                      disabled={isDisabled}
                      onClick={() => handleStatusChange(s)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        border: isActive ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        background: isActive ? "#eff6ff" : isDisabled ? "#f1f5f9" : "#fff",
                        color: isActive ? "#2563eb" : isDisabled ? "#94a3b8" : "#475569",
                        opacity: isDisabled ? 0.6 : 1,
                      }}
                    >
                      {isActive ? `✓ ${s}` : s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ADMIN INTERNAL NOTES */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginTop: 0, marginBottom: "1rem" }}>Internal Admin Notes</h3>
            
            {!isResolved ? (
              <>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => setNoteInput(q)}
                      style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e2e8f0", cursor: "pointer", background: "#f8fafc", fontSize: "13px", color: "#64748b" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Type internal notes (Only visible to admin staff)..."
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", fontFamily: "inherit", fontSize: "14px" }}
                />

                <button onClick={addNote} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: "600", marginBottom: "1rem" }}>
                  Save Note
                </button>
              </>
            ) : (
              <p style={{ margin: "0 0 1rem 0", color: "#64748b", fontSize: "14px", fontStyle: "italic" }}>
                🔒 This ticket is resolved. Adding internal documentation notes has been suspended.
              </p>
            )}

            {ticket.notes?.length > 0 && (
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
                {ticket.notes.map((note, index) => (
                  <div key={index} style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", borderLeft: "4px solid #3b82f6" }}>
                    <p style={{ margin: "0 0 6px 0", color: "#334155", fontSize: "14px" }}>{note.text}</p>
                    <small style={{ color: "#94a3b8" }}>{new Date(note.time).toLocaleString("en-IN")}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EXTERNAL CUSTOMER MESSAGES */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginTop: 0, marginBottom: "1rem" }}>Customer Communications</h3>

            {!isResolved ? (
              <>
                <textarea
                  rows={3}
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Send message directly to the customer..."
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", fontFamily: "inherit", fontSize: "14px" }}
                />

                <button onClick={sendMessage} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer", fontWeight: "600" }}>
                  Send Message
                </button>
              </>
            ) : (
              <p style={{ margin: "0 0 1rem 0", color: "#64748b", fontSize: "14px", fontStyle: "italic" }}>
                🔒 This ticket is resolved. Direct external customer dispatch features are deactivated.
              </p>
            )}

            {ticket.messages?.length > 0 && (
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
                {ticket.messages.map((msg, index) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: "14px", background: isAdmin ? "#f5f3ff" : "#f1f5f9", borderRight: isAdmin ? "4px solid #7c3aed" : "none", borderLeft: !isAdmin ? "4px solid #64748b" : "none" }}>
                        <p style={{ margin: "0 0 4px 0", color: "#1e1b4b", fontSize: "14px", lineHeight: "1.5" }}>{msg.text}</p>
                        <small style={{ color: "#94a3b8", display: "block", textAlign: isAdmin ? "right" : "left", fontSize: "11px" }}>
                          <span style={{ fontWeight: "600", color: isAdmin ? "#7c3aed" : "#64748b", textTransform: "uppercase", marginRight: "6px" }}>
                            {isAdmin ? "You" : "Customer"}
                          </span>
                          {new Date(msg.time).toLocaleString("en-IN")}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}