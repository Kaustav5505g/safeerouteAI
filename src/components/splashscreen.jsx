import { useEffect, useRef, useState } from "react"
import { playSciFiSound } from "./scifiSound"

export default function SplashScreen({ onComplete }) {
  const canvasRef = useRef(null)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const CX = W / 2
    const CY = H / 2
    let animId
    let phase = "gathering"
    let holdStart = null
    let explodeStart = null

    // Sample text pixels
    const off = document.createElement("canvas")
    off.width = W; off.height = H
    const octx = off.getContext("2d")
    const fontSize = Math.min(W / 6.5, 115)
    octx.font = `900 ${fontSize}px Arial Black, Arial, sans-serif`
    octx.fillStyle = "#fff"
    octx.textAlign = "center"
    octx.textBaseline = "middle"
    octx.fillText("SafeRoute", CX, CY)

    const imgData = octx.getImageData(0, 0, W, H).data
    const pts = []
    const step = Math.max(3, Math.floor(fontSize / 28))
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (imgData[(y * W + x) * 4 + 3] > 120) pts.push({ x, y })
      }
    }
    pts.sort(() => Math.random() - 0.5)
    const MAX = Math.min(pts.length, 700)
    const COLORS = ["#ec4899", "#f472b6", "#8b5cf6", "#a78bfa", "#ffffff", "#e879f9", "#3b82f6"]

    const particles = pts.slice(0, MAX).map(t => ({
      tx: t.x, ty: t.y,
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 1.6 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      ex: 0, ey: 0, elife: 1, edecay: 0,
    }))

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 0.9 + 0.1,
      o: Math.random() * 0.35 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
    }))

    const shockwaves = []

    // Play sound immediately — explosion synced to 1.4s mark in sound
    playSciFiSound()

    function triggerExplosion() {
      phase = "exploding"
      explodeStart = Date.now()

      shockwaves.push({ r: 0, maxR: Math.max(W, H) * 1.2, speed: 22, color: "236,72,153", alpha: 1 })
      shockwaves.push({ r: 0, maxR: Math.max(W, H) * 0.9, speed: 14, color: "168,85,247", alpha: 0.7 })
      shockwaves.push({ r: 0, maxR: Math.max(W, H) * 0.6, speed: 8, color: "59,130,246", alpha: 0.5 })

      particles.forEach(p => {
        const dx = p.tx - CX
        const dy = p.ty - CY
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8
        const speed = Math.random() * 14 + 5
        p.ex = Math.cos(angle) * speed
        p.ey = Math.sin(angle) * speed - Math.random() * 3
        p.elife = 1
        p.edecay = 0.008 + Math.random() * 0.012
      })

      setTimeout(() => setFadeOut(true), 2200)
      setTimeout(onComplete, 3000)
    }

    const draw = () => {
      ctx.fillStyle = "rgba(3,7,18,0.22)"
      ctx.fillRect(0, 0, W, H)

      const now = Date.now() / 1000
      stars.forEach(s => {
        const tw = s.o * (0.6 + 0.4 * Math.sin(now * 1.5 + s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${tw})`
        ctx.fill()
      })

      if (phase === "gathering") {
        let gathered = 0
        particles.forEach(p => {
          const dx = p.tx - p.x
          const dy = p.ty - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 1.2) { p.x = p.tx; p.y = p.ty; gathered++ }
          else {
            p.vx += dx * 0.055; p.vy += dy * 0.055
            p.vx *= 0.74; p.vy *= 0.74
            p.x += p.vx; p.y += p.vy
          }
          ctx.shadowBlur = 5; ctx.shadowColor = p.color
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color; ctx.fill(); ctx.shadowBlur = 0
        })
        if (gathered >= MAX * 0.92) { phase = "holding"; holdStart = Date.now() }

      } else if (phase === "holding") {
        const holdElapsed = (Date.now() - holdStart) / 1000
        const pulse = 1 + Math.sin(holdElapsed * 10) * 0.25

        particles.forEach(p => {
          ctx.shadowBlur = 6 * pulse; ctx.shadowColor = p.color
          ctx.beginPath(); ctx.arc(p.tx, p.ty, p.size * (0.85 + pulse * 0.15), 0, Math.PI * 2)
          ctx.fillStyle = p.color; ctx.fill(); ctx.shadowBlur = 0
        })

        // Crisp gradient text overlay
        ctx.save()
        ctx.font = `900 ${fontSize}px Arial Black, Arial, sans-serif`
        ctx.textAlign = "center"; ctx.textBaseline = "middle"
        const grad = ctx.createLinearGradient(CX - fontSize * 3, 0, CX + fontSize * 3, 0)
        grad.addColorStop(0, "#ffffff")
        grad.addColorStop(0.3, "#f472b6")
        grad.addColorStop(0.65, "#8b5cf6")
        grad.addColorStop(1, "#3b82f6")
        ctx.fillStyle = grad
        ctx.globalAlpha = Math.min(1, holdElapsed * 4)
        ctx.shadowBlur = 18 * pulse; ctx.shadowColor = "#ec4899"
        ctx.fillText("SafeRoute", CX, CY)

        // Tagline
        ctx.font = `600 ${fontSize * 0.18}px Arial, sans-serif`
        ctx.fillStyle = "rgba(236,72,153,0.85)"
        ctx.globalAlpha = Math.min(1, (holdElapsed - 0.15) * 4)
        ctx.shadowBlur = 10; ctx.shadowColor = "#ec4899"
        ctx.fillText("AI SAFETY  ·  GUWAHATI", CX, CY + fontSize * 0.72)
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
        ctx.restore()

        // Trigger explosion synced to 1.4s sound impact
        // Sound starts immediately, impact is at 1.4s, holding starts ~1s after gathering
        if (holdElapsed > 0.4) triggerExplosion()

      } else if (phase === "exploding") {
        const explElapsed = (Date.now() - explodeStart) / 1000

        if (explElapsed < 0.2) {
          const flashA = (1 - explElapsed / 0.2) * 0.8
          const fGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, W * 0.5)
          fGrad.addColorStop(0, `rgba(255,255,255,${flashA})`)
          fGrad.addColorStop(0.4, `rgba(236,72,153,${flashA * 0.4})`)
          fGrad.addColorStop(1, "rgba(0,0,0,0)")
          ctx.fillStyle = fGrad; ctx.fillRect(0, 0, W, H)
        }

        shockwaves.forEach(sw => {
          sw.r += sw.speed
          const a = sw.alpha * Math.max(0, 1 - sw.r / sw.maxR)
          if (a > 0) {
            ctx.beginPath(); ctx.arc(CX, CY, sw.r, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(${sw.color},${a})`
            ctx.lineWidth = 2.5; ctx.stroke()
          }
        })

        particles.forEach(p => {
          p.elife -= p.edecay
          if (p.elife <= 0) return
          p.tx += p.ex; p.ty += p.ey
          p.ex *= 0.95; p.ey *= 0.95
          p.ey += 0.12
          ctx.globalAlpha = p.elife
          ctx.shadowBlur = 8; ctx.shadowColor = p.color
          ctx.beginPath(); ctx.arc(p.tx, p.ty, p.size * p.elife, 0, Math.PI * 2)
          ctx.fillStyle = p.color; ctx.fill()
          ctx.shadowBlur = 0; ctx.globalAlpha = 1
        })
      }

      animId = requestAnimationFrame(draw)
    }

    ctx.fillStyle = "#030712"
    ctx.fillRect(0, 0, W, H)
    draw()

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#030712",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.8s ease",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      <div style={{
        position: "absolute", bottom: 44,
        left: "50%", transform: "translateX(-50%)",
        width: "clamp(140px, 25vw, 220px)",
        height: 2,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 999, overflow: "hidden", zIndex: 2,
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6)",
          borderRadius: 999,
          boxShadow: "0 0 10px rgba(236,72,153,0.9)",
          animation: "barFill 3s ease forwards",
        }} />
      </div>

      <style>{`
        @keyframes barFill { from { width: 0 } to { width: 100% } }
      `}</style>
    </div>
  )
}