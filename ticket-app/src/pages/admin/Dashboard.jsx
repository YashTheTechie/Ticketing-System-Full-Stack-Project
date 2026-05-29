import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // 🔄 FETCH LIVE DATABASE METRICS FROM BACKEND
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/tickets/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        console.error("Dashboard calculation ledger error:", err);
        setError(err.response?.data?.message || "Failed to sync real-time dashboard parameters.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError("Admin validation token missing. Please login again.");
      setLoading(false);
    }
  }, [token]);

  // 📊 CALCULATE LIVE METRICS ON THE FLY
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const progressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  const stats = [
    { title: "Total Tickets", count: totalCount, color: "#dbeafe", textColor: "#2563eb" },
    { title: "Open", count: openCount, color: "#fef3c7", textColor: "#d97706" },
    { title: "In Progress", count: progressCount, color: "#ede9fe", textColor: "#7c3aed" },
    { title: "Resolved", count: resolvedCount, color: "#dcfce7", textColor: "#16a34a" }, // ✅ Synced with database literals
  ];

  // ⏱️ SLICE TOP 5 LATEST TICKETS FROM PERSISTED COLLECTION
  const recentTickets = tickets.slice(0, 5);

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
          <div>Recalculating live infrastructure dashboard diagnostics...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", padding: "30px", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* HEADER BLOCK */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px", color: "#111827", fontWeight: "700" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          Manage all support tickets and monitor system activity.
        </p>
      </div>

      {/* ERROR STATUS INFOBAR */}
      {error && (
        <div style={{ padding: "14px 18px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#ef4444", fontSize: "14px", marginBottom: "1.5rem" }}>
          ⚠️ {error}
        </div>
      )}

      {/* DYNAMIC STATS CARD CAROUSEL/GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {stats.map((item, index) => (
          <div key={index} style={{ background: item.color, padding: "25px", borderRadius: "18px", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#475569" }}>
              {item.title}
            </h2>
            <h1 style={{ fontSize: "40px", fontWeight: "700", color: item.textColor, margin: 0 }}>
              {item.count}
            </h1>
          </div>
        ))}
      </div>

      {/* RECENT TICKETS CONTAINER */}
      <div style={{ background: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", color: "#111827", fontWeight: "700", margin: 0 }}>
            Recent Activity Logs
          </h2>
          
          {/* ✅ ACTION VIEW-ALL ROUTE BUTTON LINK */}
          <button
            onClick={() => navigate("/admin/all-tickets")}
            style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.target.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.background = "#2563eb")}
          >
            View All Tickets →
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "15px", color: "#475569", fontWeight: "600" }}>Ticket ID</th>
                <th style={{ padding: "15px", color: "#475569", fontWeight: "600" }}>Customer</th>
                <th style={{ padding: "15px", color: "#475569", fontWeight: "600" }}>Issue Summary</th>
                <th style={{ padding: "15px", color: "#475569", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "15px", color: "#475569", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "15px", color: "#475569", fontWeight: "600" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <tr key={ticket._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {/* TICKET STR NO */}
                    <td style={{ padding: "15px", fontFamily: "monospace", fontWeight: "700", color: "#2563eb" }}>
                      {ticket.ticketNumber}
                    </td>

                    {/* CUSTOMER PROFILE */}
                    <td style={{ padding: "15px" }}>
                      <div style={{ fontWeight: "600", color: "#111827" }}>{ticket.user?.name || "Unknown"}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{ticket.user?.email || "—"}</div>
                    </td>

                    {/* CORE TITLE */}
                    <td style={{ padding: "15px", color: "#374151", fontWeight: "500" }}>
                      {ticket.title}
                    </td>

                    {/* STATUS DECORATIVE BADGE */}
                    <td style={{ padding: "15px" }}>
                      <span style={{
                        background: ticket.status === "Open" ? "#fef3c7" : ticket.status === "Resolved" ? "#dcfce7" : "#ede9fe",
                        color: ticket.status === "Open" ? "#d97706" : ticket.status === "Resolved" ? "#16a34a" : "#7c3aed",
                        padding: "6px 12px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", display: "inline-block"
                      }}>
                        {ticket.status}
                      </span>
                    </td>

                    {/* TIMESTAMP CALENDAR DATE */}
                    <td style={{ padding: "15px", color: "#6b7280", whiteSpace: "nowrap" }}>
                      {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>

                    {/* ✅ INTERACTIVE ACTION LINKING WORKSPACE BUTTON */}
                    <td style={{ padding: "15px" }}>
                      <button
                        onClick={() => navigate(`/admin/ticket/${ticket._id}`)}
                        style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px", transition: "all 0.2s" }}
                        onMouseEnter={(e) => (e.target.style.background = "#dbeafe")}
                        onMouseLeave={(e) => (e.target.style.background = "#eff6ff")}
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
                    📭 No support request entries exist in the current system database context.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;