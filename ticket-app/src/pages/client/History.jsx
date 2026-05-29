import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const priorityStyle = {
  High: { color: "#ef4444", bg: "#fef2f2" },
  Medium: { color: "#f59e0b", bg: "#fffbeb" },
  Low: { color: "#22c55e", bg: "#f0fdf4" },
};

export default function ClientHistory() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📄 Pagination States (5 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  // 🔄 FETCH LOGGED-IN USER'S RESOLVED TICKETS
  useEffect(() => {
    const fetchMyHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Hits your endpoint that retrieves the logged-in user's tickets
        const res = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🛡️ Filter for ONLY "Resolved" tickets belonging to this specific client
        const resolvedOnly = res.data.filter((t) => t.status === "Resolved");
        setTickets(resolvedOnly);
      } catch (err) {
        console.error("Error loading client history ledger:", err);
        setError(err.response?.data?.message || "Failed to load your resolution history.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyHistory();
    } else {
      setError("Authentication session missing. Please log in again.");
      setLoading(false);
    }
  }, [token]);

  // 🔍 FUZZY SEARCH FILTERING
  const filtered = tickets.filter((t) =>
    t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  // 🎛️ PAGINATION CALCULATION (Slices data into chunks of 5)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Reset page position if search alters indices length
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // 📅 EXTRACT RESOLUTION TIME FROM TIMELINE
  const getResolutionDate = (ticket) => {
    if (!ticket.timeline || ticket.timeline.length === 0) return ticket.updatedAt;
    const resolvedEntry = [...ticket.timeline]
      .reverse()
      .find((entry) => entry.message?.toLowerCase().includes("resolved"));
    return resolvedEntry ? resolvedEntry.time : ticket.updatedAt;
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", background: "#f8fafc" }}>
        Syncing your closed resolution archive...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
              Ticket History
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              All your resolved and closed support requests.
            </p>
          </div>
          <button
            onClick={() => navigate("/client/raise-issue")}
            style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => e.target.style.background = "#1d4ed8"}
            onMouseLeave={(e) => e.target.style.background = "#2563eb"}
          >
            + Raise New Issue
          </button>
        </div>

        {/* ERROR STATUS INFOBAR */}
        {error && (
          <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#ef4444", fontSize: "14px", marginBottom: "1.5rem" }}>
            ⚠️ {error}
          </div>
        )}

        {/* SUMMARY CARD STATUS */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "24px" }}>✅</span>
          <div>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#16a34a", margin: 0 }}>
              {tickets.length} Tickets Resolved
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              All requests listed here have been completed and verified by technical teams.
            </p>
          </div>
        </div>

        {/* SEARCH BAR INPUT */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#94a3b8" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, title or category..."
            style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#0f172a", background: "#fff", boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {/* TICKETS TIMELINE GRID */}
        {currentItems.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>No matching records found</p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Try altering your index filtering text</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentItems.map((ticket) => (
              <div
                key={ticket._id}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem 1.5rem", borderLeft: "4px solid #22c55e", position: "relative" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      
                      {/* TICKET ID (INTERACTIVE TEXT LINK) */}
                      <Link
                        to={`/client/ticket/${ticket._id}`}
                        style={{ fontSize: "13px", fontWeight: "700", color: "#2563eb", fontFamily: "monospace", textDecoration: "none" }}
                        onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                      >
                        {ticket.ticketNumber}
                      </Link>

                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", color: priorityStyle[ticket.priority]?.color, background: priorityStyle[ticket.priority]?.bg }}>
                        {ticket.priority}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", color: "#16a34a", background: "#dcfce7", border: "1px solid #bbf7d0" }}>
                        ✓ Resolved
                      </span>
                    </div>

                    {/* TICKET TITLE (INTERACTIVE LINK) */}
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px 0" }}>
                      <Link
                        to={`/client/ticket/${ticket._id}`}
                        style={{ color: "#0f172a", textDecoration: "none" }}
                        onMouseEnter={(e) => e.target.style.color = "#2563eb"}
                        onMouseLeave={(e) => e.target.style.color = "#0f172a"}
                      >
                        {ticket.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                      {ticket.category} · Resolved on {new Date(getResolutionDate(ticket)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* RESOLUTION AUDIT BOX */}
                {ticket.notes && ticket.notes.length > 0 && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px", marginTop: "4px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "#475569", margin: "0 0 4px 0" }}>
                      ⚙️ Resolution Note
                    </p>
                    <p style={{ fontSize: "13px", color: "#334155", margin: 0 }}>
                      {ticket.notes[ticket.notes.length - 1].text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 🎛️ PAGINATION LAYOUTBAR */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "2rem" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: currentPage === 1 ? "#f1f5f9" : "#fff", color: currentPage === 1 ? "#94a3b8" : "#475569", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600" }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: "14px", color: "#475569", fontWeight: "600" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: currentPage === totalPages ? "#f1f5f9" : "#fff", color: currentPage === totalPages ? "#94a3b8" : "#475569", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600" }}
            >
              Next →
            </button>
          </div>
        )}

        {/* RESULT COUNT */}
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "1.5rem", textAlign: "right" }}>
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filtered.length)} of {filtered.length} resolved entries
        </p>

      </div>
    </div>
  );
}