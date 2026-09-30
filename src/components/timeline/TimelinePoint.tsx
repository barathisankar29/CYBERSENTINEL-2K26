import { memo } from 'react'
import type { TimelineEvent } from '@/types/timeline'

interface TimelinePointProps {
  point: TimelineEvent
  isCurrent: boolean
}

/**
 * One station marker on the rail. The event card itself no longer lives
 * here — a single floating card follows the train instead (see
 * TimelineActiveCard in TimelineJourney.tsx) — so this is just the small
 * glowing dot marking where each station sits along the bridge, lit up
 * only for whichever station the train is currently at. Programme
 * milestones and the final destination get their own marker treatment
 * (`timeline-point--milestone` / `--destination`).
 *
 * Memoized because `progress` (and therefore the parent's render) changes
 * up to 60x/second during the journey, but any given marker's own props
 * change only when the current station itself changes — `React.memo`
 * skips reconciling markers that aren't the one turning on/off.
 */
function TimelinePointImpl({ point, isCurrent }: TimelinePointProps) {
  return (
    <div className={`timeline-point timeline-point--${point.kind}`} style={{ left: `${point.position * 100}%` }}>
      <span className={`timeline-point__glow ${isCurrent ? 'is-active' : ''}`} aria-hidden="true" />
      <span className={`timeline-point__marker ${isCurrent ? 'is-active' : ''}`} />
    </div>
  )
}

export const TimelinePoint = memo(TimelinePointImpl)
