import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  History,
  Mail,
  ShieldCheck,
  LogOut
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "All Tickets",
    to: "/admin/all-tickets",
    icon: Ticket,
  },
  {
    label: "History",
    to: "/admin/history",
    icon: History,
  },
];

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [adminUser, setAdminUser] = useState({
    name: "Admin User",
    email: "champyash21@gmail.com",
    role: "admin"
  });

  // ⚡ Load real administrative profile variables straight out of session memory
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setAdminUser(JSON.parse(storedUser));
      } else {
        // Alternative single-string backup parameters check
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");
        if (name || email) {
          setAdminUser({
            name: name || "Admin User",
            email: email || "champyash21@gmail.com",
            role: role || "admin"
          });
        }
      }
    } catch (err) {
      console.error("Failed to sync active admin schema structures:", err);
    }
  }, []);

  // 🔠 Initials Generator Logic (e.g., "Yash Kamble" -> "YK")
  const getInitials = (fullName) => {
    if (!fullName) return "AD";
    const names = fullName.trim().split(" ");
    return names.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // 🔒 Master Clear Session Token dispatch route
  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminlogin");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .admin-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e8edf5;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        /* Logo */
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .admin-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        .admin-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .admin-logo-text span {
          color: #2563eb;
        }

        /* Nav Links */
        .admin-nav-links {
          display: flex;
          align-items: center;
          gap: 5px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          transition: 0.2s;
        }

        .admin-nav-link:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .admin-nav-link.active {
          background: #eff6ff;
          color: #2563eb;
        }

        /* ── Avatar Wrapper Frame Styles ── */
        .admin-avatar-wrapper {
          position: relative;
        }

        .admin-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          box-shadow: 0 2px 4px rgba(37,99,235,0.15);
          transition: transform 0.15s ease;
        }
        .admin-avatar:hover {
          transform: scale(1.04);
        }

        .admin-profile-card {
          position: absolute;
          right: 0;
          top: 48px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          width: 260px;
          z-index: 100;
          box-shadow: 0 10px 25px -5px rgba(15,23,42,0.1), 0 8px 10px -6px rgba(15,23,42,0.05);
          text-align: left;
          animation: slideDownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <nav className="admin-navbar">
        {/* Logo */}
        <NavLink to="/admin/dashboard" className="admin-logo">
          <div className="admin-logo-icon">A</div>
          <span className="admin-logo-text">
            Admin<span>Desk</span>
          </span>
        </NavLink>

        {/* Nav Items */}
        <ul className="admin-nav-links">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 🌟 UPGRADED: Right Avatar Module with Dynamic Hover Profile Card */}
        <div 
          className="admin-avatar-wrapper"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Circular Dynamic Initials Shield Badge */}
          <div className="admin-avatar">
            {getInitials(adminUser.name)}
          </div>

          {/* Hover Menu Overlay Dashboard Card */}
          {showTooltip && (
            <div className="admin-profile-card">
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                System Administrator
              </div>

              {/* Master Full Name */}
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px", lineHeight: "1.2" }}>
                {adminUser.name}
              </div>

              {/* Security Level Indicator Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#475569", marginBottom: "12px" }}>
                <ShieldCheck size={14} strokeWidth={2.5} style={{ color: "#2563eb" }} />
                <span style={{ fontWeight: "700", color: "#2563eb", textTransform: "uppercase", fontSize: "11px" }}>
                  Root Support Admin
                </span>
              </div>

              <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "12px" }} />

              {/* Admin Registered Communications Handle */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569", marginBottom: "14px" }}>
                <Mail size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <span style={{ wordBreak: "break-all", fontFamily: "monospace" }}>{adminUser.email}</span>
              </div>

              {/* Sign Out Trigger Action Button */}
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justify: "center",
                  gap: "6px",
                  padding: "8px 0",
                  background: "#fef2f2",
                  color: "#ef4444",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
              >
                <LogOut size={13} />
                Sign Out Session
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}