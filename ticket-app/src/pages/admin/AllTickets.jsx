import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Backend Base URL
const API_URL = "http://localhost:5000";

function AllTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // ─────────────────────────────────────────────────────────────
  // FETCH ALL TICKETS
  // ─────────────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Get admin token
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No admin token found. Please login again.");
      }

      // ✅ Fetch from backend
      const response = await fetch(
        `${API_URL}/api/tickets/admin/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Convert response to text first
      const text = await response.text();
      console.log("API RESPONSE:", text);

      // ✅ Handle auth errors
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }

      if (response.status === 403) {
        throw new Error("Admin access required.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch tickets (${response.status})`);
      }

      // ✅ Parse JSON safely
      const data = JSON.parse(text);

      // ✅ Normalize backend data
      const normalized = data.map((t) => ({
        id: t.ticketNumber || t._id,
        dbId: t._id, // 🌟 ADDED: Keeps raw Mongo ID safe for navigation routing parameters
        customer: t.user?.name || "Unknown",
        email: t.user?.email || "—",
        issue: t.title || "No subject",
        priority: t.priority || "Medium",
        status: t.status || "Open", // Pulls "Open", "In Progress", or "Resolved"
        date: t.createdAt
          ? new Date(t.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
      }));

      setTickets(normalized);
    } catch (err) {
      console.error("Ticket Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // LOAD ON PAGE OPEN
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ─────────────────────────────────────────────────────────────
  // FILTER TICKETS
  // ─────────────────────────────────────────────────────────────
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ─────────────────────────────────────────────────────────────
  // LOADING SCREEN
  // ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justify: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          Loading tickets...
        </p>

        <style>
          {`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ERROR SCREEN
  // ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justify: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px 40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            maxWidth: "420px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>

          <h2 style={{ color: "#111827", marginBottom: "8px" }}>
            Failed to load tickets
          </h2>

          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            {error}
          </p>

          <button
            onClick={fetchTickets}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN PAGE
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            All Tickets
          </h1>

          <p style={{ color: "#6b7280", fontSize: "18px" }}>
            Manage and monitor all support requests.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 20px",
            borderRadius: "12px",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
          }}
        >
          <option>All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option> {/* ✅ MATCHED: Swapped "Closed" for database literal "Resolved" */}
        </select>
      </div>

      {/* STATS PANELS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div style={{ background: "#dbeafe", padding: "22px", borderRadius: "18px" }}>
          <h3>Total Tickets</h3>
          <h1 style={{ color: "#2563eb" }}>{tickets.length}</h1>
        </div>

        <div style={{ background: "#fef3c7", padding: "22px", borderRadius: "18px" }}>
          <h3>Open</h3>
          <h1 style={{ color: "#d97706" }}>
            {tickets.filter((t) => t.status === "Open").length}
          </h1>
        </div>

        <div style={{ background: "#ede9fe", padding: "22px", borderRadius: "18px" }}>
          <h3>In Progress</h3>
          <h1 style={{ color: "#7c3aed" }}>
            {tickets.filter((t) => t.status === "In Progress").length}
          </h1>
        </div>

        <div style={{ background: "#dcfce7", padding: "22px", borderRadius: "18px" }}>
          <h3>Resolved</h3> {/* ✅ LABELED CONSISTENTLY */}
          <h1 style={{ color: "#16a34a" }}>
            {/* 🌟 FIX: Inspects database specific enum array properties correctly */}
            {tickets.filter((t) => t.status === "Resolved").length}
          </h1>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredTickets.length === 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎫</div>
          <p style={{ fontSize: "18px" }}>
            No tickets found matching your filters.
          </p>
        </div>
      )}

      {/* TABLE DATA GRID */}
      {filteredTickets.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th style={tableHead}>Ticket ID</th>
                <th style={tableHead}>Customer</th>
                <th style={tableHead}>Issue</th>
                <th style={tableHead}>Priority</th>
                <th style={tableHead}>Status</th>
                <th style={tableHead}>Date</th>
                <th style={tableHead}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket.id || index}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ ...tableCell, fontFamily: "monospace", fontWeight: "700", color: "#4b5563" }}>
                    {ticket.id}
                  </td>

                  <td style={tableCell}>
                    <div style={{ fontWeight: "600", color: "#111827" }}>{ticket.customer}</div>
                    <div style={{ color: "#6b7280", fontSize: "14px" }}>{ticket.email}</div>
                  </td>

                  <td style={{ ...tableCell, color: "#374151", fontWeight: "500" }}>
                    {ticket.issue}
                  </td>

                  <td style={tableCell}>
                    <span
                      style={{
                        padding: "7px 14px",
                        borderRadius: "30px",
                        fontSize: "13px",
                        fontWeight: "600",
                        background:
                          ticket.priority === "High"
                            ? "#fee2e2"
                            : ticket.priority === "Medium"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          ticket.priority === "High"
                            ? "#dc2626"
                            : ticket.priority === "Medium"
                            ? "#d97706"
                            : "#16a34a",
                      }}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td style={tableCell}>
                    <span
                      style={{
                        padding: "7px 14px",
                        borderRadius: "30px",
                        fontSize: "13px",
                        fontWeight: "600",
                        background:
                          ticket.status === "Open"
                            ? "#fef3c7"
                            : ticket.status === "Resolved"
                            ? "#dcfce7"
                            : "#ede9fe",
                        color:
                          ticket.status === "Open"
                            ? "#d97706"
                            : ticket.status === "Resolved"
                            ? "#16a34a"
                            : "#7c3aed",
                      }}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td style={{ ...tableCell, color: "#6b7280" }}>
                    {ticket.date}
                  </td>

                  {/* ✅ SAFED WORKSPACE VIEW INTERSECTION REDIRECT */}
                  <td style={tableCell}>
                    <button
                      onClick={() => navigate(`/admin/ticket/${ticket.dbId || ticket.id}`)}
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        border: "1px solid #bfdbfe",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#dbeafe")}
                      onMouseLeave={(e) => (e.target.style.background = "#eff6ff")}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHead = {
  padding: "18px",
  textAlign: "left",
  color: "#6b7280",
  fontWeight: "600",
};

const tableCell = {
  padding: "18px",
};

export default AllTickets;