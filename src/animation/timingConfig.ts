/**
 * Central timing/easing constants for the intro sequence and camera
 * transitions. Keeping these here (rather than inline in components) is
 * what lets us retune pacing without rewriting animation logic — see
 * ARCHITECTURE.md.
 */

/** Steps flipped by useIntroSequence, in the order they occur. */
export type IntroStep =
  | 'skyVisible'
  | 'cityVisible'
  | 'logoVisible'
  | 'nameVisible'
  | 'symposiumVisible'
  | 'infoVisible'
  | 'settled'

/**
 * The boot/establish timeline: each step flips its flag `at` seconds after
 * mount (skipped entirely under prefers-reduced-motion — see
 * useIntroSequence). This is the single place to retime the intro; nudge an
 * `at` value to reschedule that step without touching component code.
 * Each per-layer establish *duration* lives next to that layer's motion in
 * cityLayers.config.ts, since "how long/far this layer travels" and "when
 * it starts" are different knobs.
 */
export const introTimeline: { key: IntroStep; at: number }[] = [
  { key: 'skyVisible', at: 0.7 }, // boot hold before the sky starts fading in
  { key: 'cityVisible', at: 1.2 }, // distant lights/skyline begin their (slow) establish transition
  { key: 'logoVisible', at: 2.0 }, // college logo begins its slow fade+scale
  { key: 'nameVisible', at: 2.9 }, // college name begins its slow fade — city is still establishing underneath
  { key: 'symposiumVisible', at: 4.2 }, // symposium title fades in — midground/bridges still settling
  { key: 'infoVisible', at: 5.8 }, // supporting info fades in last, alongside foreground/glow settling
  { key: 'settled', at: 7.8 }, // everything has visually resolved + a brief calm hold; scroll unlocks
]

/** Fraction of the post-settle scroll range over which the identity fades out. */
export const identityExitFraction = 0.35

/**
 * Duration (seconds) reserved for the future camera-to-aerial transition
 * once navigation buildings exist. Not consumed yet — see ARCHITECTURE.md
 * §6 and cameraTransitions.ts.
 */
export const cameraToAerial = 2.4

export const easing = {
  standard: [0.16, 1, 0.3, 1],
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const
