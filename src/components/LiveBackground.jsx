import { useEffect, useRef } from "react"
 
export default function LiveBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const animRef = useRef(null)
  const timeRef = useRef(0)
 
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
 
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)
 
    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMouseMove)
 
    // Orb config — deep dark aurora palette
    const ORBS = [
      { x: 0.2, y: 0.3, r: 0.35, color: "139,92,246", speed: 0.0003, ox: 0.12, oy: 0.08 },   // violet
      { x: 0.7, y: 0.2, r: 0.30, color: "236,72,153", speed: 0.0004, ox: 0.10, oy: 0.14 },    // pink
      { x: 0.5, y: 0.7, r: 0.38, color: "59,130,246", speed: 0.00025, ox: 0.15, oy: 0.09 },   // blue
      { x: 0.85, y: 0.6, r: 0.28, color: "168,85,247", speed: 0.00035, ox: 0.08, oy: 0.12 },  // purple
      { x: 0.1, y: 0.8, r: 0.25, color: "236,72,153", speed: 0.0005, ox: 0.11, oy: 0.07 },    // pink
    ]
 
    // Particles
    const PARTICLES = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.05,
      color: ["236,72,153", "168,85,247", "59,130,246", "139,92,246"][Math.floor(Math.random() * 4)],
    }))
 
    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const t = timeRef.current
      const mouse = mouseRef.current
 
      ctx.clearRect(0, 0, W, H)
 
      // Deep base
      ctx.fillStyle = "#030712"
      ctx.fillRect(0, 0, W, H)
 
      // Subtle grid
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.018)"
      ctx.lineWidth = 1
      const gridSize = 60
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      ctx.restore()
 
      // Aurora orbs
      ORBS.forEach((orb, i) => {
        const px = orb.x + Math.sin(t * orb.speed * 1000 + i * 1.3) * orb.ox
        const py = orb.y + Math.cos(t * orb.speed * 1000 + i * 0.9) * orb.oy
 
        // Mouse attraction
        const mx = mouse.x / W
        const my = mouse.y / H
        const dx = mx - px
        const dy = my - py
        const dist = Math.sqrt(dx * dx + dy * dy)
        const attract = dist < 0.3 ? (0.3 - dist) / 0.3 * 0.04 : 0
 
        const finalX = (px + dx * attract) * W
        const finalY = (py + dy * attract) * H
        const radius = orb.r * Math.min(W, H) * (1 + attract * 0.3)
 
        const grad = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, radius)
        grad.addColorStop(0, `rgba(${orb.color},0.18)`)
        grad.addColorStop(0.4, `rgba(${orb.color},0.07)`)
        grad.addColorStop(1, `rgba(${orb.color},0)`)
 
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      })
 
      // Mouse spotlight
      if (mouse.x > 0) {
        const spotGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200)
        spotGrad.addColorStop(0, "rgba(236,72,153,0.07)")
        spotGrad.addColorStop(0.5, "rgba(168,85,247,0.03)")
        spotGrad.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = spotGrad
        ctx.fillRect(0, 0, W, H)
 
        // Mouse ring
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(236,72,153,0.5)"
        ctx.fill()
 
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(236,72,153,0.2)"
        ctx.lineWidth = 1
        ctx.stroke()
 
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 36, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(168,85,247,0.1)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
 
      // Particles
      PARTICLES.forEach(p => {
        const px = p.x * W
        const py = p.y * H
        const mx = mouse.x
        const my = mouse.y
        const dx = mx - px
        const dy = my - py
        const dist = Math.sqrt(dx * dx + dy * dy)
 
        if (dist < 150) {
          const f = (150 - dist) / 150 * 0.0006
          p.vx += dx * f
          p.vy += dy * f
        }
 
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 0.0008) { p.vx *= 0.92; p.vy *= 0.92 }
 
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0
 
        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`
        ctx.fill()
      })
 
      // Particle connections near mouse
      PARTICLES.forEach((a, i) => {
        PARTICLES.slice(i + 1, i + 8).forEach(b => {
          const dx = (a.x - b.x) * W
          const dy = (a.y - b.y) * H
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            const mx = (a.x + b.x) / 2 * W - mouse.x
            const my = (a.y + b.y) / 2 * H - mouse.y
            const mdist = Math.sqrt(mx * mx + my * my)
            if (mdist < 200) {
              ctx.beginPath()
              ctx.moveTo(a.x * W, a.y * H)
              ctx.lineTo(b.x * W, b.y * H)
              ctx.strokeStyle = `rgba(236,72,153,${0.12 * (1 - dist / 80) * (1 - mdist / 200)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })
 
      // Noise vignette
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85)
      vignette.addColorStop(0, "rgba(0,0,0,0)")
      vignette.addColorStop(1, "rgba(0,0,0,0.55)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, W, H)
 
      timeRef.current += 16
      animRef.current = requestAnimationFrame(draw)
    }
 
    draw()
 
    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])
 
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 1,
      }}
    />
  )
}
 