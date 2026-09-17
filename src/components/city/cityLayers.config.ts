export interface LayerRange {
  from: number
  to: number
}

export interface LayerMotion {
  /** Vertical travel in vh, lerped across scroll progress 0 -> 1. Negative moves up. */
  translateY: LayerRange
  /** Horizontal travel in vw, lerped across scroll progress 0 -> 1. Negative moves left. */
  translateX?: LayerRange
  /** Uniform scale, lerped across scroll progress 0 -> 1. */
  scale?: LayerRange
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
  desktop: LayerMotion
  mobile: LayerMotion
}

/**
 * Per-layer parallax tuning for the cinematic city reveal.
 *
 * `from` is the resting offset at scroll progress 0 (composition mostly
 * sky, city tucked toward the bottom edge); `to` is the offset once fully
 * scrolled through (progress 1). Widen the gap between `from` and `to` for
 * a stronger reveal on that layer, narrow it for a subtler one — that's the
 * main knob for retuning depth/speed per layer without touching component
 * code. `zIndex` controls stacking (back to front), independent of motion.
 */
export const cityLayers: CityLayerConfig[] = [
  {
    id: 'sky',
    src: '/assets/city/city-bg-sky.png',
    zIndex: 1,
    anchor: 'fill',
    objectPosition: 'center top',
    // Essentially fixed: only a hair of drift/scale so the upper sky reads as stable.
    desktop: { translateY: { from: 0, to: -1.5 }, scale: { from: 1, to: 1.015 } },
    mobile: { translateY: { from: 0, to: -1 }, scale: { from: 1, to: 1.01 } },
  },
  {
    id: 'distant-skyline',
    src: '/assets/city/city-distant-skyline.png',
    zIndex: 2,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Slow upward reveal from below the frame, settling flush at progress 1.
    desktop: { translateY: { from: 9, to: 0 } },
    mobile: { translateY: { from: 12, to: 0 }, scale: { from: 1.05, to: 1.08 } },
  },
  {
    id: 'midground',
    src: '/assets/city/city-midground.png',
    zIndex: 3,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Moderate upward reveal, settling flush at progress 1.
    desktop: { translateY: { from: 20, to: 0 } },
    mobile: { translateY: { from: 24, to: 0 }, scale: { from: 1.06, to: 1.1 } },
  },
  {
    id: 'bridges',
    src: '/assets/city/city-bridges.png',
    zIndex: 4,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Diagonal drift (vertical + horizontal together) so it reads as spatial, not a straight rise.
    desktop: { translateY: { from: 7, to: 0 }, translateX: { from: 4, to: -3 } },
    mobile: { translateY: { from: 8, to: 0 }, translateX: { from: 2, to: -2 } },
  },
  {
    id: 'light-trails',
    src: '/assets/city/city-light-trails.png',
    zIndex: 5,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Mostly horizontal/diagonal streaking motion, minimal vertical travel.
    desktop: { translateY: { from: 3, to: 0 }, translateX: { from: -8, to: 10 } },
    mobile: { translateY: { from: 3, to: 0 }, translateX: { from: -5, to: 6 } },
  },
  {
    id: 'foreground',
    src: '/assets/city/city-foreground.png',
    zIndex: 6,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // Strongest rise of the "structure" layers, mostly from the bottom edge,
    // settling flush at progress 1.
    desktop: { translateY: { from: 36, to: 0 } },
    mobile: { translateY: { from: 42, to: 0 }, scale: { from: 1.08, to: 1.12 } },
  },
  {
    id: 'foreground-glow',
    src: '/assets/city/city-foreground-glow.png',
    zIndex: 7,
    // Bottom-anchored so it always hugs the bottom edge regardless of travel.
    anchor: 'bottom',
    objectPosition: 'center bottom',
    desktop: { translateY: { from: 10, to: 0 } },
    mobile: { translateY: { from: 11, to: 0 } },
  },
]
