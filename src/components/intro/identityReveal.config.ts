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

/** A reveal that fades IN then back OUT — for the transient intro taglines (Stage 2/3). */
export interface StageRevealWindow {
  fadeInStart: number
  fadeInEnd: number
  fadeOutStart: number
  fadeOutEnd: number
  depthPx: number
}

/**
 * When each piece of identity reveals relative to the master scroll
 * progress, and how much it drifts.
 *
 * IMPORTANT: none of these have a nonzero opacity floor — every one is
 * exactly invisible at progress=0 (start > 0 for all), per the brief: the
 * hero must start from true darkness, not "faintly visible." Compare to
 * cityLayers.config.ts, where a few background layers DO get a small
 * baseline opacity — that's intentional atmosphere ("stars, faint sky,
 * extremely subtle city hints" are allowed to already exist); the identity
 * elements here are not.
 *
 * Staged order: 0-13% dark -> 13-32% tagline 1 -> 28-48% tagline 2 ->
 * 46-56% department -> 54-63% "in association with" -> 61-68% "Presents" ->
 * 56-75% branding strip -> 72-90% CyberSentinel logo -> 85-98% supporting
 * info. Windows overlap deliberately for a smooth crossfade between stages
 * rather than a hard cut. Nudge `start`/`end` to retime a piece; nudge
 * `depthPx` to change how much it moves.
 */
export const identityReveal = {
  brandingStrip: { start: 0.56, end: 0.75, depthPx: 8 } satisfies RevealWindow,
  department: { start: 0.46, end: 0.56, depthPx: 16 } satisfies RevealWindow,
  presentedBy: { start: 0.54, end: 0.63, depthPx: 14 } satisfies RevealWindow,
  presents: { start: 0.61, end: 0.68, depthPx: 10 } satisfies RevealWindow,
  symposium: { start: 0.72, end: 0.9, depthPx: 28 } satisfies RevealWindow,
  info: { start: 0.85, end: 0.98, depthPx: 18 } satisfies RevealWindow,
  // Hero Register Now CTA (see IdentityLayer.tsx) — follows the
  // CyberSentinel identity so it lands last, just before the hero hands off.
  registerCta: { start: 0.88, end: 0.97, depthPx: 18 } satisfies RevealWindow,
}

/**
 * The two transient "atmospheric storytelling" taglines (Stage 2/3) — each
 * fades in, holds, then fades back out before the next stage takes over.
 * They share the same centered screen position as everything else, so
 * overlap is handled by their own fade envelopes rather than layout.
 */
export const introTaglines: { id: string; text: string; window: StageRevealWindow }[] = [
  {
    id: 'engineering-the-future',
    text: 'ENGINEERING THE FUTURE',
    window: { fadeInStart: 0.13, fadeInEnd: 0.2, fadeOutStart: 0.26, fadeOutEnd: 0.32, depthPx: 14 },
  },
  {
    id: 'ideas-become-innovation',
    text: 'WHERE IDEAS BECOME INNOVATION',
    window: { fadeInStart: 0.28, fadeInEnd: 0.36, fadeOutStart: 0.42, fadeOutEnd: 0.48, depthPx: 14 },
  },
]
