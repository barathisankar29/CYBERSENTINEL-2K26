export interface LayerRange {
  from: number
  to: number
}

export interface LayerMotion {
  /** Vertical travel in vh. Negative moves up. */
  translateY: LayerRange
  /** Horizontal travel in vw. Negative moves left. */
  translateX?: LayerRange
  /** Uniform scale. */
  scale?: LayerRange
  /** Opacity. Defaults to { from: 0, to: 1 } when omitted. */
  opacity?: LayerRange
}

/** A window of the master scroll progress (0-1) a layer's motion is remapped across. */
export interface ProgressWindow {
  start: number
  end: number
}

export type LayerAnchor = 'fill' | 'bottom'

export interface CityLayerConfig {
  id: string
  src: string
  /** Paint order, back to front. */
  zIndex: number
  /** 'fill' covers the whole scene; 'bottom' hugs the bottom edge (for glow/foreground haze). */
  anchor: LayerAnchor
  objectPosition: string
  /**
   * translateY/translateX/scale/opacity are all driven by the SAME master
   * scroll progress (0-1 across the whole intro scroll region), each
   * remapped through its own window below — there is no autoplay/timer
   * anywhere in this file. `from` is this layer's position/opacity at the
   * start of its window; `to` is its position/opacity at the end.
   */
  desktop: LayerMotion
  mobile: LayerMotion
  /** Scroll-progress window (0-1) that translateY/translateX/scale are remapped across. */
  motionRange: ProgressWindow
  /**
   * Scroll-progress window (0-1) opacity is remapped across. Defaults to
   * `motionRange`. Split out because a few layers (sky especially) should
   * become visible earlier/faster than they finish *moving* — e.g. sky
   * fades in quickly but keeps a hair of drift for the whole scroll.
   */
  opacityRange?: ProgressWindow
}

/**
 * Per-layer scroll-parallax tuning for the cinematic city reveal. Every
 * layer is a pure function of the master scroll progress (see
 * CityScene.tsx's `useScrollProgress`) — nothing here plays on its own.
 *
 * `from`/`to` in `desktop`/`mobile` set how far this layer travels (small
 * distances — this is depth parallax, not a slide). `motionRange`/
 * `opacityRange` set WHEN across the overall scroll that travel happens,
 * which is what creates the cascade: distant-skyline's window starts first
 * and is narrowest (slow, resolves early), foreground-glow's starts latest
 * (the final atmospheric touch). Widening a `from`/`to` gap makes that
 * layer's parallax stronger; shifting a window's `start`/`end` changes when
 * it's active relative to the other layers.
 */
export const cityLayers: CityLayerConfig[] = [
  {
    id: 'sky',
    src: '/assets/city/city-bg-sky.png',
    zIndex: 1,
    anchor: 'fill',
    objectPosition: 'center top',
    // Essentially fixed — the brief's lowest-multiplier layer. A hair of
    // drift/scale across the ENTIRE scroll (never fully still, never
    // dramatic), but opacity resolves early so it reads as "already there,
    // barely visible" at the very top rather than hidden.
    desktop: { translateY: { from: 0, to: -2 }, scale: { from: 1, to: 1.02 }, opacity: { from: 0.3, to: 1 } },
    mobile: { translateY: { from: 0, to: -1.5 }, scale: { from: 1, to: 1.015 }, opacity: { from: 0.3, to: 1 } },
    motionRange: { start: 0, end: 1 },
    opacityRange: { start: 0, end: 0.35 },
  },
  {
    id: 'distant-skyline',
    src: '/assets/city/city-distant-skyline.png',
    zIndex: 2,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Slow, low-multiplier reveal — a bare hint at scroll 0, resolved fairly early.
    desktop: { translateY: { from: 9, to: 0 }, opacity: { from: 0.06, to: 1 } },
    mobile: { translateY: { from: 12, to: 0 }, scale: { from: 1.05, to: 1.08 }, opacity: { from: 0.06, to: 1 } },
    motionRange: { start: 0, end: 0.55 },
    opacityRange: { start: 0, end: 0.5 },
  },
  {
    id: 'midground',
    src: '/assets/city/city-midground.png',
    zIndex: 3,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Moderate multiplier, starts a beat after distant-skyline.
    desktop: { translateY: { from: 20, to: 0 }, opacity: { from: 0.04, to: 1 } },
    mobile: { translateY: { from: 24, to: 0 }, scale: { from: 1.06, to: 1.1 }, opacity: { from: 0.04, to: 1 } },
    motionRange: { start: 0.08, end: 0.68 },
    opacityRange: { start: 0.05, end: 0.6 },
  },
  {
    id: 'bridges',
    src: '/assets/city/city-bridges.png',
    zIndex: 4,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Independent diagonal drift (vertical + horizontal together) so it
    // reads as spatial, not just another layer at a slightly different speed.
    desktop: { translateY: { from: 7, to: 0 }, translateX: { from: 4, to: 0 }, opacity: { from: 0.05, to: 1 } },
    mobile: { translateY: { from: 8, to: 0 }, translateX: { from: 2, to: 0 }, opacity: { from: 0.05, to: 1 } },
    motionRange: { start: 0.12, end: 0.75 },
    opacityRange: { start: 0.08, end: 0.65 },
  },
  {
    id: 'light-trails',
    src: '/assets/city/city-light-trails.png',
    zIndex: 5,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Reads mainly as "lights turning on" (a fade), with only a light
    // horizontal/diagonal drift alongside it.
    desktop: { translateY: { from: 3, to: 0 }, translateX: { from: -6, to: 0 }, opacity: { from: 0.03, to: 1 } },
    mobile: { translateY: { from: 3, to: 0 }, translateX: { from: -4, to: 0 }, opacity: { from: 0.03, to: 1 } },
    motionRange: { start: 0.05, end: 0.6 },
    opacityRange: { start: 0.02, end: 0.55 },
  },
  {
    id: 'foreground',
    src: '/assets/city/city-foreground.png',
    zIndex: 6,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Highest multiplier of the structural layers, mostly from the bottom
    // edge, and the latest of the "structure" layers to resolve.
    desktop: { translateY: { from: 36, to: 0 }, opacity: { from: 0.04, to: 1 } },
    mobile: { translateY: { from: 42, to: 0 }, scale: { from: 1.08, to: 1.12 }, opacity: { from: 0.04, to: 1 } },
    motionRange: { start: 0.2, end: 0.85 },
    opacityRange: { start: 0.1, end: 0.75 },
  },
  {
    id: 'foreground-glow',
    src: '/assets/city/city-foreground-glow.png',
    zIndex: 7,
    // Bottom-anchored so it always hugs the bottom edge regardless of travel.
    anchor: 'bottom',
    objectPosition: 'center bottom',
    // Final atmospheric touch — the last thing to resolve.
    desktop: { translateY: { from: 10, to: 0 }, opacity: { from: 0.05, to: 1 } },
    mobile: { translateY: { from: 11, to: 0 }, opacity: { from: 0.05, to: 1 } },
    motionRange: { start: 0.3, end: 0.95 },
    opacityRange: { start: 0.15, end: 0.85 },
  },
]
