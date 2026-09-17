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
