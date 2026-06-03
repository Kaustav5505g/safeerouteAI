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
    if (mapInstanceRef.current || !mapRef.current) return
 
    // Fix white box: hide attribution and leaflet logo
    const fixStyle = document.createElement("style")
    fixStyle.textContent = `
      .leaflet-control-attribution { display: none !important; }
      .leaflet-control-zoom { border: none !important; }
      .leaflet-control-zoom a { background: rgba(255,255,255,0.08) !important; color: white !important; border: 1px solid rgba(255,255,255,0.1) !important; backdrop-filter: blur(10px); }
      .leaflet-control-zoom a:hover { background: rgba(255,255,255,0.15) !important; }
      .leaflet-popup-content-wrapper { background: rgba(11,17,32,0.95) !important; color: white !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 16px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; backdrop-filter: blur(20px); }
      .leaflet-popup-tip { background: rgba(11,17,32,0.95) !important; }
      .leaflet-popup-close-button { color: #9ca3af !important; }
      @keyframes markerPulse { 0%,100%{box-shadow:0 0 8px rgba(34,197,94,0.8)} 50%{box-shadow:0 0 20px rgba(34,197,94,1), 0 0 40px rgba(34,197,94,0.4)} }
    `
    document.head.appendChild(fixStyle)
 
    const leafletCSS = document.createElement("link")
    leafletCSS.rel = "stylesheet"
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(leafletCSS)
 
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => {
      const L = window.L
      if (!mapRef.current) return
 
      const map = L.map(mapRef.current, {
        center: [26.1612, 91.7712],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      })
      mapInstanceRef.current = map
 
      L.control.zoom({ position: "bottomright" }).addTo(map)
 
      // Dark tile
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map)
 
      // Unsafe zones
      UNSAFE_ZONES.forEach(zone => {
        const color = zone.risk === "high" ? "#ef4444" : "#f59e0b"
        L.circle([zone.lat, zone.lng], {
          color, fillColor: color, fillOpacity: 0.12, weight: 1.5, radius: zone.radius,
        }).addTo(map).bindPopup(`
          <div style="padding:4px 0">
            <p style="color:${color};font-size:10px;font-weight:700;letter-spacing:0.08em;margin-bottom:6px">${zone.risk === "high" ? "⚠️ HIGH RISK ZONE" : "⚡ MODERATE RISK"}</p>
            <p style="font-weight:700;font-size:15px;margin-bottom:4px">${zone.name}</p>
            <p style="color:#9ca3af;font-size:12px">Caution advised after 9PM</p>
          </div>
        `)
      })
 
      // Safe zones
      SAFE_ZONES.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
          color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.08, weight: 1.5,
          radius: zone.radius, dashArray: "8 5",
        }).addTo(map).bindPopup(`
          <div style="padding:4px 0">
            <p style="color:#22c55e;font-size:10px;font-weight:700;letter-spacing:0.08em;margin-bottom:6px">✅ SAFE ZONE</p>
            <p style="font-weight:700;font-size:15px;margin-bottom:4px">${zone.name}</p>
            <p style="color:#9ca3af;font-size:12px">AI verified — safe area</p>
          </div>
        `)
      })
 
      // Animated route
      const routeLine = L.polyline(SAFE_ROUTE, {
        color: "#ec4899", weight: 4, opacity: 0.85,
        dashArray: "14 7", lineCap: "round", lineJoin: "round",
      }).addTo(map)
 
      let offset = 0
      const animInterval = setInterval(() => {
        offset = (offset - 1 + 21) % 21
        routeLine.setStyle({ dashOffset: `${offset}` })
      }, 40)
 
      // Start marker
      L.marker(SAFE_ROUTE[0], {
        icon: L.divIcon({
          html: `<div style="width:14px;height:14px;background:#22c55e;border-radius:50%;border:2.5px solid #fff;animation:markerPulse 2s infinite;box-shadow:0 0 12px rgba(34,197,94,0.8)"></div>`,
          className: "", iconSize: [14, 14], iconAnchor: [7, 7],
        })
      }).addTo(map).bindPopup(`<div style="padding:4px 0"><p style="font-weight:700;font-size:14px">📍 Your Location</p></div>`)
 
      // End marker
      L.marker(SAFE_ROUTE[SAFE_ROUTE.length - 1], {
        icon: L.divIcon({
          html: `<div style="width:14px;height:14px;background:#ef4444;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 12px rgba(239,68,68,0.8)"></div>`,
          className: "", iconSize: [14, 14], iconAnchor: [7, 7],
        })
      }).addTo(map).bindPopup(`<div style="padding:4px 0"><p style="font-weight:700;font-size:14px">🏁 Destination</p></div>`)
 
      return () => clearInterval(animInterval)
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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "inherit" }} />
 
      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 16, right: 16, zIndex: 1000,
        background: "rgba(5,8,22,0.85)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
        padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8,
      }}>
        {[
          { color: "#ef4444", label: "High Risk Zone" },
          { color: "#f59e0b", label: "Moderate Risk" },
          { color: "#22c55e", label: "Safe Zone" },
          { color: "#ec4899", label: "Safe Route" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: l.label === "Safe Route" ? 16 : 10, height: l.label === "Safe Route" ? 3 : 10, background: l.color, borderRadius: l.label === "Safe Route" ? 2 : "50%", opacity: 0.85 }} />
            <span style={{ color: "#9ca3af", fontSize: 11 }}>{l.label}</span>
          </div>
        ))}
      </div>
 
      {/* AI badge */}
      <div style={{
        position: "absolute", top: 14, left: 14, zIndex: 1000,
        background: "rgba(5,8,22,0.85)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12,
        padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
        <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}>AI Safety Active · Guwahati</span>
      </div>
    </div>
  )
}
 