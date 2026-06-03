import { useState } from "react"
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
 
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [reports, setReports] = useState([])
  const [sosActive, setSosActive] = useState(false)
  const [tripSharing, setTripSharing] = useState(false)
 
  function handleSOS() {
    setSosActive(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        alert(`🚨 SOS ACTIVATED!\nLocation: https://maps.google.com/?q=${latitude},${longitude}\nGuwahati Police: 100 | Women Helpline: 1091`)
      }, () => {
        alert("🚨 SOS ACTIVATED!\nGuwahati Police: 100 | Women Helpline: 1091")
      })
    }
    setTimeout(() => setSosActive(false), 5000)
  }
 
  function handleTripShare() {
    setTripSharing(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        const shareUrl = `https://maps.google.com/?q=${latitude},${longitude}`
        if (navigator.share) {
          navigator.share({ title: "SafeRoute Live Location", text: "Tracking my journey on SafeRoute AI", url: shareUrl })
        } else {
          navigator.clipboard.writeText(shareUrl)
          alert("📍 Live location link copied! Share with your trusted contact.")
        }
      })
    }
    setTimeout(() => setTripSharing(false), 3000)
  }
 
  const renderMain = () => {
    if (activeNav === "AI Assistant") {
      return <AISafetyChat />
    }
 
    if (activeNav === "Report") {
      return (
        <div className="grid grid-cols-2 gap-6">
          <IncidentReport onReport={r => setReports(prev => [r, ...prev])} />
          <div className="glass rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-1">Community Reports</h2>
            <p className="text-gray-400 text-sm mb-5">Recent incidents reported by women in Guwahati</p>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {[
                { area: "Fancy Bazar", type: "Poor Lighting", time: "2h ago", color: "yellow" },
                { area: "Paltan Bazaar", type: "Suspicious Activity", time: "4h ago", color: "red" },
                { area: "GS Road", type: "Safe Zone", time: "5h ago", color: "green" },
                { area: "Chandmari", type: "No Transport", time: "6h ago", color: "blue" },
                ...reports.map(r => ({ area: r.area, type: r.type, time: r.time, color: "pink" }))
              ].map((r, i) => (
                <div key={i} className={`rounded-2xl p-4 border ${
                  r.color === "red" ? "bg-red-500/10 border-red-500/20" :
                  r.color === "yellow" ? "bg-yellow-500/10 border-yellow-500/20" :
                  r.color === "green" ? "bg-green-500/10 border-green-500/20" :
                  r.color === "blue" ? "bg-blue-500/10 border-blue-500/20" :
                  "bg-pink-500/10 border-pink-500/20"
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{r.area}</p>
                      <p className="text-gray-400 text-xs mt-1">{r.type}</p>
                    </div>
                    <span className="text-xs text-gray-500">{r.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
 
    if (activeNav === "Safe Zones") {
      return <SafetyScores />
    }
 
    if (activeNav === "Live Tracking") {
      return (
        <div className="glass rounded-3xl p-6 h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold">Live Safety Map</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time Guwahati safety zones · Powered by OpenStreetMap</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleTripShare}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${tripSharing ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"}`}>
                {tripSharing ? "📍 Shared!" : "📍 Share Trip"}
              </button>
              <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-pink-400 text-sm">Live</span>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden">
            <GuwahatiMap />
          </div>
        </div>
      )
    }
 
    if (activeNav === "Emergency") {
      return (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-500/30 rounded-3xl p-8">
            <div className="text-5xl mb-4">🚨</div>
            <h2 className="text-3xl font-bold mb-2">Emergency SOS</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">Instantly alert your trusted contacts and share your live GPS location with emergency services in Guwahati.</p>
            <button onClick={handleSOS}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition ${sosActive ? "bg-red-600 animate-pulse scale-95" : "bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 hover:scale-105"} glow`}>
              {sosActive ? "🚨 SOS ACTIVATED — Alerting..." : "🚨 Activate Emergency SOS"}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Sends your GPS coordinates to emergency contacts</p>
            <button onClick={handleTripShare}
              className={`w-full mt-4 py-4 rounded-2xl font-semibold transition border ${tripSharing ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"}`}>
              {tripSharing ? "📍 Location Shared!" : "📍 Share Live Location"}
            </button>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-5">Emergency Contacts · Guwahati</h3>
            <div className="space-y-3">
              {[
                { name: "Guwahati Police", number: "100", icon: "👮", color: "blue" },
                { name: "Women Helpline", number: "1091", icon: "👩", color: "pink" },
                { name: "Assam Police Control", number: "0361-2237677", icon: "🚔", color: "purple" },
                { name: "Ambulance", number: "108", icon: "🚑", color: "red" },
                { name: "Child Helpline", number: "1098", icon: "🆘", color: "yellow" },
                { name: "National Emergency", number: "112", icon: "📞", color: "green" },
              ].map(c => (
                <a key={c.name} href={`tel:${c.number}`}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-gray-400 text-xs font-mono">{c.number}</p>
                    </div>
                  </div>
                  <span className="text-pink-400 text-xs group-hover:translate-x-1 transition">Call →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    }
 
    // Default Dashboard
    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: "Safety Score", value: "94%", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", sub: "↑ 12% today" },
            { label: "Risk Alerts", value: "03", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", sub: "Active alerts" },
            { label: "Safe Zones", value: "18", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", sub: "AI verified" },
            { label: "Live Reports", value: reports.length.toString().padStart(2, "0"), color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", sub: "Community" },
          ].map((card, i) => (
            <div key={i} className={`rounded-3xl p-6 border hover-card ${card.bg}`}>
              <p className="text-gray-400 text-sm">{card.label}</p>
              <h1 className={`text-5xl font-bold mt-3 ${card.color}`}>{card.value}</h1>
              <p className={`${card.color} mt-3 text-xs opacity-80`}>{card.sub}</p>
            </div>
          ))}
        </div>
 
        {/* Map + Alerts */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 glass rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">AI Safety Map</h2>
                <p className="text-gray-400 text-sm mt-1">Live Guwahati · Click zones for details</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActiveNav("Live Tracking")}
                  className="bg-pink-500/15 border border-pink-500/20 px-4 py-2 rounded-xl text-sm hover:bg-pink-500/25 transition">
                  Full Map →
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-[420px]">
              <GuwahatiMap />
            </div>
          </div>
 
          <div className="space-y-5">
            <div className="glass rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-4">Live AI Alerts</h2>
              <div className="space-y-3">
                {[
                  { msg: "Unsafe activity near Fancy Bazar alleys", level: "HIGH RISK", color: "red" },
                  { msg: "Poor lighting on Lake Road after 9PM", level: "WARNING", color: "yellow" },
                  { msg: "GS Road main corridor is clear", level: "SAFE", color: "green" },
                  { msg: "3 women sharing live trips now", level: "INFO", color: "blue" },
                ].map((a, i) => (
                  <div key={i} className={`rounded-2xl p-3 border text-sm ${
                    a.color === "red" ? "bg-red-500/10 border-red-500/20" :
                    a.color === "yellow" ? "bg-yellow-500/10 border-yellow-500/20" :
                    a.color === "green" ? "bg-green-500/10 border-green-500/20" :
                    "bg-blue-500/10 border-blue-500/20"
                  }`}>
                    <p className={`font-bold text-xs mb-1 ${
                      a.color === "red" ? "text-red-400" :
                      a.color === "yellow" ? "text-yellow-400" :
                      a.color === "green" ? "text-green-400" : "text-blue-400"
                    }`}>{a.level}</p>
                    <p className="text-gray-300 text-xs leading-5">{a.msg}</p>
                  </div>
                ))}
              </div>
            </div>
 
            <button onClick={() => setActiveNav("AI Assistant")}
              className="w-full glass rounded-3xl p-5 border border-pink-500/20 hover:border-pink-500/40 transition text-left group">
              <p className="text-gray-400 text-xs">Ask anything about route safety</p>
              <h3 className="text-lg font-bold mt-2 gradient-text group-hover:opacity-80">Open AI Assistant →</h3>
              <p className="text-gray-500 text-xs mt-1">Powered by Claude AI</p>
            </button>
 
            <button onClick={handleSOS}
              className={`w-full rounded-3xl p-4 font-bold text-lg glow transition ${sosActive ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90"}`}>
              🚨 Emergency SOS
            </button>
          </div>
        </div>
      </>
    )
  }
 
  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden relative">
      <LiveBackground />
 
      {/* Sidebar */}
      <div className="w-[260px] glass border-r border-white/10 p-7 flex flex-col justify-between flex-shrink-0 relative z-10">
        <div>
          <div className="mb-12">
            <h1 className="text-3xl font-bold gradient-text">SafeRoute</h1>
            <p className="text-gray-500 mt-1 text-xs">AI Mobility · Guwahati</p>
          </div>
          <div className="space-y-2">
            {NAV_ITEMS.map(item => (
              <button key={item.name} onClick={() => setActiveNav(item.name)}
                className={`w-full text-left p-4 rounded-2xl transition flex items-center gap-3 text-sm font-medium ${
                  activeNav === item.name
                    ? "bg-pink-500/15 border border-pink-500/20 text-white glow"
                    : "hover:bg-white/5 text-gray-400 hover:text-white border border-transparent"
                }`}>
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={handleTripShare}
            className={`w-full py-3 rounded-2xl text-sm font-semibold border transition ${tripSharing ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"}`}>
            {tripSharing ? "📍 Location Shared!" : "📍 Share My Trip"}
          </button>
          <button onClick={handleSOS}
            className={`w-full p-4 rounded-2xl font-bold glow transition ${sosActive ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90"}`}>
            🚨 Emergency SOS
          </button>
        </div>
      </div>
 
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">{activeNav}</h1>
            <p className="text-gray-400 mt-2 text-sm">AI-powered secure commute · Guwahati, Assam</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">System Active</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 glow flex items-center justify-center font-bold">KP</div>
          </div>
        </div>
 
        {renderMain()}
      </div>
    </div>
  )
}