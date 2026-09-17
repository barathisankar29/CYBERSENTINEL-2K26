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
  /**
   * Opacity at progress=start, before this window has properly begun
   * (defaults to 0 — fully hidden). A small nonzero value reads as "barely
   * visible" at the very top rather than fully invisible, matching how the
   * city layers themselves start with a faint hint rather than nothing.
   */
  opacityFrom?: number
}

/**
 * When each piece of identity reveals relative to the master scroll
 * progress, and how much it drifts. Mirrors cityLayers.config.ts's
 * motionRange/opacityRange split, tuned so identity reads roughly as:
 * 0% barely there -> ~22% branding strip in -> ~35% college identity
 * readable -> ~55% CyberSentinel logo rising -> ~85% fully composed. Nudge
 * `start`/`end` to retime a piece; nudge `depthPx` to change how much it
 * moves. Depth is deliberately ordered brandingStrip < logo/name <
 * symposium (CyberSentinel logo) < the city's own foreground layers.
 */
export const identityReveal = {
  brandingStrip: { start: 0, end: 0.22, depthPx: 8, opacityFrom: 0.08 } satisfies RevealWindow,
  logo: { start: 0.03, end: 0.32, depthPx: 16 } satisfies RevealWindow,
  name: { start: 0.12, end: 0.4, depthPx: 22 } satisfies RevealWindow,
  symposium: { start: 0.42, end: 0.7, depthPx: 28 } satisfies RevealWindow,
  info: { start: 0.62, end: 0.88, depthPx: 18 } satisfies RevealWindow,
}
