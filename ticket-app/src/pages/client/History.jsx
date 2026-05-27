import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Only closed tickets — replace with real API data later
const CLOSED_TICKETS = [
  {
    id: "TKT-003",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Laptop screen flickering randomly",
    category: "Hardware",
    priority: "Low",
    status: "Closed",
    date: "24 May 2026",
    resolvedDate: "24 May 2026",
    resolution: "Display drivers were updated remotely. Issue resolved successfully.",
  },
  {
    id: "TKT-006",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Printer not detected on office network",
    category: "Printer / Scanner",
    priority: "Low",
    status: "Closed",
    date: "22 May 2026",
    resolvedDate: "22 May 2026",
    resolution: "Printer drivers reinstalled remotely. Printer detected successfully.",
  },
  {
    id: "TKT-010",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    title: "Unable to reset password",
    category: "Account / Password",
    priority: "Medium",
    status: "Closed",
    date: "20 May 2026",
    resolvedDate: "20 May 2026",
    resolution: "Password reset link sent and account access restored.",
  },
];

const priorityStyle = {
  "High":   { color: "#ef4444", bg: "#fef2f2" },
  "Medium": { color: "#f59e0b", bg: "#fffbeb" },
  "Low":    { color: "#22c55e", bg: "#f0fdf4" },
};

export default function History() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = CLOSED_TICKETS.filter((t) =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
              Ticket History
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              All your resolved and closed support tickets.
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

        {/* Stats */}
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "10px", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "1.5rem",
        }}>
          <span style={{ fontSize: "24px" }}>✅</span>
          <div>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#22c55e", margin: 0 }}>
              {CLOSED_TICKETS.length} Tickets Resolved
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              All issues below have been successfully resolved by the IT team.
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <span style={{
            position: "absolute", left: "12px", top: "50%",
            transform: "translateY(-50%)", fontSize: "16px", color: "#94a3b8",
          }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, title or category..."
            style={{
              width: "100%", padding: "10px 12px 10px 36px",
              borderRadius: "8px", border: "1px solid #e2e8f0",
              fontSize: "14px", color: "#0f172a", background: "#fff",
              boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
              outline: "none",
            }}
          />
        </div>

        {/* Tickets List */}
        {filtered.length === 0 ? (
          <div style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "12px", padding: "4rem", textAlign: "center",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>
              No tickets found
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Try a different search term
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0",
                  borderRadius: "12px", padding: "1.25rem 1.5rem",
                  borderLeft: "4px solid #22c55e",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb", fontFamily: "monospace" }}>
                        {ticket.id}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: "500",
                        padding: "3px 10px", borderRadius: "20px",
                        color: priorityStyle[ticket.priority].color,
                        background: priorityStyle[ticket.priority].bg,
                      }}>
                        {ticket.priority}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: "500",
                        padding: "3px 10px", borderRadius: "20px",
                        color: "#22c55e", background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}>
                        ✓ Closed
                      </span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>
                      {ticket.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                      {ticket.category} · Resolved on {ticket.resolvedDate}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/client/ticket/${ticket.id}`)}
                    style={{
                      padding: "6px 14px", borderRadius: "6px",
                      fontSize: "12px", fontWeight: "600",
                      background: "#eff6ff", color: "#2563eb",
                      border: "1px solid #bfdbfe", cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View →
                  </button>
                </div>

                {/* Resolution note */}
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: "8px", padding: "10px 14px",
                }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", margin: "0 0 4px 0" }}>
                    🛠 Resolution
                  </p>
                  <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                    {ticket.resolution}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Result count */}
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "12px", textAlign: "right" }}>
          Showing {filtered.length} of {CLOSED_TICKETS.length} resolved tickets
        </p>

      </div>
    </div>
  );
}