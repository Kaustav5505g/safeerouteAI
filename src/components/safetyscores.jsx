import { useState, useEffect } from "react"

const AREAS = [
  { name: "GS Road", day: 8, night: 5, issues: ["Heavy traffic", "Poorly lit stretches after 10PM"] },
  { name: "Fancy Bazar", day: 6, night: 3, issues: ["Crowded alleys", "Very unsafe after 9PM"] },
  { name: "Paltan Bazaar", day: 6, night: 3, issues: ["Isolated at night", "Few street lights"] },
  { name: "Dispur", day: 9, night: 7, issues: ["Generally safe", "Avoid isolated lanes at night"] },
  { name: "Ganeshguri", day: 8, night: 6, issues: ["Well lit", "Moderate night activity"] },
  { name: "Chandmari", day: 7, night: 4, issues: ["Industrial area", "Low footfall at night"] },
  { name: "Ulubari", day: 8, night: 6, issues: ["Residential area", "Fairly safe"] },
  { name: "Sixmile", day: 7, night: 5, issues: ["Highway stretch", "Avoid late night travel"] },
  { name: "Beltola", day: 7, night: 5, issues: ["Moderate safety", "Use main roads at night"] },
  { name: "Zoo Road", day: 9, night: 6, issues: ["Well connected", "Safe with company at night"] },
]

function getScoreColor(score) {
  if (score >= 8) return "text-green-400"
  if (score >= 6) return "text-yellow-400"
  return "text-red-400"
}

function getScoreBg(score) {
  if (score >= 8) return "bg-green-500/10 border-green-500/20"
  if (score >= 6) return "bg-yellow-500/10 border-yellow-500/20"
  return "bg-red-500/10 border-red-500/20"
}

function getScoreLabel(score) {
  if (score >= 8) return "Safe"
  if (score >= 6) return "Moderate"
  return "High Risk"
}

export default function SafetyScores() {
  const [hour, setHour] = useState(new Date().getHours())
  const [selected, setSelected] = useState(null)
  const isNight = hour < 6 || hour >= 20

  useEffect(() => {
    const interval = setInterval(() => setHour(new Date().getHours()), 60000)
    return () => clearInterval(interval)
  }, [])

  const currentAreas = AREAS.map(a => ({
    ...a, score: isNight ? a.night : a.day
  })).sort((a, b) => b.score - a.score)

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold">Area Safety Scores</h2>
          <p className="text-gray-400 text-sm mt-1">Time-aware risk assessment · Guwahati</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-sm font-semibold ${isNight ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
          {isNight ? "🌙 Night Mode" : "☀️ Day Mode"}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 mb-5">
        <span className="text-xs text-gray-400">Simulate time:</span>
        <input type="range" min={0} max={23} value={hour} onChange={e => setHour(Number(e.target.value))} className="flex-1 accent-pink-500" />
        <span className="text-sm font-semibold text-pink-400 min-w-[48px]">{hour.toString().padStart(2, "0")}:00</span>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {currentAreas.map(area => (
          <div key={area.name} onClick={() => setSelected(selected?.name === area.name ? null : area)}
            className={`rounded-2xl p-4 border cursor-pointer transition hover:scale-[1.01] ${getScoreBg(area.score)}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{area.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${area.score >= 8 ? "bg-green-400" : area.score >= 6 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${area.score * 10}%` }} />
                </div>
                <span className={`font-bold text-lg ${getScoreColor(area.score)}`}>{area.score}/10</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getScoreBg(area.score)} ${getScoreColor(area.score)}`}>{getScoreLabel(area.score)}</span>
              </div>
            </div>
            {selected?.name === area.name && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                {area.issues.map((issue, i) => <p key={i} className="text-xs text-gray-400">• {issue}</p>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}