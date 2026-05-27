import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  History,
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
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

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

        /* Avatar */
        .admin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <nav className="admin-navbar">

        {/* Logo */}
        <NavLink to="/admin/dashboard" className="admin-logo">

          <div className="admin-logo-icon">
            A
          </div>

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

        {/* Avatar */}
        <div className="admin-avatar">
          AD
        </div>

      </nav>
    </>
  );
}