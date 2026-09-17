/**
 * Central timing/easing constants for the intro sequence and camera
 * transitions. Keeping these here (rather than inline in components) is
 * what lets us retune pacing without rewriting animation logic — see
 * ARCHITECTURE.md.
 *
 * Values are placeholders in seconds; tune once the intro sequence is built.
 */
export const introTiming = {
  loadingMin: 0.8,
  logoReveal: 1.2,
  collegeIdentity: 1.4,
  cityRise: 2.2,
  symposiumReveal: 1.4,
  supportingInfo: 1.0,
  identityExit: 1.0,
  cameraToAerial: 2.4,
} as const

export const easing = {
  standard: [0.16, 1, 0.3, 1],
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const
