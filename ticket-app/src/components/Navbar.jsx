import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  History,
  Mail,
  UserCheck,
  LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",   to: "/",                    icon: LayoutDashboard },
  { label: "My Tickets",  to: "/client/my-tickets",    icon: Ticket          },
  { label: "Raise Issue", to: "/client/raise-issue",   icon: PlusCircle      },
  { label: "History",     to: "/client/history",       icon: History         },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [user, setUser] = useState({
    name: "Yash Kamble",
    email: "yash@company.com",
    role: "user"
  });

  // ⚡ Extract active profile session variables securely from database tokens
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback checks if you stored them as single string keys instead of an object
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");
        if (name || email) {
          setUser({
            name: name || "Yash Kamble",
            email: email || "yash@company.com",
            role: role || "user"
          });
        }
      }
    } catch (err) {
      console.error("Failed to parse local profile session data:", err);
    }
  }, []);

  // 🔠 Initials Generator Logic (e.g., "Yash Kamble" -> "YK")
  const getInitials = (fullName) => {
    if (!fullName) return "??";
    const names = fullName.trim().split(" ");
    return names.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // 🔒 Clear Token and Bounce Backward on Sign Out
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .sd-navbar {
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

        /* ── Logo ── */
        .sd-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .sd-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sd-logo-icon svg {
          width: 20px;
          height: 20px;
          stroke: #fff;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .sd-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .sd-logo-text span {
          color: #2563eb;
        }

        /* ── Nav links ── */
        .sd-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .sd-nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .sd-nav-link svg {
          width: 17px;
          height: 17px;
          flex-shrink: 0;
          stroke-width: 1.75;
        }
        .sd-nav-link:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .sd-nav-link.active {
          background: #eff6ff;
          color: #2563eb;
        }
        .sd-nav-link.active svg {
          stroke: #2563eb;
        }

        /* ── Raise Issue CTA pill (last item) ── */
        .sd-nav-link.raise-cta {
          background: #2563eb;
          color: #fff;
          padding: 8px 16px;
        }
        .sd-nav-link.raise-cta svg {
          stroke: #fff;
        }
        .sd-nav-link.raise-cta:hover {
          background: #1d4ed8;
          color: #fff;
        }
        .sd-nav-link.raise-cta.active {
          background: #1d4ed8;
          color: #fff;
        }

        /* ── Avatar Wrapper & Tooltip ── */
        .sd-avatar-container {
          position: relative;
        }
        .sd-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
          user-select: none;
          box-shadow: 0 2px 4px rgba(37,99,235,0.15);
          transition: transform 0.15s ease;
        }
        .sd-avatar:hover {
          transform: scale(1.04);
        }
        
        .sd-profile-card {
          position: absolute;
          right: 0;
          top: 48px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          width: 250px;
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

      <nav className="sd-navbar">

        {/* Left — Logo */}
        <NavLink to="/" className="sd-logo">
          <div className="sd-logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M3 11a9 9 0 0118 0" />
              <path d="M3 11v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              <path d="M18 9a2 2 0 00-2 2v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <span className="sd-logo-text">
            Support<span>Desk</span>
          </span>
        </NavLink>

        {/* Center — Nav links */}
        <ul className="sd-nav-links">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `sd-nav-link${label === "Raise Issue" ? " raise-cta" : ""}${isActive ? " active" : ""}`
                }
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right — Avatar Module with Hover Profile Card */}
        <div 
          className="sd-avatar-container"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Circular Dynamic Initials Badge */}
          <div className="sd-avatar">
            {getInitials(user.name)}
          </div>

          {/* Hover Menu Overlay Card */}
          {showTooltip && (
            <div className="sd-profile-card">
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Active Profile Session
              </div>
              
              {/* Full Display Name */}
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px", lineHeight: "1.2" }}>
                {user.name}
              </div>

              {/* Account Role Subtext */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                <UserCheck size={13} strokeWidth={2.5} style={{ color: "#10b981" }} />
                <span style={{ textTransform: "capitalize", fontWeight: "600" }}>
                  {user.role === "user" ? "Employee / Client" : user.role}
                </span>
              </div>

              <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "12px" }} />

              {/* User Communication Handle */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569", marginBottom: "14px" }}>
                <Mail size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                <span style={{ wordBreak: "break-all", fontFamily: "monospace" }}>{user.email}</span>
              </div>

              {/* Destructive Sign Out Trigger */}
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