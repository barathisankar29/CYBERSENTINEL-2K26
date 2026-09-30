/**
 * CyberSentinel 2K26 dates — drives the hero countdown (SymposiumCountdown).
 *
 * The symposium runs on 14 and 15 October 2026. No official opening time is
 * confirmed, so the countdown targets the start of Day 1 (midnight IST). If
 * an opening time is announced, change `startsAt` (keep the +05:30 offset).
 */
export const SYMPOSIUM_SCHEDULE = {
  startsAt: '2026-10-14T00:00:00+05:30',
  /** End of Day 2 — after this the countdown card hides itself. */
  endsAt: '2026-10-16T00:00:00+05:30',
  datesLabel: 'OCT 14 & 15 · 2026',
} as const
