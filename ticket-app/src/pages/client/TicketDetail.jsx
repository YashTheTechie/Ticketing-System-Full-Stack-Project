import { useParams, useNavigate } from "react-router-dom";

// Dummy data — replace with real API data later
const DUMMY_TICKETS = [
  {
    id: "TKT-001",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "VPN not connecting after Windows update",
    description: "After the latest Windows update on 25th May, I am unable to connect to the company VPN. It shows an authentication error every time I try. I have already tried restarting the system and reinstalling the VPN client but the issue persists.",
    status: "Open",
    priority: "High",
    category: "VPN / Remote Access",
    date: "26 May 2026",
    timeline: [
      { type: "raised",   label: "Ticket Raised", time: "26 May 2026, 09:00 AM", done: true  },
      { type: "progress", label: "In Progress",   time: "",                      done: false },
      { type: "resolved", label: "Issue Resolved",time: "",                      done: false },
    ],
    notes: [
      { author: "IT Team", message: "We have received your ticket and are looking into it.", time: "26 May 2026, 10:30 AM" },
    ],
  },
  {
    id: "TKT-002",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Outlook calendar not syncing with mobile",
    description: "My Outlook calendar is not syncing with my mobile phone. Meetings added on desktop do not appear on mobile and vice versa. This has been happening since last week.",
    status: "In Progress",
    priority: "Medium",
    category: "Email / Outlook",
    date: "25 May 2026",
    timeline: [
      { type: "raised",   label: "Ticket Raised", time: "25 May 2026, 11:00 AM", done: true  },
      { type: "progress", label: "In Progress",   time: "25 May 2026, 02:00 PM", done: true  },
      { type: "resolved", label: "Issue Resolved",time: "",                      done: false },
    ],
    notes: [
      { author: "IT Team", message: "We have identified the issue with your Exchange account settings.", time: "25 May 2026, 02:00 PM" },
      { author: "IT Team", message: "Please re-add your account on mobile and let us know if the issue persists.", time: "25 May 2026, 04:15 PM" },
    ],
  },
  {
    id: "TKT-003",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Laptop screen flickering randomly",
    description: "My laptop screen flickers randomly, especially when I open heavy applications. It has been happening for the past 3 days.",
    status: "Closed",
    priority: "Low",
    category: "Hardware",
    date: "24 May 2026",
    timeline: [
      { type: "raised",   label: "Ticket Raised", time: "24 May 2026, 09:00 AM", done: true },
      { type: "progress", label: "In Progress",   time: "24 May 2026, 11:00 AM", done: true },
      { type: "resolved", label: "Issue Resolved",time: "24 May 2026, 05:00 PM", done: true },
    ],
    notes: [
      { author: "IT Team", message: "We have updated your display drivers remotely.", time: "24 May 2026, 11:00 AM" },
      { author: "IT Team", message: "Issue resolved after driver update. Please confirm.", time: "24 May 2026, 03:00 PM" },
      { author: "IT Team", message: "Ticket closed as issue is resolved.", time: "24 May 2026, 05:00 PM" },
    ],
  },
  {
    id: "TKT-004",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Cannot access shared network drive",
    description: "I am unable to access the shared network drive since this morning. It was working fine yesterday. I get an access denied error.",
    status: "Open",
    priority: "High",
    category: "Network / Internet",
    date: "24 May 2026",
    timeline: [
      { type: "raised",   label: "Ticket Raised", time: "24 May 2026, 09:30 AM", done: true  },
      { type: "progress", label: "In Progress",   time: "",                      done: false },
      { type: "resolved", label: "Issue Resolved",time: "",                      done: false },
    ],
    notes: [],
  },
  {
    id: "TKT-005",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Adobe Acrobat crashing on startup",
    description: "Adobe Acrobat crashes immediately after opening. I have tried reinstalling it but the issue continues.",
    status: "In Progress",
    priority: "Medium",
    category: "Software / Application",
    date: "23 May 2026",
    timeline: [
      { type: "raised",   label: "Ticket Raised", time: "23 May 2026, 02:00 PM", done: true  },
      { type: "progress", label: "In Progress",   time: "23 May 2026, 03:00 PM", done: true  },
      { type: "resolved", label: "Issue Resolved",time: "",                      done: false },
    ],
    notes: [
      { author: "IT Team", message: "We are checking compatibility with the latest OS update.", time: "23 May 2026, 01:00 PM" },
    ],
  },
  {
    id: "TKT-006",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Printer not detected on office network",
    description: "The office printer is not being detected on my laptop. Other colleagues can print fine but my laptop cannot find the printer.",
    status: "Closed",
    priority: "Low",
    category: "Printer / Scanner",
    date: "22 May 2026",
    timeline: [
      { type: "raised",   label: "Ticket Raised", time: "22 May 2026, 09:00 AM", done: true },
      { type: "progress", label: "In Progress",   time: "22 May 2026, 10:00 AM", done: true },
      { type: "resolved", label: "Issue Resolved",time: "22 May 2026, 12:00 PM", done: true },
    ],
    notes: [
      { author: "IT Team", message: "Printer drivers reinstalled remotely.", time: "22 May 2026, 10:00 AM" },
      { author: "IT Team", message: "Ticket closed. Issue resolved.", time: "22 May 2026, 12:00 PM" },
    ],
  },
];

