import { useEffect, useRef } from "react"

const UNSAFE_ZONES = [
  { lat: 26.1844, lng: 91.7458, name: "Fancy Bazar", risk: "high", radius: 400 },
  { lat: 26.1833, lng: 91.7523, name: "Paltan Bazaar", risk: "high", radius: 350 },
  { lat: 26.1762, lng: 91.7798, name: "Chandmari", risk: "medium", radius: 300 },
  { lat: 26.1445, lng: 91.7362, name: "Sixmile Night", risk: "medium", radius: 350 },
  { lat: 26.1923, lng: 91.7601, name: "Railway Station", risk: "high", radius: 300 },
  { lat: 26.1612, lng: 91.7523, name: "Lakhtokia", risk: "medium", radius: 250 },
]

const SAFE_ZONES = [
  { lat: 26.1445, lng: 91.7902, name: "Dispur", radius: 400 },
  { lat: 26.1612, lng: 91.7712, name: "Ganeshguri", radius: 300 },
  { lat: 26.1523, lng: 91.7634, name: "Ulubari", radius: 280 },
  { lat: 26.1689, lng: 91.7845, name: "Zoo Road", radius: 300 },
]

// Safe route waypoints through Guwahati
const SAFE_ROUTE = [
  [26.1523, 91.7634],
  [26.1578, 91.7689],
  [26.1612, 91.7712],
  [26.1656, 91.7756],
  [26.1689, 91.7845],
]

export default function GuwahatiMap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (mapInstanceRef.current) return

    // Dynamically load Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    // Dynamically load Leaflet JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => {
      const L = window.L

      const map = L.map(mapRef.current, {
        center: [26.1612, 91.7712],
        zoom: 13,
        zoomControl: false,
      })

      mapInstanceRef.current = map

      // Dark tile layer (free, no API key)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map)

      // Add zoom control bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map)

      // Unsafe zones (red circles)
      UNSAFE_ZONES.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
          color: zone.risk === "high" ? "#ef4444" : "#f59e0b",
          fillColor: zone.risk === "high" ? "#ef4444" : "#f59e0b",
          fillOpacity: 0.15,
          weight: 2,
          radius: zone.radius,
        }).addTo(map).bindPopup(`
          <div style="background:#0B1120;color:white;padding:8px 12px;border-radius:12px;border:1px solid rgba(239,68,68,0.3);min-width:140px">
            <p style="color:${zone.risk === "high" ? "#ef4444" : "#f59e0b"};font-size:10px;font-weight:600;margin-bottom:4px">${zone.risk === "high" ? "⚠️ HIGH RISK" : "⚡ MODERATE RISK"}</p>
            <p style="font-weight:700;font-size:14px">${zone.name}</p>
            <p style="color:#9ca3af;font-size:11px;margin-top:4px">Avoid after 9PM</p>
          </div>
        `, { className: "custom-popup" })
      })

      // Safe zones (green circles)
      SAFE_ZONES.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
          color: "#22c55e",
          fillColor: "#22c55e",
          fillOpacity: 0.1,
          weight: 1.5,
          radius: zone.radius,
          dashArray: "6, 4",
        }).addTo(map).bindPopup(`
          <div style="background:#0B1120;color:white;padding:8px 12px;border-radius:12px;border:1px solid rgba(34,197,94,0.3);min-width:140px">
            <p style="color:#22c55e;font-size:10px;font-weight:600;margin-bottom:4px">✅ SAFE ZONE</p>
            <p style="font-weight:700;font-size:14px">${zone.name}</p>
            <p style="color:#9ca3af;font-size:11px;margin-top:4px">AI verified safe area</p>
          </div>
        `, { className: "custom-popup" })
      })

      // Safe route polyline
      const routeLine = L.polyline(SAFE_ROUTE, {
        color: "#ec4899",
        weight: 4,
        opacity: 0.8,
        dashArray: "12, 6",
        lineCap: "round",
      }).addTo(map)

      // Animate route dash
      let offset = 0
      setInterval(() => {
        offset = (offset + 1) % 18
        routeLine.setStyle({ dashOffset: `-${offset}` })
      }, 50)

      // Start marker (green pulsing)
      const startIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;background:#22c55e;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(34,197,94,0.8);animation:pulse 1.5s infinite"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      // End marker (red)
      const endIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;background:#ef4444;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(239,68,68,0.8)"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker(SAFE_ROUTE[0], { icon: startIcon }).addTo(map)
        .bindPopup("<div style='background:#0B1120;color:white;padding:8px 12px;border-radius:12px;font-weight:700'>📍 Your Location</div>")

      L.marker(SAFE_ROUTE[SAFE_ROUTE.length - 1], { icon: endIcon }).addTo(map)
        .bindPopup("<div style='background:#0B1120;color:white;padding:8px 12px;border-radius:12px;font-weight:700'>🏁 Destination</div>")

      // Style popups
      const style = document.createElement("style")
      style.textContent = `
        .custom-popup .leaflet-popup-content-wrapper { background: transparent; box-shadow: none; padding: 0; }
        .custom-popup .leaflet-popup-content { margin: 0; }
        .custom-popup .leaflet-popup-tip { display: none; }
        .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; }
        .leaflet-popup-tip-container { display: none; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 8px rgba(34,197,94,0.8)} 50%{box-shadow:0 0 20px rgba(34,197,94,1)} }
      `
      document.head.appendChild(style)
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "16px" }} />

      {/* Legend overlay */}
      <div className="absolute bottom-4 right-4 glass rounded-2xl p-3 text-xs space-y-2 z-[1000]">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div><span className="text-gray-300">High Risk Zone</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div><span className="text-gray-300">Moderate Risk</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 opacity-80"></div><span className="text-gray-300">Safe Zone</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-1 rounded bg-pink-500"></div><span className="text-gray-300">Safe Route</span></div>
      </div>

      {/* AI badge */}
      <div className="absolute top-4 left-4 glass rounded-xl px-3 py-2 text-xs z-[1000] flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-400 font-semibold">AI Safety Active · Guwahati</span>
      </div>
    </div>
  )
}