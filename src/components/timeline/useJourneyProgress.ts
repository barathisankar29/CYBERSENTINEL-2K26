import { useCallback, useEffect, useRef, useState } from 'react'
import type { DayKey } from '@/types/timeline'

// Keep in sync with the CSS transition duration on `.is-repositioning` in
// TimelineJourney.css — this is how long the short cinematic slide to a
// new day's start takes before the automatic journey begins.
const REPOSITION_MS = 600
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
  activeDay: DayKey | null
  /** Sorted, deduped progress-space thresholds for the CURRENT day,
   * always including 0 and 1 as the first/last entries — each entry is a
   * "stop" the train can rest at; index i (for 1 <= i <= stations.length)
   * corresponds to that day's i-th station in visit order. */
  breakpoints: number[]
  reducedMotion: boolean
}

/**
 * The Timeline's single canonical progress value (0-1), now stepped
 * station-to-station rather than scrubbed continuously:
 *
 *   journeyProgress -> train world position -> camera pan
 *                    -> current station index -> active card -> HUD
 *
 * Selecting a day starts the automatic journey, walking every station in
 * order with a settle pause at each. The instant the user scrolls, swipes,
 * or presses a nav key, autoplay stops and that gesture becomes the first
 * manual step — every gesture after that moves exactly one station
 * forward or back (see `step` below), never a continuous scrub. Switching
 * days cancels whichever driver is running, snaps progress to the new
 * day's start (0) so a short CSS transition (`.is-repositioning`, timed to
 * REPOSITION_MS) can carry the train and world across, then restarts the
 * automatic journey for the new day — never a replay of the previous
 * day's journey.
 */
export function useJourneyProgress({ activeDay, breakpoints, reducedMotion }: UseJourneyProgressArgs) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isRepositioning, setIsRepositioning] = useState(false)

  const runIdRef = useRef(0)
  const prevDayRef = useRef<DayKey | null>(null)
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
  // leaves 'auto' (see the day-select effect and `step` below).
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

  // Drives day selection / day switching.
  useEffect(() => {
    if (!activeDay) {
      prevDayRef.current = null
      modeRef.current = 'idle'
      return
    }

    const isSwitch = prevDayRef.current !== null && prevDayRef.current !== activeDay
    prevDayRef.current = activeDay
    stopTimers()
    runIdRef.current += 1
    const runId = runIdRef.current

    progressRef.current = 0
    stepIndexRef.current = 0
    pendingTargetRef.current = null
    setProgress(0)
    setStepIndex(0)

    if (reducedMotion) {
      setIsRepositioning(false)
      modeRef.current = 'manual'
      return stopTimers
    }

    if (isSwitch) {
      // Short cinematic repositioning slide directly to the new day's
      // start (CSS-driven — see .is-repositioning) — never a replay of
      // the previous day's journey across the bridge.
      setIsRepositioning(true)
      timeoutRef.current = window.setTimeout(() => {
        if (runIdRef.current !== runId) return
        setIsRepositioning(false)
        modeRef.current = 'auto'
        runAutoJourney(runId)
      }, REPOSITION_MS)
    } else {
      setIsRepositioning(false)
      modeRef.current = 'auto'
      runAutoJourney(runId)
    }

    return stopTimers
  }, [activeDay, reducedMotion, stopTimers, runAutoJourney])

  // Moves exactly one stop forward (`direction: 1`) or back (`direction:
  // -1`). Called by the gesture listeners below. If autoplay is still
  // running, this grabs control immediately — the in-flight animation is
  // redirected from wherever it currently is toward the requested stop,
  // rather than either fighting the autoplay loop or waiting for it to
  // finish first.
  const step = useCallback(
    (direction: 1 | -1) => {
      if (!activeDay) return
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
    [activeDay, stopTimers, animateProgressTo],
  )

  const jumpTo = useCallback(
    (targetIndex: number) => {
      if (!activeDay) return
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
    [activeDay, stopTimers, animateProgressTo],
  )

  // Every wheel notch, swipe, or nav key press moves exactly one station —
  // never a continuous scrub. Listens on `window` (not a scrollable
  // spacer — the Timeline is a dedicated, non-scrolling route, see
  // TimelinePage.tsx) and prevents default throughout so the page itself
  // never scrolls out from under the journey.
  useEffect(() => {
    if (!activeDay) return

    let touchStartY: number | null = null

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
    }
    const onTouchMove = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('.timeline-journey')) return

      if (touchStartY !== null) {
        const currentY = event.touches[0]?.clientY ?? touchStartY
        const delta = touchStartY - currentY
        const bps = breakpointsRef.current
        if (stepIndexRef.current <= 0 && delta < 0) return
        if (stepIndexRef.current >= bps.length - 1 && delta > 0) return
      }

      event.preventDefault()
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return
      const endY = event.changedTouches[0]?.clientY ?? touchStartY
      const delta = touchStartY - endY
      touchStartY = null
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
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
  }, [activeDay, step, jumpTo])

  useEffect(() => stopTimers, [stopTimers])

  return { progress, stepIndex, isRepositioning }
}