const statusStyle = {
  "Open":        { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  "In Progress": { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  "Closed":      { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
};

const priorityStyle = {
  "High":   { color: "#ef4444", bg: "#fef2f2" },
  "Medium": { color: "#f59e0b", bg: "#fffbeb" },
  "Low":    { color: "#22c55e", bg: "#f0fdf4" },
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ticket = DUMMY_TICKETS.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f8fafc",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
            Ticket Not Found
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" }}>
            The ticket you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate("/client/my-tickets")}
            style={{
              padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
              fontWeight: "600", background: "#2563eb", color: "#fff",
              border: "none", cursor: "pointer",
            }}
          >
            ← Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  const isResolved = ticket.status === "Closed";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Back Button */}
        <button
          onClick={() => navigate("/client/my-tickets")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 14px", borderRadius: "8px", fontSize: "13px",
            fontWeight: "500", background: "#fff", color: "#475569",
            border: "1px solid #e2e8f0", cursor: "pointer", marginBottom: "1.5rem",
          }}
        >
          ← Back to My Tickets
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
                Your Issue Has Been Resolved!
              </p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                This ticket has been closed by our IT team.
              </p>
            </div>
          </div>
        )}

        {/* Ticket Header */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px 0", fontFamily: "monospace", fontWeight: "600" }}>
                {ticket.id}
              </p>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
                {ticket.title}
              </h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "12px", fontWeight: "500", padding: "4px 10px",
                  borderRadius: "20px", color: statusStyle[ticket.status].color,
                  background: statusStyle[ticket.status].bg,
                  border: `1px solid ${statusStyle[ticket.status].border}`,
                }}>
                  {ticket.status}
                </span>
                <span style={{
                  fontSize: "12px", fontWeight: "500", padding: "4px 10px",
                  borderRadius: "20px", color: priorityStyle[ticket.priority].color,
                  background: priorityStyle[ticket.priority].bg,
                }}>
                  {ticket.priority} Priority
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 2px 0" }}>Submitted on</p>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#475569", margin: 0 }}>{ticket.date}</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "16px" }}>
              {[
                { label: "Customer Name", value: ticket.name     },
                { label: "Email",         value: ticket.email    },
                { label: "Category",      value: ticket.category },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "14px", color: "#0f172a", margin: 0, fontWeight: "500" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 12px 0" }}>
            Issue Description
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: 0 }}>
            {ticket.description}
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
            {ticket.timeline.map((item, i) => (
              <div key={item.type} style={{ position: "relative", marginBottom: i < ticket.timeline.length - 1 ? "28px" : "0" }}>
                {/* Vertical Line */}
                {i < ticket.timeline.length - 1 && (
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

        {/* Updates & Notes */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "14px", padding: "1.5rem",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1rem 0" }}>
            Updates & Notes
          </h2>

          {ticket.notes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                No updates yet. Our team will respond shortly.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ticket.notes.map((note, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    borderRadius: "10px", padding: "12px 16px",
                    borderLeft: "3px solid #2563eb",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>
                      🛠 {note.author}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {note.time}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: "1.6" }}>
                    {note.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}