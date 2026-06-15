"use client"

import * as React from "react"

type ParticlesProps = {
  className?: string
  density?: number
  connect?: boolean
}

export function Particles({ className, density = 46, connect = true }: ParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    let raf = 0

    const getColor = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim() || "#d9b84d"

    let stroke = getColor()

    type P = { x: number; y: number; vx: number; vy: number; r: number }
    const particles: P[] = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }))

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      stroke = getColor()
    }
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = stroke
        ctx.globalAlpha = 0.6
        ctx.fill()
      }
      if (connect) {
        ctx.globalAlpha = 1
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i]
            const b = particles[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.hypot(dx, dy)
            if (dist < 120) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = stroke
              ctx.globalAlpha = (1 - dist / 120) * 0.16
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [density, connect])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  )
}
