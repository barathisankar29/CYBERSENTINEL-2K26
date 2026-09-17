/**
 * Central easing constants + forward-looking timing placeholders.
 *
 * The intro/city reveal itself is scroll-progress-driven (see
 * cityLayers.config.ts and identityReveal.config.ts), not timer-based, so
 * there is deliberately no autoplay schedule here — scroll is the only
 * animation driver for that sequence.
 */

export const easing = {
  standard: [0.16, 1, 0.3, 1],
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const

/**
 * Duration (seconds) reserved for the future camera-to-aerial transition
 * once navigation buildings exist. Not consumed yet — see ARCHITECTURE.md
 * §6 and cameraTransitions.ts.
 */
export const cameraToAerial = 2.4
