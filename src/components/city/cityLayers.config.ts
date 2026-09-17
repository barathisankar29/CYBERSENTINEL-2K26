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
   * Establish motion: how this layer travels from hidden (`from`) to resting
   * (`to`, normally 0) during the boot sequence. Driven by a CSS transition
   * (see CityLayer.tsx), not scroll — triggered once when `established`
   * flips true.
   */
  desktop: LayerMotion
  mobile: LayerMotion
  /** CSS transition duration for the establish motion, in ms. */
  establishDurationMs: number
  /** CSS transition delay for the establish motion, in ms — staggers layers relative to each other. */
  establishDelayMs: number
  /**
   * Optional small continued motion once the user starts scrolling *after*
   * the intro has settled (Category C in the brief). Deliberately modest —
   * the big reveal already happened during establish; this is just enough
   * to keep depth alive as the camera begins moving toward the future
   * aerial view. Omit entirely for layers that should stay still post-intro
   * (e.g. foreground-glow).
   */
  scrollParallax?: { desktop: LayerMotion; mobile: LayerMotion }
}

/**
 * Per-layer parallax tuning for the cinematic city reveal.
 *
 * `from` is the resting offset before establishing (city hidden/tucked
 * toward the bottom edge); `to` is the offset once established (normally
 * 0 — flush/resting). Widen the gap between `from` and `to` for a
 * stronger reveal on that layer, narrow it for a subtler one. `zIndex`
 * controls stacking (back to front), independent of motion.
 *
 * `establishDelayMs` is deliberately spread across several seconds (not
 * clustered) so the layers cascade in slowly and overlap one another —
 * distant-skyline starts first, foreground-glow last — rather than
 * everything appearing within the same half-second. `establishDurationMs`
 * is long per layer (2.8-3.8s) for the same reason: small distance, long
 * duration reads as "emerging," not "sliding into place."
 */
export const cityLayers: CityLayerConfig[] = [
  {
    id: 'sky',
    src: '/assets/city/city-bg-sky.png',
    zIndex: 1,
    anchor: 'fill',
    objectPosition: 'center top',
    // Essentially fixed: only a hair of drift/scale so the upper sky reads as
    // stable, and — per the brief — this is the ONLY motion sky ever gets.
    // It intentionally has no scrollParallax: once established it stays put.
    desktop: { translateY: { from: 0, to: -1.5 }, scale: { from: 1, to: 1.015 } },
    mobile: { translateY: { from: 0, to: -1 }, scale: { from: 1, to: 1.01 } },
    establishDurationMs: 3000,
    establishDelayMs: 0,
  },
  {
    id: 'distant-skyline',
    src: '/assets/city/city-distant-skyline.png',
    zIndex: 2,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Slow upward reveal from below the frame, settling flush.
    desktop: { translateY: { from: 9, to: 0 } },
    mobile: { translateY: { from: 12, to: 0 }, scale: { from: 1.05, to: 1.08 } },
    establishDurationMs: 3400,
    establishDelayMs: 0,
    scrollParallax: {
      desktop: { translateY: { from: 0, to: -1.5 } },
      mobile: { translateY: { from: 0, to: -1 } },
    },
  },
  {
    id: 'midground',
    src: '/assets/city/city-midground.png',
    zIndex: 3,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Slightly stronger reveal than distant-skyline.
    desktop: { translateY: { from: 20, to: 0 } },
    mobile: { translateY: { from: 24, to: 0 }, scale: { from: 1.06, to: 1.1 } },
    establishDurationMs: 3600,
    establishDelayMs: 700,
    scrollParallax: {
      desktop: { translateY: { from: 0, to: -3 } },
      mobile: { translateY: { from: 0, to: -2 } },
    },
  },
  {
    id: 'bridges',
    src: '/assets/city/city-bridges.png',
    zIndex: 4,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Independent diagonal drift (vertical + horizontal together) so it
    // reads as spatial, not just another layer sliding up.
    desktop: { translateY: { from: 7, to: 0 }, translateX: { from: 4, to: 0 } },
    mobile: { translateY: { from: 8, to: 0 }, translateX: { from: 2, to: 0 } },
    establishDurationMs: 3000,
    establishDelayMs: 2400,
    scrollParallax: {
      desktop: { translateY: { from: 0, to: -2 }, translateX: { from: 0, to: -1.5 } },
      mobile: { translateY: { from: 0, to: -1.5 }, translateX: { from: 0, to: -1 } },
    },
  },
  {
    id: 'light-trails',
    src: '/assets/city/city-light-trails.png',
    zIndex: 5,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Reads mainly as a fade/activate (it's "lights turning on"), with only
    // a light horizontal/diagonal drift alongside the fade.
    desktop: { translateY: { from: 3, to: 0 }, translateX: { from: -6, to: 0 } },
    mobile: { translateY: { from: 3, to: 0 }, translateX: { from: -4, to: 0 } },
    establishDurationMs: 3000,
    establishDelayMs: 500,
    scrollParallax: {
      desktop: { translateY: { from: 0, to: -1 }, translateX: { from: 0, to: 3 } },
      mobile: { translateY: { from: 0, to: -1 }, translateX: { from: 0, to: 2 } },
    },
  },
  {
    id: 'foreground',
    src: '/assets/city/city-foreground.png',
    zIndex: 6,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Strongest rise of the "structure" layers, mostly from the bottom edge.
    desktop: { translateY: { from: 36, to: 0 } },
    mobile: { translateY: { from: 42, to: 0 }, scale: { from: 1.08, to: 1.12 } },
    establishDurationMs: 3800,
    establishDelayMs: 2000,
    scrollParallax: {
      desktop: { translateY: { from: 0, to: -4 } },
      mobile: { translateY: { from: 0, to: -3 } },
    },
  },
  {
    id: 'foreground-glow',
    src: '/assets/city/city-foreground-glow.png',
    zIndex: 7,
    // Bottom-anchored so it always hugs the bottom edge regardless of travel.
    anchor: 'bottom',
    objectPosition: 'center bottom',
    // Final atmospheric touch — establishes last, no continued scroll motion.
    desktop: { translateY: { from: 10, to: 0 } },
    mobile: { translateY: { from: 11, to: 0 } },
    establishDurationMs: 2800,
    establishDelayMs: 3200,
  },
]
