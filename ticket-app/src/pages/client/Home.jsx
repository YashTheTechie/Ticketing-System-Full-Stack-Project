import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "calc(100vh - 64px)" }}>

      {/* Hero Section */}
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

        <h1 style={{
          fontSize: "42px", fontWeight: "700", margin: "0 0 1rem 0",
          lineHeight: "1.2", letterSpacing: "-0.02em",
        }}>
          Having a Tech Issue?
          <br />
          <span style={{ color: "#bfdbfe" }}>We're Here to Help!</span>
        </h1>

        <p style={{
          fontSize: "16px", color: "#bfdbfe", marginBottom: "2rem",
          maxWidth: "480px", margin: "0 auto 2rem auto", lineHeight: "1.7",
        }}>
          Raise a support ticket and our IT team will get back to you as quickly as possible.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/client/raise-issue")}
            style={{
              padding: "12px 28px", borderRadius: "8px", fontSize: "15px",
              fontWeight: "600", background: "#fff", color: "#2563eb",
              border: "none", cursor: "pointer",
            }}
          >
            + Raise a Ticket
          </button>
          <button
            onClick={() => navigate("/client/my-tickets")}
            style={{
              padding: "12px 28px", borderRadius: "8px", fontSize: "15px",
              fontWeight: "600", background: "rgba(255,255,255,0.15)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}
          >
            View My Tickets
          </button>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "4rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem" }}>
          How It Works
        </h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginBottom: "3rem" }}>
          3 simple steps to get your issue resolved
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            { step: "01", title: "Raise a Ticket", desc: "Fill in your details and describe your IT issue clearly.", icon: "📝" },
            { step: "02", title: "Team Reviews",   desc: "Our IT team picks up your ticket and starts working on it.", icon: "🔍" },
            { step: "03", title: "Issue Resolved", desc: "Get notified once your issue is resolved with full notes.", icon: "✅" },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: "12px", padding: "1.5rem", textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
              <div style={{
                display: "inline-block", fontSize: "11px", fontWeight: "700",
                color: "#2563eb", background: "#eff6ff", padding: "3px 10px",
                borderRadius: "20px", marginBottom: "10px",
              }}>
                STEP {item.step}
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 8px 0" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "2rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", textAlign: "center" }}>
          {[
            { value: "< 1hr",  label: "Avg First Response" },
            { value: "98%",    label: "Issues Resolved"    },
            { value: "24/7",   label: "Support Available"  },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#2563eb" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem" }}>
          Ready to get help?
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" }}>
          Raise a ticket now and our team will be in touch shortly.
        </p>
        <button
          onClick={() => navigate("/client/raise-issue")}
          style={{
            padding: "12px 28px", borderRadius: "8px", fontSize: "15px",
            fontWeight: "600", background: "#2563eb", color: "#fff",
            border: "none", cursor: "pointer",
          }}
        >
          + Raise a Ticket
        </button>
      </div>

    </div>
  );
}