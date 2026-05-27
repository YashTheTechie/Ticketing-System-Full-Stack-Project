import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ALL_TICKETS = [
  { id: "TKT-001", customer: "Rahul Sharma",  email: "rahul@company.com",   issue: "VPN not connecting",                 description: "User is unable to connect to company VPN since morning. Error code 720 appears while connecting. Multiple restart attempts were made but issue still persists.", priority: "High",   category: "VPN / Remote Access",     createdAt: "26 May 2026, 09:00 AM" },
  { id: "TKT-002", customer: "Priya Shah",    email: "priya@company.com",   issue: "Outlook calendar not syncing",       description: "Outlook calendar is not syncing with mobile phone. Meetings added on desktop do not appear on mobile and vice versa. This has been happening since last week.",    priority: "Medium", category: "Email / Outlook",          createdAt: "25 May 2026, 11:00 AM" },
  { id: "TKT-003", customer: "Aman Verma",    email: "aman@company.com",    issue: "Laptop screen flickering",           description: "Laptop screen flickers randomly when opening heavy applications. It has been happening for the past 3 days.",                                                   priority: "Low",    category: "Hardware",                 createdAt: "24 May 2026, 10:00 AM" },
  { id: "TKT-004", customer: "Neha Mehta",    email: "neha@company.com",    issue: "Cannot access shared drive",         description: "Unable to access the shared network drive since this morning. It was working fine yesterday. Getting an access denied error.",                               priority: "High",   category: "Network / Internet",       createdAt: "24 May 2026, 09:30 AM" },
  { id: "TKT-005", customer: "Dev Trivedi",   email: "dev@company.com",     issue: "Adobe Acrobat crashing",             description: "Adobe Acrobat crashes immediately after opening. Tried reinstalling but issue continues.",                                                                       priority: "Medium", category: "Software / Application",   createdAt: "23 May 2026, 02:00 PM" },
  { id: "TKT-006", customer: "Sneha Patil",   email: "sneha@company.com",   issue: "Printer not detected",               description: "Office printer is not being detected on laptop. Other colleagues can print fine but this laptop cannot find the printer.",                                   priority: "Low",    category: "Printer / Scanner",        createdAt: "22 May 2026, 03:00 PM" },
];

const QUICK_REPLIES = [
  "We have received your ticket and are looking into it.",
  "Your issue has been assigned to our IT team.",
  "We are currently investigating the issue.",
  "Please restart your system and try again.",
  "Issue has been identified and fix is in progress.",
  "Your issue has been resolved successfully.",
];

