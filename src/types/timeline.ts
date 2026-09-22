/**
 * The event timeline is presented as a futuristic metro/train system:
 * the train travels horizontally through stations representing events.
 * This is a distinct visual system from the city navigation (see
 * src/components/metro) and has its own asset tree under
 * public/assets/metro.
 */
export interface MetroStation {
  id: string
  /** Order along the track, left-to-right (or start-to-end). */
  order: number
  /** Event/timeline point name. */
  title: string
  /** Date/time label as displayed, kept as a string for flexible formatting. */
  when?: string
  description?: string
  /** Normalized position (0-1) along the track, for train stop timing. */
  trackPosition: number
}

export type DayKey = 'day1' | 'day2'

/**
 * A single schedule entry on the Timeline page's three-frame bridge world
 * — the two-day event schedule rendered as a train crossing a continuous
 * bridge spanning Frame 01 -> 02 -> 03 (see
 * src/components/timeline/TimelineJourney.tsx and ./timelineWorld.ts).
 * Distinct from MetroStation above: this drives the day1/day2 journey,
 * not the metro system.
 */
export interface TimelineEvent {
  id: string
  day: DayKey
  /** Normalized position (0-1) across the COMPLETE three-frame world (not
   * local to a single frame). Day 1 traverses these positions
   * left-to-right; Day 2 reuses the exact same coordinates right-to-left
   * — the same physical stations on the same bridge, never a second set. */
  position: number
  time: string
  title: string
  description: string
}
