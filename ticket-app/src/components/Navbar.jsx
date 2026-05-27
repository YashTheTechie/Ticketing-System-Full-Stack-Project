import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  History,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",   to: "/",                     icon: LayoutDashboard },
  { label: "My Tickets",  to: "/client/my-tickets",    icon: Ticket          },
  { label: "Raise Issue", to: "/client/raise-issue",   icon: PlusCircle      },
  { label: "History",     to: "/client/history",       icon: History         },
];

export default function Navbar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

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

        /* ── Right-side avatar ── */
        .sd-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
        }
      `}</style>

      <nav className="sd-navbar">

        {/* Left — Logo */}
        <NavLink to="/" className="sd-logo">
          <div className="sd-logo-icon">
            {/* Headset icon inline SVG */}
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

        {/* Right — Avatar */}
        <div className="sd-avatar">RK</div>

      </nav>
    </>
  );
}