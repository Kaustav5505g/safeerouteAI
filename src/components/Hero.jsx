import { useNavigate } from "react-router-dom"

export default function Hero() {
  const navigate = useNavigate()
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[90vh] px-6 overflow-hidden">
      <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-5 py-2 rounded-full text-sm text-pink-300 mb-8">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          AI-Powered Safety · Guwahati, Assam
        </div>
        <h1 className="text-7xl font-bold leading-tight tracking-tight">
          Safe Commute<br />
          <span className="gradient-text">For Every Woman</span>
        </h1>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          AI-powered navigation that learns Guwahati's unsafe zones, suggests safer routes in real time, and keeps your trusted circle informed — every journey, every time.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition glow">
            Start Safe Journey →
          </button>
          <button onClick={() => navigate("/dashboard")}
            className="glass px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition border border-white/10">
            View Safety Map
          </button>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { icon: "🗺️", label: "Smart Route AI", desc: "Avoids unsafe zones in real time" },
            { icon: "🚨", label: "One-Tap SOS", desc: "Instant emergency alert with GPS" },
            { icon: "👥", label: "Community Safety", desc: "Crowdsourced incident reports" },
          ].map(f => (
            <div key={f.label} className="glass rounded-2xl p-5 hover:border-pink-500/20 transition border border-white/5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="font-semibold text-sm">{f.label}</p>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}