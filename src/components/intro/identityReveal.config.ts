export interface RevealWindow {
  /** Scroll progress (0-1) at which this element starts fading in. */
  start: number
  /** Scroll progress (0-1) at which this element reaches full opacity. */
  end: number
  /**
   * Total upward drift (px) applied across the FULL 0-1 scroll range (not
   * just this element's own start/end window) — this is what gives the
   * text "its own subtle depth", distinct from its fade-in timing. Small
   * on purpose: identity should feel like part of the scene, not a city
   * layer.
   */
  depthPx: number
}

/**
 * When each piece of identity reveals relative to the master scroll
 * progress, and how much it drifts. Mirrors cityLayers.config.ts's
 * motionRange/opacityRange split, tuned so identity reads roughly as:
 * 0% barely there -> ~35% logo readable -> ~55% symposium title rising ->
 * ~85% fully composed. Nudge `start`/`end` to retime a piece; nudge
 * `depthPx` to change how much it moves.
 */
export const identityReveal = {
  logo: { start: 0.03, end: 0.32, depthPx: 16 } satisfies RevealWindow,
  name: { start: 0.12, end: 0.4, depthPx: 22 } satisfies RevealWindow,
  symposium: { start: 0.42, end: 0.7, depthPx: 28 } satisfies RevealWindow,
  info: { start: 0.62, end: 0.88, depthPx: 18 } satisfies RevealWindow,
}
