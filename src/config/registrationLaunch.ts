/**
 * Registration launch switch.
 *
 * While registration is closed, the events terminal (/events, /register,
 * /register/status, /register/team) shows the site underneath a blurred
 * "REGISTRATION OPENS SOON" overlay (RegistrationComingSoon), and nothing
 * behind it can be used.
 *
 * To open registration, either:
 *   - set `open: true` and redeploy — opens immediately; or
 *   - set `opensAt` to the launch moment (ISO 8601 WITH the IST offset,
 *     e.g. '2026-10-01T10:00:00+05:30') and redeploy — the overlay shows a
 *     live countdown and unlocks by itself at that moment, no second deploy.
 *
 * With `open: false` and `opensAt: null` the overlay
 * says "coming soon" with no countdown and stays until changed.
 */
export const REGISTRATION_LAUNCH: { open: boolean; opensAt: string | null } = {
  open: true,
  opensAt: null,
}

/** The configured launch moment, or null if none (or unparseable). */
export function registrationOpensAt(): Date | null {
  if (!REGISTRATION_LAUNCH.opensAt) return null
  const date = new Date(REGISTRATION_LAUNCH.opensAt)
  return Number.isNaN(date.getTime()) ? null : date
}

export function isRegistrationOpen(now: number = Date.now()): boolean {
  // Local dev server only: skip the overlay. Always false in production builds.
  if (import.meta.env.DEV) return true
  if (REGISTRATION_LAUNCH.open) return true
  const opensAt = registrationOpensAt()
  return opensAt !== null && now >= opensAt.getTime()
}