const priorityStyle = {
  High:   { color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  Medium: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Low:    { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
};

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const TICKET = ALL_TICKETS.find((t) => t.id === id) || ALL_TICKETS[0];

  const [status, setStatus]       = useState("Open");
  const [noteInput, setNoteInput] = useState("");
  const [msgInput, setMsgInput]   = useState("");
  const [timeline, setTimeline]   = useState([
    { type: "raised",   label: "Ticket Raised", time: TICKET.createdAt, done: true  },
    { type: "progress", label: "In Progress",   time: "",               done: false },
    { type: "resolved", label: "Issue Resolved",time: "",               done: false },
  ]);
  const [notes, setNotes]       = useState([]);
  const [messages, setMessages] = useState([]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    setTimeline((prev) =>
      prev.map((item) => {
        if (newStatus === "In Progress" && item.type === "progress")
          return { ...item, done: true, time: now };
        if (newStatus === "Closed" && item.type === "progress")
          return { ...item, done: true, time: item.time || now };
        if (newStatus === "Closed" && item.type === "resolved")
          return { ...item, done: true, time: now };
        return item;
      })
    );
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    setNotes([...notes, { text: noteInput, time: now }]);
    setNoteInput("");
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    setMessages([...messages, { text: msgInput, time: now }]);
    setMsgInput("");
  };

  const isResolved = status === "Closed";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/all-tickets")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 14px", borderRadius: "8px", fontSize: "13px",
            fontWeight: "500", background: "#fff", color: "#475569",
            border: "1px solid #e2e8f0", cursor: "pointer", marginBottom: "1.5rem",
          }}
        >
          ← Back to All Tickets
        </button>

        {/* Resolved Banner */}
        {isResolved && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "12px", padding: "14px 20px",
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "1.5rem",
          }}>
            <span style={{ fontSize: "28px" }}>✅</span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#16a34a", margin: 0 }}>
                Ticket Resolved
              </p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                This ticket has been marked as closed and resolved.
              </p>
            </div>
          </div>
        )}

        {/* Ticket Header Card */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", fontFamily: "monospace", fontWeight: "600", margin: "0 0 4px 0" }}>
                {TICKET.id}
              </p>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
                {TICKET.issue}
              </h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "20px",
                  color: priorityStyle[TICKET.priority].color,
                  background: priorityStyle[TICKET.priority].bg,
                  border: `1px solid ${priorityStyle[TICKET.priority].border}`,
                }}>
                  {TICKET.priority} Priority
                </span>
                <span style={{
                  fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "20px",
                  color: "#475569", background: "#f1f5f9",
                }}>
                  {TICKET.category}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 2px 0" }}>Raised on</p>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#475569", margin: 0 }}>{TICKET.createdAt}</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "16px" }}>
            {[
              { label: "Customer Name", value: TICKET.customer },
              { label: "Email",         value: TICKET.email    },
              { label: "Category",      value: TICKET.category },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "14px", color: "#0f172a", fontWeight: "500", margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 10px 0" }}>
            Issue Description
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: 0 }}>
            {TICKET.description}
          </p>
        </div>

        {/* Timeline */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1.5rem 0" }}>
            Ticket Timeline
          </h2>
          <div style={{ position: "relative", paddingLeft: "32px" }}>
            {timeline.map((item, i) => (
              <div key={item.type} style={{ position: "relative", marginBottom: i < timeline.length - 1 ? "28px" : "0" }}>
                {/* Vertical Line */}
                {i < timeline.length - 1 && (
                  <div style={{
                    position: "absolute", left: "-24px", top: "20px",
                    width: "2px", height: "100%",
                    background: item.done ? "#22c55e" : "#e2e8f0",
                  }} />
                )}
                {/* Dot */}
                <div style={{
                  position: "absolute", left: "-32px", top: "2px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: item.done ? "#22c55e" : "#e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: "#fff", fontWeight: "700",
                  border: `2px solid ${item.done ? "#16a34a" : "#cbd5e1"}`,
                }}>
                  {item.done ? "✓" : ""}
                </div>
                <div>
                  <p style={{
                    fontSize: "14px", fontWeight: "600", margin: "0 0 2px 0",
                    color: item.done ? "#0f172a" : "#94a3b8",
                  }}>
                    {item.label}
                    {item.type === "resolved" && item.done && (
                      <span style={{ marginLeft: "8px" }}>✅</span>
                    )}
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    {item.time || "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Status */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1rem 0" }}>
            Update Status
          </h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["Open", "In Progress", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                style={{
                  padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
                  fontWeight: "600", cursor: "pointer", border: "1px solid",
                  borderColor: status === s ? "#2563eb" : "#e2e8f0",
                  background: status === s ? "#eff6ff" : "#f8fafc",
                  color: status === s ? "#2563eb" : "#64748b",
                  transition: "all 0.15s",
                }}
              >
                {s === "Closed" ? "✅ " : s === "In Progress" ? "🔧 " : "🎫 "}{s}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1rem 0" }}>
            Admin Notes
          </h2>

          <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "8px" }}>
            Quick Replies:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => setNoteInput(q)}
                style={{
                  padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
                  fontWeight: "500", background: "#f1f5f9", color: "#475569",
                  border: "1px solid #e2e8f0", cursor: "pointer",
                }}
              >
                {q.length > 40 ? q.slice(0, 40) + "..." : q}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            placeholder="Add a note or update for this ticket..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "8px",
              border: "1px solid #e2e8f0", fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif", resize: "vertical",
              outline: "none", boxSizing: "border-box", marginBottom: "10px",
            }}
          />
          <button
            onClick={addNote}
            style={{
              padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
              fontWeight: "600", background: "#2563eb", color: "#fff",
              border: "none", cursor: "pointer",
            }}
          >
            Add Note
          </button>

          {notes.length > 0 && (
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              {notes.map((note, i) => (
                <div key={i} style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderLeft: "3px solid #2563eb", borderRadius: "8px",
                  padding: "10px 14px",
                }}>
                  <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 4px 0" }}>{note.text}</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>🛠 Admin · {note.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Client */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>
            Message Client
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem 0" }}>
            Send a direct message to <strong>{TICKET.customer}</strong> ({TICKET.email})
          </p>

          <textarea
            rows={3}
            placeholder={`Write a message to ${TICKET.customer}...`}
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "8px",
              border: "1px solid #e2e8f0", fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif", resize: "vertical",
              outline: "none", boxSizing: "border-box", marginBottom: "10px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
              fontWeight: "600", background: "#7c3aed", color: "#fff",
              border: "none", cursor: "pointer",
            }}
          >
            📨 Send Message
          </button>

          {messages.length > 0 && (
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  background: "#f5f3ff", border: "1px solid #ddd6fe",
                  borderLeft: "3px solid #7c3aed", borderRadius: "8px",
                  padding: "10px 14px",
                }}>
                  <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 4px 0" }}>{msg.text}</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>📨 Sent to {TICKET.customer} · {msg.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
