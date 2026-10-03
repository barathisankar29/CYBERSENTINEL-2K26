import { useCallback, useEffect, useRef, useState } from 'react'

// How long the train dwells at each station before continuing (autoplay only).
const SETTLE_MS = 550
// Cinematic pace: a full, uninterrupted 0-1 journey would take this long.
const TRAVEL_MS_PER_UNIT = 9000
const MIN_SEGMENT_MS = 450
// A swipe/scroll gesture only ever advances ONE station. Once a step has
// been dispatched, further gestures aiming at the exact same station are
// free (already-in-flight, no-op), but a gesture asking for a DIFFERENT
// station is throttled to this cadence — long enough to absorb the burst
// of wheel events a single trackpad flick generates, short enough that
// deliberate repeated gestures still feel responsive.
const STEP_COOLDOWN_MS = 220
// Minimum swipe distance (px) to count as an intentional step vs. a tap.
const SWIPE_THRESHOLD_PX = 32

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export type JourneyMode = 'idle' | 'auto' | 'manual'

interface UseJourneyProgressArgs {
  /** False until the visitor starts the journey (intro screen). */
  active: boolean
  /** Sorted, deduped progress-space thresholds, starting with 0 (the
   * departure point, before the first stop). Index i (1 <= i <=
   * stops.length) is the i-th stop in travel order; the LAST entry is the
   * final destination, so the journey ends parked at it. */
  breakpoints: number[]
  reducedMotion: boolean
}

/**
 * The Timeline's single canonical progress value (0-1), stepped
 * station-to-station rather than scrubbed continuously:
 *
 *   journeyProgress -> train world position -> camera pan
 *                    -> current station index -> active card -> HUD
 *
 * One continuous journey (Day 1 flows straight into Day 2). Starting it
 * runs the automatic journey, walking every stop in order with a settle
 * pause at each, and ending parked at the final destination. The instant
 * the user scrolls, swipes, or presses a nav key, autoplay stops and that
 * gesture becomes the first manual step — every gesture after that moves
 * exactly one stop forward or back (see `step` below). `jumpTo` (the HUD's
 * DAY 01 / DAY 02 buttons) rides the train along the track to a stop; it
 * never teleports.
 */
