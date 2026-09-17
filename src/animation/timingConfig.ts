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
  { key: 'skyVisible', at: 0.8 }, // boot hold before the sky starts fading in
  { key: 'cityVisible', at: 1.1 }, // city layers begin their establish transition
  { key: 'logoVisible', at: 1.7 }, // college logo fades/scales in
  { key: 'nameVisible', at: 2.3 }, // college name fades in
  { key: 'symposiumVisible', at: 3.15 }, // symposium name fades in
  { key: 'infoVisible', at: 4.0 }, // supporting info fades in (if any is provided)
  { key: 'settled', at: 5.6 }, // sequence complete; scroll unlocks
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
