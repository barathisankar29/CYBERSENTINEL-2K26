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
 * What a stop represents on the journey (all are programme stages — the
 * individual competitions live on the Events page, not the timeline):
 * - `stage`       — a programme stage (registration, sessions, day
 *                   opening/closing, cultural programme)
 * - `milestone`   — a ceremony (inauguration, valedictory)
 * - `destination` — the journey's final stop (DJ play)
 */
export type StationKind = 'stage' | 'milestone' | 'destination'

/**
 * One stage of the Timeline page's single continuous journey — the
 * symposium programme, registration to the closing DJ play, rendered as a
 * train crossing the three-frame bridge (see
 * src/components/timeline/TimelineJourney.tsx and ./timelineWorld.ts).
 * Distinct from MetroStation above. Stops carry programme ORDER only — no
 * times.
 */
export interface TimelineEvent {
  id: string
  /** Which day of the symposium this stop belongs to (labels + accents). */
  day: DayKey
  kind: StationKind
  /** Normalized position (0-1) across the COMPLETE three-frame world, in
   * travel order (the journey only ever runs left-to-right). */
  position: number
  title: string
  description: string
}
