import { useState, useEffect } from "react"
import AISafetyChat from "../components/AISafetyChat"
import IncidentReport from "../components/IncidentReport"
import SafetyScores from "../components/SafetyScores"
import GuwahatiMap from "../components/GuwahatiMap"
import LiveBackground from "../components/LiveBackground"
 
const NAV_ITEMS = [
  { name: "Dashboard", icon: "⚡" },
  { name: "Live Tracking", icon: "📍" },
  { name: "Safe Zones", icon: "🛡️" },
  { name: "AI Assistant", icon: "🤖" },
  { name: "Report", icon: "📢" },
  { name: "Emergency", icon: "🚨" },
]
 
const STATS = [
  { label: "Safety Score", value: "94%", sub: "↑ 12% today", accent: "#22c55e", glow: "rgba(34,197,94,0.15)" },
  { label: "Risk Alerts", value: "03", sub: "Active zones", accent: "#ef4444", glow: "rgba(239,68,68,0.15)" },
  { label: "Safe Zones", value: "18", sub: "AI verified", accent: "#3b82f6", glow: "rgba(59,130,246,0.15)" },
  { label: "Live Reports", value: "07", sub: "Community", accent: "#ec4899", glow: "rgba(236,72,153,0.15)" },
]
 
const ALERTS = [
  { msg: "Unsafe activity near Fancy Bazar alleys", level: "HIGH RISK", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  { msg: "Poor lighting on Lake Road after 9PM", level: "WARNING", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  { msg: "GS Road main corridor is clear", level: "SAFE ROUTE", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  { msg: "3 women sharing live trips now", level: "INFO", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
]
 
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [reports, setReports] = useState([])
  const [sosActive, setSosActive] = useState(false)
  const [tripSharing, setTripSharing] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }))
 
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })), 1000)
    return () => clearInterval(t)
  }, [])
 
  function handleSOS() {
    setSosActive(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        alert(`🚨 SOS ACTIVATED!\nLocation: https://maps.google.com/?q=${latitude},${longitude}\nGuwahati Police: 100 | Women Helpline: 1091`)
      }, () => alert("🚨 SOS ACTIVATED!\nGuwahati Police: 100 | Women Helpline: 1091"))
    }
    setTimeout(() => setSosActive(false), 5000)
  }
 
  function handleTripShare() {
    setTripSharing(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        if (navigator.share) navigator.share({ title: "SafeRoute Live Location", url })
        else { navigator.clipboard.writeText(url); alert("📍 Location copied to clipboard!") }
      })
    }
    setTimeout(() => setTripSharing(false), 3000)
  }
 
  const renderMain = () => {
    if (activeNav === "AI Assistant") return <div style={{ height: "calc(100vh - 160px)" }}><AISafetyChat /></div>
    if (activeNav === "Safe Zones") return <SafetyScores />
    if (activeNav === "Report") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <IncidentReport onReport={r => setReports(p => [r, ...p])} />
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Community Reports</h2>
          <p style={styles.cardSub}>Recent incidents reported by women in Guwahati</p>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
            {[
              { area: "Fancy Bazar", type: "Poor Lighting", time: "2h ago", color: "#f59e0b" },
              { area: "Paltan Bazaar", type: "Suspicious Activity", time: "4h ago", color: "#ef4444" },
              { area: "GS Road", type: "Safe Zone", time: "5h ago", color: "#22c55e" },
              { area: "Chandmari", type: "No Transport", time: "6h ago", color: "#3b82f6" },
              ...reports.map(r => ({ area: r.area, type: r.type, time: r.time, color: "#ec4899" }))
            ].map((r, i) => (
              <div key={i} style={{ background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 16, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{r.area}</p>
                  <p style={{ color: r.color, fontSize: 12, marginTop: 3 }}>{r.type}</p>
                </div>
                <span style={{ color: "#6b7280", fontSize: 12 }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
 
    if (activeNav === "Live Tracking") return (
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={styles.cardTitle}>Live Safety Map</h2>
            <p style={styles.cardSub}>Real-time Guwahati · OpenStreetMap · Click zones for info</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleTripShare} style={{ ...styles.btnSecondary, color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.1)" }}>
              {tripSharing ? "📍 Shared!" : "📍 Share Trip"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", padding: "8px 16px", borderRadius: 12 }}>
              <div style={{ width: 8, height: 8, background: "#ec4899", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></div>
              <span style={{ color: "#ec4899", fontSize: 13 }}>Live</span>
            </div>
          </div>
        </div>
        <div style={{ height: "calc(100vh - 320px)", minHeight: 480, borderRadius: 20, overflow: "hidden" }}>
          <GuwahatiMap />
        </div>
      </div>
    )
 
    if (activeNav === "Emergency") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(236,72,153,0.15))", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 28, padding: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🚨</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, fontFamily: "Syne, sans-serif" }}>Emergency SOS</h2>
          <p style={{ color: "#9ca3af", lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>Instantly alert your trusted contacts and share your live GPS location with Guwahati emergency services.</p>
          <button onClick={handleSOS} style={{
            width: "100%", padding: "20px", borderRadius: 20, fontWeight: 800, fontSize: 18,
            background: sosActive ? "#dc2626" : "linear-gradient(135deg, #ef4444, #ec4899)",
            color: "white", border: "none", cursor: "pointer",
            boxShadow: "0 0 30px rgba(239,68,68,0.4)",
            animation: sosActive ? "pulse 0.8s infinite" : "none",
            transition: "transform 0.2s",
          }}>
            {sosActive ? "🚨 SOS ACTIVATED — Alerting..." : "🚨 Activate Emergency SOS"}
          </button>
          <button onClick={handleTripShare} style={{ width: "100%", marginTop: 12, padding: "14px", borderRadius: 16, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#3b82f6", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            {tripSharing ? "📍 Location Shared!" : "📍 Share Live Location"}
          </button>
        </div>
        <div style={styles.card}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, fontFamily: "Syne, sans-serif" }}>Emergency Contacts · Guwahati</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Guwahati Police", number: "100", icon: "👮", color: "#3b82f6" },
              { name: "Women Helpline", number: "1091", icon: "👩", color: "#ec4899" },
              { name: "Assam Police Control", number: "0361-2237677", icon: "🚔", color: "#8b5cf6" },
              { name: "Ambulance", number: "108", icon: "🚑", color: "#ef4444" },
              { name: "Child Helpline", number: "1098", icon: "🆘", color: "#f59e0b" },
              { name: "National Emergency", number: "112", icon: "📞", color: "#22c55e" },
            ].map(c => (
              <a key={c.name} href={`tel:${c.number}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 18px", textDecoration: "none", color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</p>
                    <p style={{ color: c.color, fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{c.number}</p>
                  </div>
                </div>
                <span style={{ color: "#ec4899", fontSize: 12 }}>Call →</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
 
    // Main Dashboard
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: `linear-gradient(135deg, ${s.glow}, rgba(255,255,255,0.03))`, border: `1px solid ${s.accent}30`, borderRadius: 24, padding: "28px 24px", transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${s.glow}` }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
              <p style={{ color: "#9ca3af", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</p>
              <h1 style={{ fontSize: 52, fontWeight: 800, color: s.accent, marginTop: 12, fontFamily: "Syne, sans-serif", lineHeight: 1 }}>{s.value}</h1>
              <p style={{ color: s.accent, fontSize: 12, marginTop: 12, opacity: 0.8 }}>{s.sub}</p>
            </div>
          ))}
        </div>
 
        {/* Map + Alerts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
          {/* Map Card */}
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={styles.cardTitle}>AI Safety Map</h2>
                <p style={styles.cardSub}>Live Guwahati · Click zones for safety info</p>
              </div>
              <button onClick={() => setActiveNav("Live Tracking")} style={styles.btnOutline}>Full Map →</button>
            </div>
            <div style={{ height: 400, borderRadius: 20, overflow: "hidden" }}>
              <GuwahatiMap />
            </div>
          </div>
 
          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Alerts */}
            <div style={styles.card}>
              <h2 style={{ ...styles.cardTitle, marginBottom: 16 }}>Live AI Alerts</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ALERTS.map((a, i) => (
                  <div key={i} style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 16, padding: "12px 16px" }}>
                    <p style={{ color: a.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>{a.level}</p>
                    <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.5 }}>{a.msg}</p>
                  </div>
                ))}
              </div>
            </div>
 
            {/* AI Assistant shortcut */}
            <button onClick={() => setActiveNav("AI Assistant")} style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(168,85,247,0.1))", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 20, padding: "20px 22px", textAlign: "left", cursor: "pointer", color: "white", transition: "all 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(236,72,153,0.45)"}
              onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(236,72,153,0.2)"}>
              <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>Ask anything about route safety</p>
              <p style={{ fontWeight: 700, fontSize: 16, background: "linear-gradient(to right,#ec4899,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Syne, sans-serif" }}>Open AI Assistant →</p>
              <p style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>Powered by Claude AI</p>
            </button>
 
            {/* SOS */}
            <button onClick={handleSOS} style={{
              background: sosActive ? "#dc2626" : "linear-gradient(135deg, #ef4444, #ec4899)",
              border: "none", borderRadius: 20, padding: "18px", fontWeight: 800, fontSize: 16,
              color: "white", cursor: "pointer", boxShadow: "0 0 24px rgba(239,68,68,0.35)",
              animation: sosActive ? "pulse 0.8s infinite" : "none",
              transition: "opacity 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => !sosActive && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              🚨 {sosActive ? "SOS ACTIVATED..." : "Emergency SOS"}
            </button>
          </div>
        </div>
      </div>
    )
  }
 
  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "white", display: "flex", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes spin { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(236,72,153,0.4);border-radius:999px}
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-zoom { bottom: 16px !important; right: 16px !important; }
      `}</style>
 
      <LiveBackground />
 
      {/* Sidebar */}
      <div style={{ width: 280, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "32px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 10 }}>
        <div>
          {/* Logo */}
          <div style={{ marginBottom: 40, paddingLeft: 8 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(to right,#ec4899,#8b5cf6,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Syne, sans-serif" }}>SafeRoute</h1>
            <p style={{ color: "#4b5563", fontSize: 11, marginTop: 4, letterSpacing: "0.05em" }}>AI MOBILITY · GUWAHATI</p>
          </div>
 
          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.name} onClick={() => setActiveNav(item.name)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 16,
                background: activeNav === item.name ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))" : "transparent",
                border: activeNav === item.name ? "1px solid rgba(236,72,153,0.25)" : "1px solid transparent",
                color: activeNav === item.name ? "white" : "#6b7280", fontWeight: activeNav === item.name ? 600 : 400,
                fontSize: 14, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                boxShadow: activeNav === item.name ? "0 0 20px rgba(236,72,153,0.12)" : "none",
              }}
                onMouseEnter={e => { if (activeNav !== item.name) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#d1d5db" } }}
                onMouseLeave={e => { if (activeNav !== item.name) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280" } }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
 
        {/* Bottom actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Clock */}
          <div style={{ textAlign: "center", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
            <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: "#ec4899" }}>{time}</p>
            <p style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>Guwahati, IST</p>
          </div>
          <button onClick={handleTripShare} style={{ padding: "12px", borderRadius: 16, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            {tripSharing ? "📍 Location Shared!" : "📍 Share My Trip"}
          </button>
          <button onClick={handleSOS} style={{
            padding: "14px", borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: "pointer", border: "none",
            background: sosActive ? "#dc2626" : "linear-gradient(135deg, #ef4444, #ec4899)",
            color: "white", boxShadow: "0 0 20px rgba(239,68,68,0.3)", animation: sosActive ? "pulse 0.8s infinite" : "none"
          }}>
            🚨 Emergency SOS
          </button>
        </div>
      </div>
 
      {/* Main */}
      <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto", position: "relative", zIndex: 10 }}>
        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Syne, sans-serif" }}>{activeNav}</h1>
            <p style={{ color: "#4b5563", marginTop: 6, fontSize: 14 }}>AI-powered secure commute · Guwahati, Assam</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "10px 18px", borderRadius: 14 }}>
              <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></div>
              <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 500 }}>System Active</span>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, boxShadow: "0 0 20px rgba(236,72,153,0.4)" }}>KP</div>
          </div>
        </div>
 
        {renderMain()}
      </div>
    </div>
  )
}
 
const styles = {
  card: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 28,
    padding: "28px 28px",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Syne, sans-serif",
    marginBottom: 6,
  },
  cardSub: {
    color: "#6b7280",
    fontSize: 13,
  },
  btnOutline: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "8px 16px",
    color: "#d1d5db",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
  },
  btnSecondary: {
    padding: "8px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }
}