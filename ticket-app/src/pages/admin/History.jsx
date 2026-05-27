import React, { useState } from "react";

function History() {

  const [searchTerm, setSearchTerm] = useState("");

  const historyData = [
    {
      id: "TKT-001",
      customer: "Rahul Sharma",
      issue: "VPN not connecting",
      action: "Ticket Closed",
      updatedBy: "Admin",
      date: "26 May 2026",
      status: "Closed",
    },

    {
      id: "TKT-002",
      customer: "Priya Mehta",
      issue: "Outlook sync issue",
      action: "Status Updated",
      updatedBy: "Support Team",
      date: "25 May 2026",
      status: "In Progress",
    },

    {
      id: "TKT-003",
      customer: "Amit Verma",
      issue: "Laptop overheating",
      action: "Admin Note Added",
      updatedBy: "Admin",
      date: "24 May 2026",
      status: "Open",
    },

    {
      id: "TKT-004",
      customer: "Sneha Patil",
      issue: "Portal login failed",
      action: "Ticket Resolved",
      updatedBy: "Support Team",
      date: "23 May 2026",
      status: "Closed",
    },
  ];

  const filteredHistory = historyData.filter((item) =>

    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.issue.toLowerCase().includes(searchTerm.toLowerCase())

  );

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
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            fontSize: "36px",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Ticket History
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          Monitor ticket updates, status changes and admin activities.
        </p>

      </div>

      {/* Search */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <input
          type="text"
          placeholder="Search by ticket ID, customer or issue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            outline: "none",
          }}
        />

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
          <h3>Total Activities</h3>
          <h1 style={{ color: "#2563eb" }}>
            {historyData.length}
          </h1>
        </div>

        <div
          style={{
            background: "#dcfce7",
            padding: "22px",
            borderRadius: "18px",
          }}
        >
          <h3>Resolved Tickets</h3>
          <h1 style={{ color: "#16a34a" }}>
            {
              historyData.filter((item) => item.status === "Closed").length
            }
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
            {
              historyData.filter(
                (item) => item.status === "In Progress"
              ).length
            }
          </h1>
        </div>

      </div>

      {/* Activity Timeline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >

        {filteredHistory.map((item, index) => (

          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >

              {/* Left */}
              <div>

                <h2
                  style={{
                    color: "#2563eb",
                    marginBottom: "10px",
                  }}
                >
                  {item.id}
                </h2>

                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#111827",
                  }}
                >
                  {item.issue}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Customer: {item.customer}
                </p>

                <p
                  style={{
                    color: "#374151",
                  }}
                >
                  {item.action} by {item.updatedBy}
                </p>

              </div>

              {/* Right */}
              <div
                style={{
                  textAlign: "right",
                }}
              >

                <span
                  style={{
                    padding: "8px 16px",
                    borderRadius: "30px",

                    background:
                      item.status === "Closed"
                        ? "#dcfce7"
                        : item.status === "In Progress"
                        ? "#ede9fe"
                        : "#fef3c7",

                    color:
                      item.status === "Closed"
                        ? "#16a34a"
                        : item.status === "In Progress"
                        ? "#7c3aed"
                        : "#d97706",
                  }}
                >
                  {item.status}
                </span>

                <p
                  style={{
                    marginTop: "15px",
                    color: "#6b7280",
                  }}
                >
                  {item.date}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default History;