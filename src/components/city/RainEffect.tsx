import { memo, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { getDevicePerfInfo } from '@/utils/devicePerf'
import './RainEffect.css'

/**
 * Two quality tiers. Devices flagged by devicePerf (phones, low-RAM /
 * low-core machines, data saver) start on LOW: devicePerf's own drop cap,
 * density and canvas DPR, plus a 30fps cap (rain streaks read identically
 * at 30fps). Everything else starts on HIGH and drops to LOW by itself if
 * it can't actually hold the frame rate. Density is drops per 10,000 CSS
 * px² of canvas, so a phone draws far fewer streaks than a wide desktop.
 */
interface QualitySettings {
  density: number
  maxDrops: number
  maxDpr: number
  frameMs: number
}
type Quality = 'high' | 'low'

const HIGH_QUALITY: QualitySettings = { density: 1.6, maxDrops: 420, maxDpr: 1.25, frameMs: 0 }
const LOW_FRAME_MS = 1000 / 30

// Adaptive downgrade: if the average frame gap over this many frames is
// above SLOW_FRAME_MS (i.e. well under ~45fps), switch HIGH -> LOW.
const SAMPLE_FRAMES = 90
const SLOW_FRAME_MS = 22
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
 * visible. It starts once the browser is idle (never competing with the
 * first paint), runs at a device-appropriate quality and frame rate (see
 * settings) and steps itself down if frames run slow. Off entirely under
 * prefers-reduced-motion.
 */
export const RainEffect = memo(function RainEffect({ zIndex }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const perf = getDevicePerfInfo()
    const settings: Record<Quality, QualitySettings> = {
      high: HIGH_QUALITY,
      low: {
        density: Math.min(perf.rainDensity, 0.9),
        maxDrops: Math.min(perf.rainDropCap, 170),
        maxDpr: Math.min(perf.dprCap, 1),
        frameMs: LOW_FRAME_MS,
      },
    }
    let quality: Quality = perf.isLowRam || perf.isMobile ? 'low' : 'high'
    const strikeInterval = perf.isLowRam ? 6500 : STRIKE_INTERVAL

    let width = 0
    let height = 0
    const drops: Drop[] = []
    let frame = 0
    let last = 0
    let inView = false
    let ready = false
    let sampleCount = 0
    let sampleTotal = 0
    // Time since the last strike, advanced only while animating.
    let sinceStrike = strikeInterval - 1500
    let bolt: number[][] = []

    const fitDrops = () => {
      const { density, maxDrops } = settings[quality]
      const count = Math.min(maxDrops, Math.round(((width * height) / 10000) * density))
      if (drops.length > count) drops.length = count
      while (drops.length < count) drops.push(createDrop(width, height, true))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, settings[quality].maxDpr)
      const nextWidth = Math.round(rect.width * dpr)
      const nextHeight = Math.round(rect.height * dpr)
      // Skip no-op resizes (e.g. observer firing on scroll) — reallocating
      // the canvas bitmap is the expensive part.
      if (nextWidth === canvas.width && nextHeight === canvas.height && drops.length) return
      width = rect.width
      height = rect.height
      canvas.width = nextWidth
      canvas.height = nextHeight
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const drop of drops) {
        if (drop.y > height || drop.x > width + height * SLANT) Object.assign(drop, createDrop(width, height, true))
      }
      fitDrops()
    }

    const downgrade = () => {
      if (quality === 'low') return
      quality = 'low'
      resize()
      fitDrops()
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
      frame = requestAnimationFrame(tick)
      const { frameMs } = settings[quality]
      // Frame cap on LOW: skip rAF callbacks until a full frame slot has passed.
      if (frameMs && now - last < frameMs - 2) return

      const gap = now - last
      last = now
      // Clamp the step so returning from a background tab doesn't teleport drops.
      const ms = Math.min(gap, 50)
      const dt = ms / 1000

      if (quality === 'high' && sampleCount < SAMPLE_FRAMES && gap < 100) {
        sampleTotal += gap
        if (++sampleCount === SAMPLE_FRAMES && sampleTotal / SAMPLE_FRAMES > SLOW_FRAME_MS) downgrade()
      }

      sinceStrike += ms
      if (sinceStrike >= strikeInterval) {
        sinceStrike = 0
        bolt = createBolt(width, height)
        if (!perf.isLowRam) {
          thunder.play(0.25 + Math.random() * 0.35)
        }
      }

      ctx.clearRect(0, 0, width, height)

      const flash = flashIntensity(sinceStrike)
      // Skip full canvas fill on low-RAM phones to prevent GPU fill-rate exhaustion
      if (flash > 0 && !perf.isLowRam) {
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
    }

    const start = () => {
      if (frame || !ready || !inView || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    let resizeFrame = 0
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(resize)
    })
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    const onVisibility = () => (document.hidden ? stop() : start())

    // Hold the first frame until the browser is idle, so the hero's own
    // images and first paint always win.
    const begin = () => {
      ready = true
      resize()
      resizeObserver.observe(canvas)
      start()
    }
    const idleId =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(begin, { timeout: 1500 })
        : window.setTimeout(begin, 600)

    intersectionObserver.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    for (const type of GESTURES) window.addEventListener(type, thunder.unlock, { passive: true })

    return () => {
      stop()
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
      cancelAnimationFrame(resizeFrame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      for (const type of GESTURES) window.removeEventListener(type, thunder.unlock)
    }
  }, [reducedMotion])

  if (reducedMotion) return null
  return <canvas ref={canvasRef} className="rain-effect" style={{ zIndex }} aria-hidden="true" />
})
