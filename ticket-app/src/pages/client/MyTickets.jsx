import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styles defined at the top to prevent layout breaking/undefined issues
const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: "12px",
  color: "#64748b",
};

const tdStyle = {
  padding: "12px",
  fontSize: "13px",
  color: "#0f172a",
};

const tdMonoStyle = {
  padding: "12px",
  fontSize: "13px",
  fontFamily: "monospace",
  color: "#2563eb",
};

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

export default function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/tickets/my-tickets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache", // Force browser to bypass historical data caches
            },
          }
        );

        if (Array.isArray(res.data)) {
          setTickets(res.data);
        } else {
          setTickets([]);
          console.error("Backend response is not an array format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(err.response?.data?.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter logic
  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        Loading tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              My Tickets
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
              View and track your submitted issues
            </p>
          </div>

          <button
            onClick={() => navigate("/client/raise-issue")}
            style={{
              padding: "10px 16px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Raise Issue
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              outline: "none"
            }}
          />

          {["All", "Open", "In Progress", "Resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: statusFilter === s ? "#eff6ff" : "#fff",
                color: statusFilter === s ? "#2563eb" : "#64748b",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "1.5rem", fontSize: "14px", color: "#64748b" }}>
          <div><strong>Total:</strong> {tickets.length}</div>
          <div><strong>Open:</strong> {tickets.filter(t => t.status === "Open").length}</div>
          <div><strong>In Progress:</strong> {tickets.filter(t => t.status === "In Progress").length}</div>
          <div><strong>Resolved:</strong> {tickets.filter(t => t.status === "Resolved").length}</div>
        </div>

        {/* Table layout container */}
        <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflowX: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
              No tickets found
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={thStyle}>Ticket</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t) => {
                  const currentPriority = t.priority || "Medium";
                  const currentStatus = t.status || "Open";

                  return (
                    <tr key={t._id || Math.random()} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={tdMonoStyle}>{t.ticketNumber || "N/A"}</td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: "500" }}>{t.title || "Untitled Issue"}</div>
                      </td>
                      <td style={tdStyle}>{t.category || "General"}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500",
                          ...(priorityStyle[currentPriority] || priorityStyle["Medium"])
                        }}>
                          {currentPriority}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: `1px solid ${(statusStyle[currentStatus]?.border || "#e2e8f0")}`,
                          background: (statusStyle[currentStatus]?.bg || "#f8fafc"),
                          color: (statusStyle[currentStatus]?.color || "#64748b"),
                        }}>
                          {currentStatus}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => navigate(`/client/ticket/${t._id}`)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #bfdbfe",
                            background: "#eff6ff",
                            color: "#2563eb",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}