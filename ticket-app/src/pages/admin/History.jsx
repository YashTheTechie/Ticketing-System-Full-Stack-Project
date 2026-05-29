import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🔄 FETCH REAL HISTORICAL LOGS FROM BACKEND
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/api/tickets/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistoryData(res.data);
      } catch (err) {
        console.error("Error parsing resolution ledger:", err);
        setError(err.response?.data?.message || "Failed to load real-time history logs.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    } else {
      setError("Admin authentication token missing. Please log in again.");
      setLoading(false);
    }
  }, [token]);

  // 🔍 REAL-TIME FUZZY SEARCH (Filters by Ticket Number, Customer Name, or Issue Title)
  const filteredHistory = historyData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.ticketNumber?.toLowerCase().includes(search) ||
      item.user?.name?.toLowerCase().includes(search) ||
      item.title?.toLowerCase().includes(search)
    );
  });

  // 📅 EXTRACT EXPLICIT TIMELINE DATES FOR RESOLUTION
  const getResolutionDate = (ticket) => {
    if (!ticket.timeline || ticket.timeline.length === 0) return ticket.updatedAt;
    // Look for the timeline entry where status became resolved
    const resolvedEntry = [...ticket.timeline]
      .reverse()
      .find((entry) => entry.message?.toLowerCase().includes("resolved"));
    return resolvedEntry ? resolvedEntry.time : ticket.updatedAt;
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔄</div>
          <div>Loading resolution architecture logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "2.5rem 2rem", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* HEADER BLOCK */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
            Resolution History Ledger
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>
            Audit settled support infrastructure records, verified close-out metrics, and resolution schedules.
          </p>
        </div>

        {/* SEARCH & COUNTER LAYOUTBAR */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search by Ticket ID, Customer Name, or Issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", maxWidth: "460px", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "15px", outline: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "border 0.2s" }}
          />
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e3a8a", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 18px", borderRadius: "10px" }}>
            Total Resolved Items: {filteredHistory.length}
          </div>
        </div>

        {/* ERROR STATUS CARD */}
        {error && (
          <div style={{ padding: "14px 18px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#ef4444", fontSize: "14px", marginBottom: "1.5rem" }}>
            ⚠️ {error}
          </div>
        )}

        {/* DATA CONTAINER TABLE */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)", overflow: "hidden" }}>
          {filteredHistory.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "16px 20px", fontWeight: "600", color: "#475569", width: "130px" }}>Ticket ID</th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", color: "#475569", width: "180px" }}>Customer</th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", color: "#475569" }}>Core Issue Description</th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", color: "#475569", width: "140px" }}>Raised Date</th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", color: "#475569", width: "140px" }}>Resolved Date</th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", color: "#475569", width: "110px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      
                      {/* TICKET NUMBER (INTERACTIVE LINK TO DETAIL WORKSPACE) */}
                      <td style={{ padding: "18px 20px" }}>
                        <Link
                          to={`/admin/ticket/${item._id}`}
                          style={{
                            fontFamily: "monospace",
                            fontWeight: "700",
                            color: "#2563eb",
                            fontSize: "13px",
                            textDecoration: "none",
                            borderBottom: "1px dashed transparent",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            display: "inline-block"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = "#1d4ed8";
                            e.target.style.borderBottomColor = "#1d4ed8";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "#2563eb";
                            e.target.style.borderBottomColor = "transparent";
                          }}
                        >
                          {item.ticketNumber}
                        </Link>
                      </td>
                      
                      {/* USER NAME & EMAIL */}
                      <td style={{ padding: "18px 20px" }}>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{item.user?.name || "N/A"}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{item.user?.email || "N/A"}</div>
                      </td>
                      
                      {/* ISSUE TITLE & CATEGORY */}
                      <td style={{ padding: "18px 20px" }}>
                        <div style={{ fontWeight: "600", color: "#334155" }}>{item.title}</div>
                        <span style={{ display: "inline-block", fontSize: "11px", fontWeight: "500", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "4px", marginTop: "6px" }}>
                          {item.category || "General"}
                        </span>
                      </td>
                      
                      {/* CREATION STAMP */}
                      <td style={{ padding: "18px 20px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      
                      {/* RESOLUTION STAMP */}
                      <td style={{ padding: "18px 20px", color: "#16a34a", fontWeight: "600", whiteSpace: "nowrap" }}>
                        {new Date(getResolutionDate(item)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      
                      {/* STATUS BADGE */}
                      <td style={{ padding: "18px 20px" }}>
                        <span style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", display: "inline-block", textAlign: "center" }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#94a3b8", fontSize: "15px" }}>
              📭 No verified resolution history records match your search criteria.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default History;