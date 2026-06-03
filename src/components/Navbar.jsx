import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="flex items-center justify-between px-10 py-5 glass border-b border-white/5 sticky top-0 z-50">
      <div>
        <h1 className="text-2xl font-bold gradient-text">SafeRoute</h1>
        <p className="text-gray-500 text-xs">AI Safety Navigator · Guwahati</p>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <a href="#" className="hover:text-white transition">How it works</a>
        <a href="#" className="hover:text-white transition">Safety Map</a>
        <a href="#" className="hover:text-white transition">Community</a>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs">Live · Guwahati</span>
        </div>
        <button onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition glow">
          Open Dashboard
        </button>
      </div>
    </nav>
  )
}