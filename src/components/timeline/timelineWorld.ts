import type { DayKey } from '@/types/timeline'

/**
 * The three background frames that together form ONE continuous bridge
 * world (Frame 01 -> 02 -> 03). Each is rendered at the same height (the
 * viewport height), so its rendered WIDTH is proportional to its own
 * pixel aspect ratio — that's the only fact needed to compute where each
 * frame sits in the stitched world, with no DOM measurement required.
 */
export const FRAME_SOURCES: { frame: 1 | 2 | 3; src: string; aspect: number }[] = [
  { frame: 1, src: '/assets/timeline/timeline-frame-01.png', aspect: 2048 / 682 },
  { frame: 2, src: '/assets/timeline/timeline-frame-02.png', aspect: 2172 / 724 },
  { frame: 3, src: '/assets/timeline/timeline-frame-03.png', aspect: 2172 / 724 },
]

const FRAME_ASPECT_SUM = FRAME_SOURCES.reduce((sum, frame) => sum + frame.aspect, 0)

// How much of each frame (after the first) blends into its predecessor,
// as a fraction of ITS OWN rendered width — see FRAME_LAYOUT below. 12%
// sits in the middle of the "wide, soft, atmospheric" 8-15% range that
// reads as one continuous environment rather than a butted seam.
const OVERLAP_FRACTION = 0.12

export interface FrameLayout {
  frame: 1 | 2 | 3
  src: string
  /** This frame's own rendered width, in vh units (multiply by 1vh). */
  widthVh: number
  /** Negative for every frame after the first — pulls it left, into
   * overlap with its predecessor, entirely via CSS (no JS measurement
   * needed: vh scales with viewport height exactly like the frames
   * themselves do, so the overlap stays proportional at every
   * breakpoint). */
  marginLeftVh: number
  /** 0 for frame 1 (nothing to blend into). For every later frame, the
   * percentage (of ITS OWN width) over which it fades in from
   * transparent — matches OVERLAP_FRACTION so the fade completes exactly
   * where the physical pixel overlap ends. */
  featherPercent: number
}

export interface SeamLayout {
  key: string
  /** Center of the overlap zone, in vh units from the world's left edge. */
  centerVh: number
  /** Width of the soft atmospheric haze laid over the seam, in vh units —
   * deliberately wider than the raw pixel overlap so it reads as ambient
   * haze rather than a second hard edge. */
  widthVh: number
}

/**
 * Lays the three frames out with real pixel overlap between neighbors
 * (rather than edge-to-edge) so a later frame's already-transparent
 * leading edge (see `featherMaskImage`) reveals its predecessor's actual
 * pixels underneath instead of the page background — a true cross-fade
 * between the two images' content, never a fade to black. Everything is
 * expressed in vh so it holds at any viewport size without a media query.
 */
function buildWorldLayout(): { frames: FrameLayout[]; seams: SeamLayout[] } {
  const frames: FrameLayout[] = []
  const seams: SeamLayout[] = []
  let flowCursorVh = 0

  FRAME_SOURCES.forEach((frame, index) => {
    const widthVh = frame.aspect * 100
    const marginLeftVh = index === 0 ? 0 : -(widthVh * OVERLAP_FRACTION)
    const leftVh = flowCursorVh + marginLeftVh

    if (index > 0) {
      const overlapVh = -marginLeftVh
      seams.push({
        key: `${FRAME_SOURCES[index - 1].frame}-${frame.frame}`,
        centerVh: leftVh + overlapVh / 2,
        widthVh: overlapVh * 2.3,
      })
    }

    frames.push({
      frame: frame.frame,
      src: frame.src,
      widthVh,
      marginLeftVh,
      featherPercent: index === 0 ? 0 : OVERLAP_FRACTION * 100,
    })
    flowCursorVh = leftVh + widthVh
  })

  return { frames, seams }
}

const WORLD_LAYOUT = buildWorldLayout()
export const FRAME_LAYOUT = WORLD_LAYOUT.frames
export const SEAM_LAYOUTS = WORLD_LAYOUT.seams

