import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy data — replace with real API data later
const DUMMY_TICKETS = [
  { id: "TKT-001", name: "Rahul Kumar",  email: "rahul@company.com",  title: "VPN not connecting after Windows update",       status: "Open",        priority: "High",   category: "VPN / Remote Access",      date: "26 May 2026" },
  { id: "TKT-002", name: "Rahul Kumar",  email: "rahul@company.com",  title: "Outlook calendar not syncing with mobile",       status: "In Progress", priority: "Medium", category: "Email / Outlook",           date: "25 May 2026" },
  { id: "TKT-003", name: "Rahul Kumar",  email: "rahul@company.com",  title: "Laptop screen flickering randomly",              status: "Closed",      priority: "Low",    category: "Hardware",                  date: "24 May 2026" },
  { id: "TKT-004", name: "Rahul Kumar",  email: "rahul@company.com",  title: "Cannot access shared network drive",             status: "Open",        priority: "High",   category: "Network / Internet",        date: "24 May 2026" },
  { id: "TKT-005", name: "Rahul Kumar",  email: "rahul@company.com",  title: "Adobe Acrobat crashing on startup",              status: "In Progress", priority: "Medium", category: "Software / Application",    date: "23 May 2026" },
  { id: "TKT-006", name: "Rahul Kumar",  email: "rahul@company.com",  title: "Printer not detected on office network",         status: "Closed",      priority: "Low",    category: "Printer / Scanner",         date: "22 May 2026" },
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

export default function MyTickets() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("All");

  const filtered = DUMMY_TICKETS.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
              My Tickets
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Track and manage all your submitted support tickets.
            </p>
          </div>
          <button
            onClick={() => navigate("/client/raise-issue")}
            style={{
              padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
              fontWeight: "600", background: "#2563eb", color: "#fff",
              border: "none", cursor: "pointer",
            }}
          >
            + Raise New Issue
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem", flexWrap: "wrap" }}>

          {/* Search */}
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)", fontSize: "16px", color: "#94a3b8",
            }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email or title..."
              style={{
                width: "100%", padding: "10px 12px 10px 36px",
                borderRadius: "8px", border: "1px solid #e2e8f0",
                fontSize: "14px", color: "#0f172a", background: "#fff",
                boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                outline: "none",
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Open", "In Progress", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
                  fontWeight: "500", cursor: "pointer", border: "1px solid",
                  borderColor: statusFilter === s ? "#2563eb" : "#e2e8f0",
                  background: statusFilter === s ? "#eff6ff" : "#fff",
                  color: statusFilter === s ? "#2563eb" : "#64748b",
                  transition: "all 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "12px", marginBottom: "1.5rem" }}>
          {[
            { label: "Total",       value: DUMMY_TICKETS.length,                                    color: "#2563eb", bg: "#eff6ff" },
            { label: "Open",        value: DUMMY_TICKETS.filter(t => t.status === "Open").length,        color: "#f59e0b", bg: "#fffbeb" },
            { label: "In Progress", value: DUMMY_TICKETS.filter(t => t.status === "In Progress").length, color: "#8b5cf6", bg: "#f5f3ff" },
            { label: "Closed",      value: DUMMY_TICKETS.filter(t => t.status === "Closed").length,      color: "#22c55e", bg: "#f0fdf4" },
          ].map((s) => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: "10px",
              padding: "12px 16px", textAlign: "center",
              border: `1px solid ${s.color}22`,
            }}>
              <div style={{ fontSize: "22px", fontWeight: "700", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tickets List */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>

          {filtered.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>No tickets found</p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Try a different search or filter</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Ticket ID", "Title", "Category", "Priority", "Status", "Date", ""].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "12px 16px",
                      fontSize: "12px", fontWeight: "600", color: "#64748b",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, i) => (
                  <tr
                    key={ticket.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: "600", color: "#2563eb", fontFamily: "monospace" }}>
                      {ticket.id}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#0f172a", maxWidth: "220px" }}>
                      <div style={{ fontWeight: "500" }}>{ticket.title}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{ticket.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>
                      {ticket.category}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: "12px", fontWeight: "500",
                        padding: "3px 10px", borderRadius: "20px",
                        color: priorityStyle[ticket.priority].color,
                        background: priorityStyle[ticket.priority].bg,
                      }}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: "12px", fontWeight: "500",
                        padding: "4px 10px", borderRadius: "20px",
                        color: statusStyle[ticket.status].color,
                        background: statusStyle[ticket.status].bg,
                        border: `1px solid ${statusStyle[ticket.status].border}`,
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#94a3b8" }}>
                      {ticket.date}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => navigate(`/client/ticket/${ticket.id}`)}
                        style={{
                          padding: "6px 14px", borderRadius: "6px",
                          fontSize: "12px", fontWeight: "600",
                          background: "#eff6ff", color: "#2563eb",
                          border: "1px solid #bfdbfe", cursor: "pointer",
                        }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Result count */}
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "12px", textAlign: "right" }}>
          Showing {filtered.length} of {DUMMY_TICKETS.length} tickets
        </p>

      </div>
    </div>
  );
}