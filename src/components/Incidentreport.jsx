import { useState } from "react"

const GUWAHATI_AREAS = [
  "Fancy Bazar", "Paltan Bazaar", "GS Road", "Dispur", "Chandmari",
  "Ulubari", "Ganeshguri", "Bhangagarh", "Sixmile", "Beltola",
  "Zoo Road", "Railway Station", "Lakhtokia", "Narengi", "Kahilipara"
]

const INCIDENT_TYPES = [
  { label: "Poor Lighting", icon: "💡", color: "yellow" },
  { label: "Harassment", icon: "⚠️", color: "red" },
  { label: "Suspicious Activity", icon: "👁️", color: "orange" },
  { label: "Unsafe Road", icon: "🚧", color: "orange" },
  { label: "No Transport", icon: "🚌", color: "blue" },
  { label: "Safe Zone", icon: "✅", color: "green" },
]

export default function IncidentReport({ onReport }) {
  const [area, setArea] = useState("")
  const [type, setType] = useState("")
  const [desc, setDesc] = useState("")
  const [time, setTime] = useState("now")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!area || !type) return
    onReport?.({ area, type, desc, time, timestamp: new Date().toISOString() })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setArea("")
      setType("")
      setDesc("")
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center h-[340px] text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-400">Report Submitted!</h2>
        <p className="text-gray-400 mt-3 text-sm">Thank you for keeping Guwahati safer. Your report has been added to the safety map.</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-1">Report an Incident</h2>
      <p className="text-gray-400 text-sm mb-6">Help other women by reporting unsafe conditions anonymously</p>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Area in Guwahati</label>
          <select value={area} onChange={e => setArea(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50 transition appearance-none">
            <option value="" className="bg-[#050816]">Select area...</option>
            {GUWAHATI_AREAS.map(a => <option key={a} value={a} className="bg-[#050816]">{a}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Incident Type</label>
          <div className="grid grid-cols-3 gap-2">
            {INCIDENT_TYPES.map(t => (
              <button key={t.label} onClick={() => setType(t.label)}
                className={`p-3 rounded-2xl text-xs border transition text-center ${
                  type === t.label ? "bg-pink-500/20 border-pink-500/50 text-pink-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}>
                <div className="text-lg mb-1">{t.icon}</div>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-2 block">When did this happen?</label>
          <div className="flex gap-2">
            {["now", "1h ago", "today", "yesterday"].map(t => (
              <button key={t} onClick={() => setTime(t)}
                className={`flex-1 py-2 rounded-xl text-xs border transition ${
                  time === t ? "bg-pink-500/20 border-pink-500/50 text-pink-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}>{t}</button>
            ))}
          </div>
        </div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Additional details (optional)..." rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-pink-500/50 transition resize-none" />
        <button onClick={handleSubmit} disabled={!area || !type}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 glow">
          Submit Anonymous Report
        </button>
      </div>
    </div>
  )
}