/**
 * An alpha mask (not a painted overlay) that fades a frame in from fully
 * transparent at its own left edge to fully opaque by `featherPercent`
 * of its own width — used only on frames after the first. Because the
 * frame below is genuinely visible underneath (real pixel overlap, see
 * buildWorldLayout), this blends actual image content, not a fade to the
 * page's black background. Eased, uneven stops (not a single straight
 * ramp) so the transition reads as soft haze rather than a second
 * mechanical edge.
 */
export function featherMaskImage(featherPercent: number): string {
  if (featherPercent <= 0) return 'none'
  const p = featherPercent
  return (
    `linear-gradient(to right, ` +
    `transparent 0%, ` +
    `rgba(0,0,0,0.1) ${(p * 0.22).toFixed(2)}%, ` +
    `rgba(0,0,0,0.45) ${(p * 0.52).toFixed(2)}%, ` +
    `rgba(0,0,0,0.8) ${(p * 0.8).toFixed(2)}%, ` +
    `black ${p.toFixed(2)}%, ` +
    `black 100%)`
  )
}

/**
 * Cumulative world-normalized (0-1) boundaries around each frame:
 * [frame1Start, frame1End/frame2Start, frame2End/frame3Start, frame3End].
 * Frame `n`'s share of the combined world WIDTH equals its aspect ratio's
 * share of the three frames' combined aspect ratio.
 */
const FRAME_WORLD_BOUNDARIES: [number, number, number, number] = (() => {
  let cumulative = 0
  const bounds = [0]
  for (const frame of FRAME_SOURCES) {
    cumulative += frame.aspect / FRAME_ASPECT_SUM
    bounds.push(cumulative)
  }
  bounds[3] = 1 // guard against float drift so frame 3 always ends exactly at 1
  return bounds as [number, number, number, number]
})()

/** Maps a position local to one frame (0-1, left-to-right within it) to
 * the shared world-normalized position (0-1) — used only internally, to
 * derive the safe train start/end zone below. Event data itself already
 * stores world-normalized positions directly (see types/timeline.ts). */
function frameLocalToWorld(frame: 1 | 2 | 3, localPosition: number): number {
  const start = FRAME_WORLD_BOUNDARIES[frame - 1]
  const end = FRAME_WORLD_BOUNDARIES[frame]
  return start + localPosition * (end - start)
}

// The train must always start/finish safely INSIDE the generated art, not
// riding off the outer edge of frame 1 or frame 3.
const SAFE_START_FRACTION = 0.1
const SAFE_END_FRACTION = 0.9

const DAY1_START_WORLD = frameLocalToWorld(1, SAFE_START_FRACTION)
const DAY1_END_WORLD = frameLocalToWorld(3, SAFE_END_FRACTION)

/** Day 1 runs Frame01 -> Frame03 (left-to-right); Day 2 reuses the exact
 * same world in reverse (Frame03 -> Frame01), never a second bridge. */
export function journeyBoundsFor(day: DayKey): { start: number; end: number } {
  return day === 'day1'
    ? { start: DAY1_START_WORLD, end: DAY1_END_WORLD }
    : { start: DAY1_END_WORLD, end: DAY1_START_WORLD }
}

/**
 * Progress-space (0-1) threshold at which the train's NOSE — its leading
 * edge in the current direction of travel, offset by `noseOffset`
 * world-normalized units from the train's center — reaches an event's
 * world position. Generalizes the single-bridge activation math to a
 * journey that can run in either world-position direction (Day 1
 * increasing, Day 2 decreasing) using one shared formula.
 */
export function activationThreshold(
  eventWorldPos: number,
  start: number,
  end: number,
  noseOffset: number,
): number {
  const span = end - start
  if (span === 0) return 0
  const direction = span > 0 ? 1 : -1
  const raw = (eventWorldPos - direction * noseOffset - start) / span
  return Math.max(0, Math.min(1, raw))
}
