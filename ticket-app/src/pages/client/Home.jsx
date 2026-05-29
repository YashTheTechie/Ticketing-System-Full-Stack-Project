import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Category items matched exactly to your form's select values
const CORE_SERVICES = [
  { 
    label: "Network / Internet", 
    icon: "🌐", 
    desc: "Wi-Fi dropouts, slow connection speeds, or local area network errors.",
    gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  },
  { 
    label: "Hardware", 
    icon: "💻", 
    desc: "Laptop freezes, desktop physical diagnostics, peripheral failures & upgrades.",
    gradient: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
  },
  { 
    label: "Software / Application", 
    icon: "🚀", 
    desc: "System installations, crashing applications & enterprise licensing patches.",
    gradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  },
  { 
    label: "Email / Outlook", 
    icon: "📧", 
    desc: "Mailbox synchronization errors, profile missing, & cloud storage limits.",
    gradient: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
  },
  { 
    label: "VPN / Remote Access", 
    icon: "🖥️", 
    desc: "Secure corporate network authentication, AnyDesk, RDP & MFA lockouts.",
    gradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
  },
  { 
    label: "Printer / Scanner", 
    icon: "🖨️", 
    desc: "Spooler queue overrides, offline issues & document configuration paths.",
    gradient: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)", paddingBottom: "4rem" }}>

      {/* 1. HERO SECTION */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        padding: "5rem 2rem",
        textAlign: "center",
        color: "#fff",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.15)", borderRadius: "20px",
          padding: "6px 16px", fontSize: "13px", fontWeight: "500",
          marginBottom: "1.5rem",
        }}>
          🎧 IT Support Portal
        </div>

        <h1 style={{ fontSize: "42px", fontWeight: "700", margin: "0 0 1rem 0", lineHeight: "1.2", letterSpacing: "-0.02em" }}>
          Having a Tech Issue?
          <br />
          <span style={{ color: "#bfdbfe" }}>We're Here to Help!</span>
        </h1>

        <p style={{ fontSize: "16px", color: "#bfdbfe", marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem auto", lineHeight: "1.7" }}>
          Raise a support ticket and our IT team will get back to you as quickly as possible.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/client/raise-issue")}
            style={{ padding: "12px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: "600", background: "#fff", color: "#2563eb", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
          >
            + Raise a Ticket
          </button>
          <button
            onClick={() => navigate("/client/my-tickets")}
            style={{ padding: "12px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: "600", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}
          >
            View My Tickets
          </button>
        </div>
      </div>

      {/* 2. HIGH-QUALITY STABLE 3x2 SERVICE SCOPES GRID */}
      <div style={{ maxWidth: "1100px", margin: "-2rem auto 4rem auto", padding: "0 2rem", position: "relative", zIndex: 10 }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "24px" 
        }}>
          {CORE_SERVICES.map((item, idx) => (
            <div
              key={idx}
              // 🌟 Passes the precise category string forward to automatically select it on the next page
              onClick={() => navigate("/client/raise-issue", { state: { selectedCategory: item.label } })}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                cursor: "pointer",
                userSelect: "none",
                boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.02), 0 2px 4px -1px rgba(15, 23, 42, 0.01)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(37,99,235,0.08), 0 10px 10px -5px rgba(37,99,235,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(15, 23, 42, 0.02), 0 2px 4px -1px rgba(15, 23, 42, 0.01)";
              }}
            >
              {/* Decorative Backdrop Area */}
              <div style={{ 
                background: item.gradient, 
                width: "60px", 
                height: "60px", 
                borderRadius: "14px", 
                display: "flex", 
                alignItems: "center", 
                justify: "center",
                fontSize: "30px"
              }}>
                {item.icon}
              </div>

              {/* Text Context Area */}
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.01em" }}>
                  {item.label}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
                  {item.desc}
                </p>
              </div>

              {/* Clean Action Label */}
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>
                Report Issue <span style={{ transition: "transform 0.2s" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HOW IT WORKS */}
      <div style={{ padding: "2rem 2rem 4rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem" }}>
          How It Works
        </h2>
        <p style={{ textAlign: "center", fontSize: "15px", color: "#64748b", marginBottom: "3rem" }}>
          3 simple steps to get your issue resolved
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {[
            { step: "01", title: "Raise a Ticket", desc: "Fill in your details and describe your IT issue clearly.", icon: "📝" },
            { step: "02", title: "Team Reviews",   desc: "Our IT team picks up your ticket and starts working on it.", icon: "🔍" },
            { step: "03", title: "Issue Resolved", desc: "Get notified once your issue is resolved with full notes.", icon: "✅" },
          ].map((item) => (
            <div key={item.step} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.75rem", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
              <div style={{ display: "inline-block", fontSize: "11px", fontWeight: "700", color: "#2563eb", background: "#eff6ff", padding: "4px 12px", borderRadius: "20px", marginBottom: "12px" }}>
                STEP {item.step}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: "0 0 8px 0" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. QUICK STATS BAR */}
      <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "2.5rem 2rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", textAlign: "center" }}>
          {[
            { value: "< 1hr",  label: "Avg First Response" },
            { value: "98%",    label: "Issues Resolved"    },
            { value: "24/7",   label: "Support Available"  },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#2563eb", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px", fontWeight: "500" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CTA BOTTOM BANNER */}
      <div style={{ textAlign: "center", padding: "5rem 2rem 2rem 2rem" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem" }}>
          Ready to get help?
        </h2>
        <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "1.75rem" }}>
          Raise a ticket now and our team will be in touch shortly.
        </p>
        <button
          onClick={() => navigate("/client/raise-issue")}
          style={{ padding: "14px 32px", borderRadius: "8px", fontSize: "15px", fontWeight: "600", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 10px rgba(37,99,235,0.2)", transition: "background 0.2s" }}
          onMouseEnter={(e) => e.target.style.background = "#1d4ed8"}
          onMouseLeave={(e) => e.target.style.background = "#2563eb"}
        >
          + Raise a Ticket
        </button>
      </div>

    </div>
  );
}