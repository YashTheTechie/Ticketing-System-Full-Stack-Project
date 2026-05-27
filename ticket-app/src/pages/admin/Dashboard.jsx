import React from "react";

function Dashboard() {
  const stats = [
    {
      title: "Total Tickets",
      count: 124,
      color: "#dbeafe",
      textColor: "#2563eb",
    },
    {
      title: "Open",
      count: 32,
      color: "#fef3c7",
      textColor: "#d97706",
    },
    {
      title: "In Progress",
      count: 18,
      color: "#ede9fe",
      textColor: "#7c3aed",
    },
    {
      title: "Closed",
      count: 74,
      color: "#dcfce7",
      textColor: "#16a34a",
    },
  ];

  const recentTickets = [
    {
      id: "TKT-001",
      customer: "Rahul Sharma",
      issue: "VPN not connecting",
      status: "Open",
      date: "26 May 2026",
    },
    {
      id: "TKT-002",
      customer: "Priya Mehta",
      issue: "Outlook sync issue",
      status: "In Progress",
      date: "25 May 2026",
    },
    {
      id: "TKT-003",
      customer: "Amit Verma",
      issue: "Laptop overheating",
      status: "Closed",
      date: "24 May 2026",
    },
  ];

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
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Admin Dashboard
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          Manage all support tickets and monitor system activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              background: item.color,
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#374151",
              }}
            >
              {item.title}
            </h2>

            <h1
              style={{
                fontSize: "40px",
                color: item.textColor,
              }}
            >
              {item.count}
            </h1>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Recent Tickets
          </h2>

          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <th style={{ padding: "15px" }}>Ticket ID</th>
              <th style={{ padding: "15px" }}>Customer</th>
              <th style={{ padding: "15px" }}>Issue</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Date</th>
            </tr>
          </thead>

          <tbody>
            {recentTickets.map((ticket, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <td style={{ padding: "15px", color: "#2563eb" }}>
                  {ticket.id}
                </td>

                <td style={{ padding: "15px" }}>{ticket.customer}</td>

                <td style={{ padding: "15px" }}>{ticket.issue}</td>

                <td style={{ padding: "15px" }}>
                  <span
                    style={{
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

                      padding: "8px 14px",
                      borderRadius: "30px",
                      fontSize: "14px",
                    }}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td style={{ padding: "15px" }}>{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;