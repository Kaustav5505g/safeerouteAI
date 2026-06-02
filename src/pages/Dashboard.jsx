import { useState } from "react"
import AISafetyChat from "../components/AISafetyChat"
import IncidentReport from "../components/IncidentReport"
import SafetyScores from "../components/SafetyScores"

const NAV_ITEMS = ["Dashboard", "Live Tracking", "Safe Zones", "AI Assistant", "Report", "Emergency"]

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
        const msg = `🚨 EMERGENCY ALERT from SafeRoute!\nLocation: https://maps.google.com/?q=${latitude},${longitude}\nGuwahati Police: 100 | Women Helpline: 1091`
        alert(msg)
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
          alert("📍 Live location link copied to clipboard! Share with your trusted contact.")
        }
      })
    }
    setTimeout(() => setTripSharing(false), 3000)
  }

  const renderMain = () => {
    if (activeNav === "AI Assistant") {
      return (
        <div className="grid grid-cols-1 gap-6">
          <AISafetyChat />
        </div>
      )
    }

    if (activeNav === "Report") {
      return (
        <div className="grid grid-cols-2 gap-6">
          <IncidentReport onReport={r => setReports(prev => [r, ...prev])} />
          <div className="glass rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-1">Community Reports</h2>
            <p className="text-gray-400 text-sm mb-5">Recent incidents reported by women in Guwahati</p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
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

    if (activeNav === "Emergency") {
      return (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-500/30 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-2">Emergency SOS</h2>
            <p className="text-gray-400 mb-8">Instantly alert your trusted contacts and share your live location with emergency services.</p>
            <button
              onClick={handleSOS}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition ${sosActive ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90"} glow`}
            >
              {sosActive ? "🚨 SOS ACTIVATED..." : "🚨 Activate Emergency SOS"}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Sends your GPS location to emergency contacts</p>
          </div>
          <div className="space-y-4">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                {[
                  { name: "Guwahati Police", number: "100", icon: "👮" },
                  { name: "Women Helpline", number: "1091", icon: "👩" },
                  { name: "Assam Police", number: "0361-2237677", icon: "🚔" },
                  { name: "Ambulance", number: "108", icon: "🚑" },
                  { name: "Child Helpline", number: "1098", icon: "🆘" },
                ].map(c => (
                  <a key={c.name} href={`tel:${c.number}`} className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.number}</p>
                      </div>
                    </div>
                    <span className="text-pink-400 text-xs">Tap to call →</span>
                  </a>
                ))}
              </div>
            </div>
            <button
              onClick={handleTripShare}
              className={`w-full py-4 rounded-2xl font-semibold transition border ${tripSharing ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"}`}
            >
              {tripSharing ? "📍 Location Copied/Shared!" : "📍 Share Live Location"}
            </button>
          </div>
        </div>
      )
    }

    // Default Dashboard view
    return (
      <>
        <div className="grid grid-cols-4 gap-6 mt-2">
          {[
            { label: "Safety Score", value: "94%", color: "text-green-400", sub: "↑ 12% improvement" },
            { label: "Risk Alerts", value: "03", color: "text-red-400", sub: "High-risk areas" },
            { label: "Safe Zones", value: "18", color: "text-blue-400", sub: "AI verified" },
            { label: "Reports Today", value: reports.length.toString().padStart(2,"0"), color: "text-pink-400", sub: "Community reports" },
          ].map((card, i) => (
            <div key={i} className="glass rounded-3xl p-6 hover-card">
              <p className="text-gray-400 text-sm">{card.label}</p>
              <h1 className={`text-5xl font-bold mt-4 ${card.color}`}>{card.value}</h1>
              <p className={`${card.color} mt-4 text-sm`}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2 glass rounded-3xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">AI Safety Map</h2>
                <p className="text-gray-400 mt-1 text-sm">Guwahati · Smart route optimization & danger prediction</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-pink-500/15 border border-pink-500/20 px-4 py-2 rounded-2xl text-sm">Live Tracking</div>
              </div>
            </div>
            <div className="mt-5 h-[480px] rounded-3xl bg-[#0B1120] border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:55px_55px]"></div>

              {/* Guwahati street labels */}
              <div className="absolute top-[20%] left-[30%] text-xs text-gray-500 font-mono">GS Road</div>
              <div className="absolute top-[55%] left-[15%] text-xs text-gray-500 font-mono">Fancy Bazar</div>
              <div className="absolute top-[35%] right-[20%] text-xs text-gray-500 font-mono">Dispur</div>
              <div className="absolute bottom-[25%] right-[30%] text-xs text-gray-500 font-mono">Ganeshguri</div>

              {/* Risk zones */}
              <div className="absolute top-[50%] left-[12%] w-16 h-16 bg-red-500/20 rounded-full border border-red-500/30 flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">Risk</span>
              </div>
              <div className="absolute top-[30%] left-[40%] w-12 h-12 bg-yellow-500/20 rounded-full border border-yellow-500/30 flex items-center justify-center">
                <span className="text-yellow-400 text-xs">Med</span>
              </div>
              <div className="absolute top-[60%] right-[25%] w-12 h-12 bg-yellow-500/20 rounded-full border border-yellow-500/30 flex items-center justify-center">
                <span className="text-yellow-400 text-xs">Med</span>
              </div>

              {/* Safe route */}
              <div className="absolute top-[44%] left-[18%] w-[380px] h-[5px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full rotate-6 shadow-[0_0_20px_rgba(236,72,153,0.5)]"></div>

              {/* Start/End markers */}
              <div className="absolute top-[41%] left-[14%] flex flex-col items-center gap-1">
                <div className="w-5 h-5 bg-green-400 rounded-full animate-pulse glow"></div>
                <span className="text-xs text-green-400">You</span>
              </div>
              <div className="absolute top-[52%] right-[16%] flex flex-col items-center gap-1">
                <div className="w-5 h-5 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-xs text-red-400">Dest</span>
              </div>

              {/* AI floating card */}
              <div className="absolute bottom-6 left-6 glass rounded-2xl p-5 w-[280px] float">
                <p className="text-gray-400 text-xs">AI Recommendation</p>
                <h3 className="text-lg font-bold mt-2">Safer Route Detected</h3>
                <p className="text-gray-400 mt-2 text-xs leading-5">Avoiding Fancy Bazar alleys and poorly lit stretches on Lake Road. Using GS Road main corridor.</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Safety Score: 8.4/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-4">Live AI Alerts</h2>
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm">
                  <p className="text-red-400 font-semibold text-xs mb-1">HIGH RISK</p>
                  Unsafe activity near Fancy Bazar alleys
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-sm">
                  <p className="text-yellow-400 font-semibold text-xs mb-1">WARNING</p>
                  Poor lighting on Lake Road after 9PM
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-sm">
                  <p className="text-green-400 font-semibold text-xs mb-1">SAFE ROUTE</p>
                  GS Road main corridor is clear
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm">
                  <p className="text-blue-400 font-semibold text-xs mb-1">INFO</p>
                  3 women currently sharing live trips
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveNav("AI Assistant")}
              className="w-full glass rounded-3xl p-5 border border-pink-500/20 hover:border-pink-500/40 transition text-left"
            >
              <p className="text-gray-400 text-xs">Ask anything about route safety</p>
              <h3 className="text-lg font-bold mt-2 gradient-text">Open AI Assistant →</h3>
              <p className="text-gray-500 text-xs mt-2">Powered by Claude AI</p>
            </button>

            <button
              onClick={handleSOS}
              className={`w-full bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-5 font-bold text-lg glow transition ${sosActive ? "animate-pulse" : "hover:opacity-90"}`}
            >
              🚨 Emergency SOS
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[260px] glass border-r border-white/10 p-7 flex flex-col justify-between flex-shrink-0">
        <div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">SafeRoute</h1>
            <p className="text-gray-400 mt-1 text-xs">AI Mobility Intelligence · Guwahati</p>
          </div>
          <div className="mt-12 space-y-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`w-full text-left p-4 rounded-2xl transition text-sm font-medium ${
                  activeNav === item
                    ? "bg-pink-500/15 border border-pink-500/20 text-white glow"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleTripShare}
            className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-2xl text-sm font-semibold hover:bg-blue-500/20 transition"
          >
            📍 Share My Trip
          </button>
          <button
            onClick={handleSOS}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl font-bold glow hover:opacity-90 transition"
          >
            🚨 Emergency SOS
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 relative overflow-y-auto">
        <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold tracking-tight">{activeNav}</h1>
              <p className="text-gray-400 mt-2">Real-time AI-powered secure commute monitoring · Guwahati</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">System Active</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 glow flex items-center justify-center font-bold text-sm">KP</div>
            </div>
          </div>

          {renderMain()}
        </div>
      </div>
    </div>
  )
}