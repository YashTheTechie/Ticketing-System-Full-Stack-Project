import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AllTickets() {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const tickets = [
    {
      id: "TKT-001",
      customer: "Rahul Sharma",
      email: "rahul@company.com",
      issue: "VPN not connecting",
      priority: "High",
      status: "Open",
      date: "26 May 2026",
    },

    {
      id: "TKT-002",
      customer: "Priya Mehta",
      email: "priya@company.com",
      issue: "Outlook sync issue",
      priority: "Medium",
      status: "In Progress",
      date: "25 May 2026",
    },

    {
      id: "TKT-003",
      customer: "Amit Verma",
      email: "amit@company.com",
      issue: "Laptop overheating",
      priority: "Low",
      status: "Closed",
      date: "24 May 2026",
    },

    {
      id: "TKT-004",
      customer: "Sneha Patil",
      email: "sneha@company.com",
      issue: "Cannot access portal",
      priority: "High",
      status: "Open",
      date: "23 May 2026",
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {

    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >

      {/* Header */}
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

          <p
            style={{
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            Manage and monitor all support requests.
          </p>
        </div>

        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          + Create Ticket
        </button>
      </div>

      {/* Search + Filter */}
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
          placeholder="Search by ticket ID, customer or issue..."
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
          <option>Closed</option>
        </select>

      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >

        <div
          style={{
            background: "#dbeafe",
            padding: "22px",
            borderRadius: "18px",
          }}
        >
          <h3>Total Tickets</h3>
          <h1 style={{ color: "#2563eb" }}>{tickets.length}</h1>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "22px",
            borderRadius: "18px",
          }}
        >
          <h3>Open</h3>
          <h1 style={{ color: "#d97706" }}>
            {tickets.filter((t) => t.status === "Open").length}
          </h1>
        </div>

        <div
          style={{
            background: "#ede9fe",
            padding: "22px",
            borderRadius: "18px",
          }}
        >
          <h3>In Progress</h3>
          <h1 style={{ color: "#7c3aed" }}>
            {tickets.filter((t) => t.status === "In Progress").length}
          </h1>
        </div>

        <div
          style={{
            background: "#dcfce7",
            padding: "22px",
            borderRadius: "18px",
          }}
        >
          <h3>Closed</h3>
          <h1 style={{ color: "#16a34a" }}>
            {tickets.filter((t) => t.status === "Closed").length}
          </h1>
        </div>

      </div>

      {/* Tickets Table */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflowX: "auto",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >

          <thead
            style={{
              background: "#f9fafb",
            }}
          >
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
                key={index}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                }}
              >

                <td style={tableCell}>{ticket.id}</td>

                <td style={tableCell}>
                  <div>{ticket.customer}</div>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    {ticket.email}
                  </div>
                </td>

                <td style={tableCell}>{ticket.issue}</td>

                <td style={tableCell}>

                  <span
                    style={{
                      padding: "7px 14px",
                      borderRadius: "30px",

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

                      background:
                        ticket.status === "Open"
                          ? "#fef3c7"
                          : ticket.status === "Closed"
                          ? "#dcfce7"
                          : "#ede9fe",

                      color:
                        ticket.status === "Open"
                          ? "#d97706"
                          : ticket.status === "Closed"
                          ? "#16a34a"
                          : "#7c3aed",
                    }}
                  >
                    {ticket.status}
                  </span>

                </td>

                <td style={tableCell}>{ticket.date}</td>

                <td style={tableCell}>

                  <button
                    onClick={() =>
                      navigate(`/admin/ticket/${ticket.id}`)
                    }
                    style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      border: "1px solid #bfdbfe",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    View →
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

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