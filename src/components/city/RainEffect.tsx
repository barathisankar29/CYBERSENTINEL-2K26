import { memo, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/animation/useReducedMotion'
import './RainEffect.css'

// Drops per 10,000 CSS px² of canvas — scales with the section's size, so a
// phone draws far fewer streaks than a wide desktop.
const DENSITY = 1.9
const MAX_DROPS = 520
// Rendering above 1.5x is invisible on thin streaks but costs fill rate.
const MAX_DPR = 1.5
// Slight wind slant: horizontal px per vertical px.
const SLANT = 0.18

// Lightning: one strike every STRIKE_INTERVAL ms while the section is on screen.
const STRIKE_INTERVAL = 4000
const FLASH_MS = 450
const BOLT_MS = 180
// Thunder peak gain — kept low so it sits under the page, not over it.
const THUNDER_VOLUME = 0.14

interface Drop {
  x: number
  y: number
  len: number
  speed: number // px per second
}

function createDrop(width: number, height: number, anywhere: boolean): Drop {
  const depth = Math.random() // 0 = far, 1 = near
  return {
    x: Math.random() * (width + height * SLANT),
    y: anywhere ? Math.random() * height : -Math.random() * height * 0.2,
    len: 10 + depth * 18,
    speed: 700 + depth * 700,
  }
}

/** A jagged bolt from the top edge down to ~40-65% of the height, plus one short fork. */
function createBolt(width: number, height: number): number[][] {
  const paths: number[][] = []
  const main: number[] = []
  let x = width * (0.15 + Math.random() * 0.7)
  let y = 0
  const end = height * (0.4 + Math.random() * 0.25)
  const step = height / 22
  main.push(x, y)
  while (y < end) {
    x += (Math.random() - 0.5) * step * 1.6
    y += step * (0.6 + Math.random() * 0.6)
    main.push(x, y)
  }
  paths.push(main)
  const forkAt = 2 * (2 + Math.floor(Math.random() * (main.length / 2 - 3)))
  let fx = main[forkAt]
  let fy = main[forkAt + 1]
  const fork = [fx, fy]
  const dir = Math.random() < 0.5 ? -1 : 1
  for (let i = 0; i < 5; i++) {
    fx += dir * step * (0.4 + Math.random() * 0.8)
    fy += step * (0.5 + Math.random() * 0.5)
    fork.push(fx, fy)
  }
  paths.push(fork)
  return paths
}

/** Sky-flash brightness 0..1 for `t` ms after a strike — a quick double flicker. */
function flashIntensity(t: number): number {
  if (t < 0 || t > FLASH_MS) return 0
  if (t < 60) return 1 - t / 60
  if (t < 110) return 0
  if (t < 170) return 0.7
  return 0.7 * (1 - (t - 170) / (FLASH_MS - 170))
}

/**
 * Low rumbling thunder, synthesised — no audio file to download. One brown
 * noise buffer is generated once and replayed through a sweeping lowpass.
 * Browsers only allow audio after a user gesture (click / tap / key), so the
 * context is created on the first one; until then strikes are silent.
 */
class Thunder {
  private ctx: AudioContext | null = null
  private noise: AudioBuffer | null = null

  unlock = () => {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const length = Math.floor(ctx.sampleRate * 3)
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
      data[i] = last * 3.5
    }
    this.ctx = ctx
    this.noise = buffer
  }

  play(delaySeconds: number) {
    const { ctx, noise } = this
    if (!ctx || !noise || ctx.state !== 'running') return
    const t = ctx.currentTime + delaySeconds
    const source = ctx.createBufferSource()
    source.buffer = noise
    source.playbackRate.value = 0.8 + Math.random() * 0.3
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900, t)
    filter.frequency.exponentialRampToValueAtTime(140, t + 2.2)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(THUNDER_VOLUME, t + 0.08)
    gain.gain.exponentialRampToValueAtTime(THUNDER_VOLUME * 0.45, t + 0.6)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.6)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(t)
    source.stop(t + 2.7)
  }

}

// Shared by every rain section (hero + buildings) — one AudioContext for the page.
const thunder = new Thunder()

const GESTURES = ['pointerdown', 'keydown', 'touchstart'] as const

interface RainEffectProps {
  zIndex: number
}

/**
 * Canvas rain + lightning over the buildings section. One canvas, one
 * stroke for all drops per frame, and the loop (strikes and thunder
 * included) only runs while the section is on screen and the tab is
 * visible. Off entirely under prefers-reduced-motion.
 */
export const RainEffect = memo(function RainEffect({ zIndex }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let drops: Drop[] = []
    let frame = 0
    let last = 0
    let inView = false
    // Time since the last strike, advanced only while animating.
    let sinceStrike = STRIKE_INTERVAL - 1500
    let bolt: number[][] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const count = Math.min(MAX_DROPS, Math.round(((width * height) / 10000) * DENSITY))
      drops = Array.from({ length: count }, () => createDrop(width, height, true))
    }

    const drawBolt = (alpha: number) => {
      ctx.beginPath()
      for (const path of bolt) {
        ctx.moveTo(path[0], path[1])
        for (let i = 2; i < path.length; i += 2) ctx.lineTo(path[i], path[i + 1])
      }
      // Wide faint pass for glow, then a thin bright core — cheaper than shadowBlur.
      ctx.strokeStyle = `rgba(150, 190, 255, ${0.25 * alpha})`
      ctx.lineWidth = 6
      ctx.stroke()
      ctx.strokeStyle = `rgba(235, 245, 255, ${0.9 * alpha})`
      ctx.lineWidth = 1.6
      ctx.stroke()
    }

    const tick = (now: number) => {
      const ms = Math.min(now - last, 50)
      // Clamp the step so returning from a background tab doesn't teleport drops.
      const dt = ms / 1000
      last = now
      sinceStrike += ms
      if (sinceStrike >= STRIKE_INTERVAL) {
        sinceStrike = 0
        bolt = createBolt(width, height)
        thunder.play(0.25 + Math.random() * 0.35)
      }

      ctx.clearRect(0, 0, width, height)

      const flash = flashIntensity(sinceStrike)
      if (flash > 0) {
        ctx.fillStyle = `rgba(190, 210, 255, ${0.16 * flash})`
        ctx.fillRect(0, 0, width, height)
      }
      if (sinceStrike < BOLT_MS) drawBolt(Math.max(flash, 0.35))

      ctx.beginPath()
      for (const drop of drops) {
        drop.y += drop.speed * dt
        drop.x -= drop.speed * dt * SLANT
        if (drop.y - drop.len > height) Object.assign(drop, createDrop(width, height, false))
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x + drop.len * SLANT, drop.y - drop.len)
      }
      ctx.strokeStyle = `rgba(170, 210, 255, ${0.32 + 0.3 * flash})`
      ctx.lineWidth = 1
      ctx.stroke()

      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame || !inView || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    intersectionObserver.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    for (const type of GESTURES) window.addEventListener(type, thunder.unlock, { passive: true })

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      for (const type of GESTURES) window.removeEventListener(type, thunder.unlock)
    }
  }, [reducedMotion])

  if (reducedMotion) return null
  return <canvas ref={canvasRef} className="rain-effect" style={{ zIndex }} aria-hidden="true" />
})