export function useJourneyProgress({ active, breakpoints, reducedMotion }: UseJourneyProgressArgs) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const runIdRef = useRef(0)
  const breakpointsRef = useRef(breakpoints)
  breakpointsRef.current = breakpoints
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const stepIndexRef = useRef(0)
  const pendingTargetRef = useRef<number | null>(null)
  const lastStepAtRef = useRef(0)

  const stopTimers = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    rafRef.current = null
    timeoutRef.current = null
  }, [])

  // Eases progress from `fromValue` to breakpoints[toIndex]. `fromValue` is
  // an explicit value (not just breakpoints[fromIndex]) so a gesture that
  // grabs control mid-flight can redirect smoothly from wherever the train
  // actually is, rather than snapping back to the last completed stop
  // first — the difference between "grab and steer" and "stop dead, then
  // restart".
  const animateProgressTo = useCallback(
    (fromValue: number, toIndex: number, runId: number, onDone?: () => void) => {
      const bps = breakpointsRef.current
      const to = bps[toIndex]

      if (reducedMotion) {
        progressRef.current = to
        stepIndexRef.current = toIndex
        setProgress(to)
        setStepIndex(toIndex)
        onDone?.()
        return
      }

      const span = to - fromValue
      const duration = Math.max(MIN_SEGMENT_MS, Math.abs(span) * TRAVEL_MS_PER_UNIT)
      const start = performance.now()

      const tick = (now: number) => {
        if (runIdRef.current !== runId) return
        const t = Math.min(1, (now - start) / duration)
        const value = fromValue + easeInOutCubic(t) * span
        progressRef.current = value
        setProgress(value)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          stepIndexRef.current = toIndex
          setStepIndex(toIndex)
          onDone?.()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [reducedMotion],
  )

  // Walks every stop in order: ease-in-out travel from one threshold to
  // the next, then a brief settle dwell before continuing — so the train
  // visibly arrives at, pauses at, and departs each station rather than
  // sweeping past all of them in one motion. Stops the moment `mode`
  // leaves 'auto' (see the start effect and `step` below).
  const modeRef = useRef<JourneyMode>('idle')
  const runAutoJourney = useCallback(
    (runId: number) => {
      const bps = breakpointsRef.current
      const segments = bps.length - 1
      if (segments <= 0) {
        modeRef.current = 'manual'
        return
      }

      const playFrom = (index: number) => {
        if (runIdRef.current !== runId || modeRef.current !== 'auto') return
        if (index >= segments) {
          modeRef.current = 'manual'
          return
        }
        animateProgressTo(bps[index], index + 1, runId, () => {
          if (runIdRef.current !== runId || modeRef.current !== 'auto') return
          timeoutRef.current = window.setTimeout(() => playFrom(index + 1), SETTLE_MS)
        })
      }
      playFrom(0)
    },
    [animateProgressTo],
  )

  // Starts the automatic journey once, when the visitor begins it.
  useEffect(() => {
    if (!active) {
      modeRef.current = 'idle'
      return
    }

    stopTimers()
    runIdRef.current += 1
    const runId = runIdRef.current

    progressRef.current = 0
    stepIndexRef.current = 0
    pendingTargetRef.current = null
    setProgress(0)
    setStepIndex(0)

    if (reducedMotion) {
      modeRef.current = 'manual'
      return stopTimers
    }

    modeRef.current = 'auto'
    runAutoJourney(runId)
    return stopTimers
  }, [active, reducedMotion, stopTimers, runAutoJourney])

  // Moves exactly one stop forward (`direction: 1`) or back (`direction:
  // -1`). Called by the gesture listeners below. If autoplay is still
  // running, this grabs control immediately — the in-flight animation is
  // redirected from wherever it currently is toward the requested stop,
  // rather than either fighting the autoplay loop or waiting for it to
  // finish first.
  const step = useCallback(
    (direction: 1 | -1) => {
      if (!active) return
      const bps = breakpointsRef.current
      const target = stepIndexRef.current + direction
      if (target < 0 || target > bps.length - 1) return
      if (pendingTargetRef.current === target) return

      const now = performance.now()
      if (now - lastStepAtRef.current < STEP_COOLDOWN_MS) return
      lastStepAtRef.current = now

      pendingTargetRef.current = target
      stopTimers()
      runIdRef.current += 1
      const runId = runIdRef.current
      modeRef.current = 'manual'
      animateProgressTo(progressRef.current, target, runId, () => {
        if (pendingTargetRef.current === target) pendingTargetRef.current = null
      })
    },
    [active, stopTimers, animateProgressTo],
  )

  const jumpTo = useCallback(
    (targetIndex: number) => {
      if (!active) return
      const bps = breakpointsRef.current
      const target = Math.max(0, Math.min(bps.length - 1, targetIndex))
      if (pendingTargetRef.current === target) return
      pendingTargetRef.current = target
      stopTimers()
      runIdRef.current += 1
      const runId = runIdRef.current
      modeRef.current = 'manual'
      animateProgressTo(progressRef.current, target, runId, () => {
        if (pendingTargetRef.current === target) pendingTargetRef.current = null
      })
    },
    [active, stopTimers, animateProgressTo],
  )

  // Every wheel notch, swipe, or nav key press moves exactly one station —
  // never a continuous scrub. Listens on `window` (not a scrollable
  // spacer — the Timeline is a dedicated, non-scrolling route, see
  // TimelinePage.tsx) and prevents default throughout so the page itself
  // never scrolls out from under the journey.
  useEffect(() => {
    if (!active) return

    // Touch: on phones the journey is a horizontal story — swipe LEFT for
    // the next stop, RIGHT for the previous one (vertical swipes still step
    // too). The dominant axis of the gesture decides which one it is.
    let touchStartY: number | null = null
    let touchStartX: number | null = null

    const onWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null
      // Only capture when scrolling inside the timeline
      if (!target?.closest('.timeline-journey')) return

      const bps = breakpointsRef.current
      // If at beginning and scrolling up, allow normal page scroll up
      if (stepIndexRef.current <= 0 && event.deltaY < 0) return
      // If at end and scrolling down, allow normal page scroll down (e.g. to footer)
      if (stepIndexRef.current >= bps.length - 1 && event.deltaY > 0) return

      event.preventDefault()
      step(event.deltaY > 0 ? 1 : -1)
    }
    const onTouchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('.timeline-journey')) return
      touchStartY = event.touches[0]?.clientY ?? null
      touchStartX = event.touches[0]?.clientX ?? null
    }
    const onTouchMove = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('.timeline-journey')) return

      if (touchStartY !== null && touchStartX !== null) {
        const deltaX = touchStartX - (event.touches[0]?.clientX ?? touchStartX)
        const deltaY = touchStartY - (event.touches[0]?.clientY ?? touchStartY)
        // Horizontal drags always stay with the journey (no page pan,
        // no browser back/forward swipe).
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          event.preventDefault()
          return
        }
        const bps = breakpointsRef.current
        if (stepIndexRef.current <= 0 && deltaY < 0) return
        if (stepIndexRef.current >= bps.length - 1 && deltaY > 0) return
      }

      event.preventDefault()
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null || touchStartX === null) return
      const deltaY = touchStartY - (event.changedTouches[0]?.clientY ?? touchStartY)
      const deltaX = touchStartX - (event.changedTouches[0]?.clientX ?? touchStartX)
      touchStartY = null
      touchStartX = null
      const horizontal = Math.abs(deltaX) > Math.abs(deltaY)
      const delta = horizontal ? deltaX : deltaY
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
      // Swipe left (finger moves left, deltaX > 0) / up -> next stop.
      step(delta > 0 ? 1 : -1)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
      if (isInput) return

      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        step(1)
      } else if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        step(-1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        jumpTo(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        jumpTo(breakpointsRef.current.length - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active, step, jumpTo])

  useEffect(() => stopTimers, [stopTimers])

  return { progress, stepIndex, jumpTo }
}
