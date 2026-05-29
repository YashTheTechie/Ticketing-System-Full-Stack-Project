import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const statusStyle = {
  Open: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  "In Progress": { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  Resolved: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
};

const priorityStyle = {
  High: { color: "#ef4444", bg: "#fef2f2" },
  Medium: { color: "#f59e0b", bg: "#fffbeb" },
  Low: { color: "#22c55e", bg: "#f0fdf4" },
};

export default function TicketDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msgInput, setMsgInput] = useState("");

  const token = localStorage.getItem("token");

  // 🎫 FETCH TICKET FROM BACKEND API
  const fetchTicketDetails = async () => {
    try {
      setError("");
      if (!token) {
        setError("You must be logged in to view this ticket.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`/api/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTicket(res.data);
    } catch (err) {
      console.error("Error loading ticket details:", err);
      setError(err.response?.data?.message || "The requested ticket could not be retrieved.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  // 💬 SEND TWO-WAY MESSAGE BACK TO ADMIN
  const handleSendMessage = async () => {
    if (!msgInput.trim()) return;

    try {
      await axios.post(
        `/api/tickets/${id}/message`,
        {
          text: msgInput,
          sender: "user", // Identifies this message thread contribution as the client side
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsgInput("");
      fetchTicketDetails(); 
    } catch (err) {
      console.error("Error sending client response:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        Connecting to helpdesk logs...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>Ticket Not Found</h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" }}>{error}</p>
          <button onClick={() => navigate("/client/my-tickets")} style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}>
            ← Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  const isResolved = ticket.status === "Resolved";
  const currentStatus = ticket.status || "Open";
  const currentPriority = ticket.priority || "Medium";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Back Button */}
        <button
          onClick={() => navigate("/client/my-tickets")}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", background: "#fff", color: "#475569", border: "1px solid #e2e8f0", cursor: "pointer", marginBottom: "1.5rem" }}
        >
          ← Back to My Tickets
        </button>

        {/* Dynamic Status Banner */}
        {isResolved && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "28px" }}>✅</span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#16a34a", margin: 0 }}>Your Issue Has Been Resolved!</p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>This ticket has been verified and closed by our IT team.</p>
            </div>
          </div>
        )}

        {/* Ticket Details Summary Header */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px 0", fontFamily: "monospace", fontWeight: "600" }}>
                {ticket.ticketNumber}
              </p>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
                {ticket.title}
              </h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "20px", color: (statusStyle[currentStatus]?.color || "#64748b"), background: (statusStyle[currentStatus]?.bg || "#f1f5f9"), border: `1px solid ${statusStyle[currentStatus]?.border || "#e2e8f0"}` }}>
                  {currentStatus}
                </span>
                <span style={{ fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "20px", color: (priorityStyle[currentPriority]?.color || "#475569"), background: (priorityStyle[currentPriority]?.bg || "#f1f5f9") }}>
                  {currentPriority} Priority
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 2px 0" }}>Submitted on</p>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#475569", margin: 0 }}>
                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-IN") : "N/A"}
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "16px" }}>
              {[
                { label: "Customer Name", value: ticket.user?.name || "N/A" },
                { label: "Email Address", value: ticket.user?.email || "N/A" },
                { label: "Category", value: ticket.category || "General" },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>{item.label}</p>
                  <p style={{ fontSize: "14px", color: "#0f172a", margin: 0, fontWeight: "500" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Issue Description Container */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 12px 0" }}>Issue Description</h2>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: 0, whiteSpace: "pre-line" }}>
            {ticket.description}
          </p>
        </div>

        {/* TIMELINE HISTORY */}
        {ticket.timeline?.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1.5rem 0" }}>Ticket Timeline History</h2>
            <div style={{ position: "relative", paddingLeft: "32px" }}>
              {ticket.timeline.map((item, i) => (
                <div key={i} style={{ position: "relative", marginBottom: i < ticket.timeline.length - 1 ? "24px" : "0" }}>
                  {i < ticket.timeline.length - 1 && (
                    <div style={{ position: "absolute", left: "-24px", top: "20px", width: "2px", height: "100%", background: "#22c55e" }} />
                  )}
                  <div style={{ position: "absolute", left: "-32px", top: "2px", width: "18px", height: "18px", borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", border: "2px solid #16a34a" }}>
                    ✓
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 2px 0", color: "#0f172a" }}>{item.message}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{new Date(item.time).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Support Remarks */}
        {ticket.notes?.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1rem 0" }}>Staff Support Remarks</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ticket.notes.map((note, i) => (
                <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px", borderLeft: "3px solid #2563eb" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>🛠 Tech Agent Response</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(note.time).toLocaleString("en-IN")}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: "1.6" }}>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE TWO-WAY CHAT COMPONENT */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1rem 0" }}>Interactive Conversation</h2>

          {!isResolved ? (
            <div style={{ marginBottom: "1.5rem" }}>
              <textarea
                rows={3}
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Post a message back to the IT HelpDesk Staff..."
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "10px", boxSizing: "border-box", fontFamily: "inherit", fontSize: "14px" }}
              />
              <button onClick={handleSendMessage} style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer", fontWeight: "600" }}>
                Send Response
              </button>
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "#16a34a", background: "#f0fdf4", padding: "10px", borderRadius: "6px", fontWeight: "500", marginBottom: "1rem" }}>
              🔒 Messaging locked because this issue has been marked Resolved.
            </p>
          )}

          {ticket.messages?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ticket.messages.map((msg, index) => {
                const isUser = msg.sender === "user" || msg.sender === "client";
                return (
                  <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: "14px", background: isUser ? "#f5f3ff" : "#f1f5f9", borderRight: isUser ? "4px solid #7c3aed" : "none", borderLeft: !isUser ? "4px solid #475569" : "none" }}>
                      <p style={{ margin: "0 0 4px 0", color: "#1e1b4b", fontSize: "14px" }}>{msg.text}</p>
                      <small style={{ color: "#94a3b8", display: "block", fontSize: "11px", textAlign: isUser ? "right" : "left" }}>
                        <strong style={{ color: isUser ? "#7c3aed" : "#475569", textTransform: "uppercase", marginRight: "6px" }}>{isUser ? "You" : "Support Staff"}</strong>
                        {new Date(msg.time).toLocaleString("en-IN")}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: "1rem 0 0 0" }}>No conversation logs recorded on this item yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}