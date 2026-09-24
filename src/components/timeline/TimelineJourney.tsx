import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { timelineEvents } from '@/data/timelineSchedule'
import type { DayKey, TimelineEvent } from '@/types/timeline'
import { FRAME_LAYOUT, SEAM_LAYOUTS, activationThreshold, featherMaskImage, journeyBoundsFor } from './timelineWorld'
import { useJourneyProgress } from './useJourneyProgress'
import { TimelinePoint } from './TimelinePoint'
import './TimelineJourney.css'

const TRAIN_SRC = '/assets/timeline/timeline-train.webp'

// Frame 1 is the only one ever visible at rest (both days' journeys start
// there — see journeyBoundsFor) so it alone loads eagerly/with priority.
// Frames 2 and 3 are ~2.5MB cinematic PNGs each; fetching all three
// up front was the dominant cost behind the page's LCP. Instead each
// later frame's `src` is withheld until the PREVIOUS one finishes loading
// (or errors — see onLoad/onError below), so frame 2 starts downloading
// the moment frame 1 is ready rather than competing with it for
// bandwidth, and frame 3 similarly waits on frame 2. Because the
// cinematic journey takes many seconds to traverse a single frame (see
// TRAVEL_MS_PER_UNIT in useJourneyProgress), this chain finishes with
// plenty of lead time even on a slow connection — no blank gap when the
// camera actually pans onto frame 2 or 3. Width/height stay reserved via
// the frame's own inline `width` style regardless of whether `src` has
// been set yet, so nothing shifts layout when a later frame's image
// finally appears (see FRAME_LAYOUT).
const FRAME_LOAD_ORDER: Record<1 | 2 | 3, 1 | 2 | 3 | null> = { 1: null, 2: 1, 3: 2 }

// Gap between the train's own top edge and the floating card sitting
// above it.
const CARD_TRAIN_GAP_PX = 18
// Minimum clearance to keep the floating card's edge from touching the
// viewport's own edge when the journey is at its very start/end and the
// camera hits its pan limit (see cardShiftPx below).
const CARD_EDGE_MARGIN = 16
// How long the card's fade-out/fade-in swap takes — kept in sync with
// the CSS transition on `.timeline-active-card`.
const CARD_CROSSFADE_MS = 220

// The seam haze layer has no dependency on any prop or state — computed
// once at module scope rather than rebuilt on every one of the ~60
// renders/second the journey animation drives.
const seamHazeLayer = SEAM_LAYOUTS.map((seam) => (
  <div
    key={seam.key}
    className="timeline-world__haze"
    aria-hidden="true"
    style={{
      left: `calc(${seam.centerVh} * var(--tl-world-vh))`,
      width: `calc(${seam.widthVh} * var(--tl-world-vh))`,
    }}
  />
))

/**
 * The Timeline page's centerpiece: three background frames stitched into
 * ONE continuous horizontal world (Frame01 -> Frame02 -> Frame03), shared
 * by both days (never two worlds). A single normalized `progress` value
 * (0-1) from useJourneyProgress — driven automatically on selection, then
 * one station at a time by the user's own scroll/swipe/keys — drives the
 * train's world position, the camera pan, and which single station is
 * "current"; see useJourneyProgress.ts and timelineWorld.ts for the
 * shared math.
 */
export function TimelineJourney() {
  const reducedMotion = useReducedMotion()
  const worldRef = useRef<HTMLDivElement>(null)
  const trainRef = useRef<HTMLDivElement>(null)
  const cardObserverRef = useRef<ResizeObserver | null>(null)
  const [activeDay, setActiveDay] = useState<DayKey | null>(null)
  const [worldWidth, setWorldWidth] = useState(0)
  const [trainWidth, setTrainWidth] = useState(0)
  const [trainHeight, setTrainHeight] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  // Frame 1 always renders its `src` (see FRAME_LOAD_ORDER above); this
  // only ever needs to track frames 2 and 3 finishing.
  const [loadedFrames, setLoadedFrames] = useState<Set<1 | 2 | 3>>(() => new Set())
  const markFrameSettled = useCallback((frame: 1 | 2 | 3) => {
    setLoadedFrames((prev) => (prev.has(frame) ? prev : new Set(prev).add(frame)))
  }, [])

  // The single floating card's own displayed content lags the CURRENT
  // station by one crossfade — see the effect below — so the outgoing
  // card can fade out before the incoming one's content swaps in and
  // fades in, rather than the text jump-cutting under a still-visible box.
  const [displayedStation, setDisplayedStation] = useState<TimelineEvent | null>(null)
  const [cardShown, setCardShown] = useState(false)
  const cardTimeoutRef = useRef<number | null>(null)

  const setMeasuredCardRef = useCallback((node: HTMLElement | null) => {
    cardObserverRef.current?.disconnect()
    cardObserverRef.current = null
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setCardWidth(entry.contentRect.width))
    observer.observe(node)
    cardObserverRef.current = observer
  }, [])

  const day = activeDay ?? 'day1'
  const points = useMemo(() => timelineEvents.filter((event) => event.day === day), [day])
  const bounds = journeyBoundsFor(day)
  const showIntro = activeDay === null

  // Measures the world's, train's, and viewport's actual rendered sizes so
  // the nose-offset used by activationThreshold, the camera pan, and the
  // floating card's position above the train are all exact at any
  // breakpoint, instead of guessed constants.
  useLayoutEffect(() => {
    const world = worldRef.current
    const train = trainRef.current
    if (!world || !train) return

    const measure = () => {
      setWorldWidth(world.offsetWidth)
      setTrainWidth(train.offsetWidth)
      setTrainHeight(train.offsetHeight)
      setViewportWidth(window.innerWidth)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(world)
    observer.observe(train)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const noseOffset = worldWidth ? trainWidth / 2 / worldWidth : 0

  // Rebuilt only when a frame actually finishes loading (twice, total —
  // see FRAME_LOAD_ORDER), not on every progress-driven render.
  const frameLayer = useMemo(
    () =>
      FRAME_LAYOUT.map((frame) => {
        const mask = frame.featherPercent > 0 ? featherMaskImage(frame.featherPercent) : undefined
        const dependsOn = FRAME_LOAD_ORDER[frame.frame]
        const ready = dependsOn === null || loadedFrames.has(dependsOn)
        return (
          <img
            key={frame.frame}
            src={ready ? frame.src : undefined}
            alt=""
            draggable={false}
            className="timeline-world__frame"
            fetchPriority={frame.frame === 1 ? 'high' : 'low'}
            decoding={frame.frame === 1 ? 'sync' : 'async'}
            onLoad={() => markFrameSettled(frame.frame)}
            onError={() => markFrameSettled(frame.frame)}
            style={{
              width: `calc(${frame.widthVh} * var(--tl-world-vh))`,
              marginLeft: frame.marginLeftVh
                ? `calc(${frame.marginLeftVh} * var(--tl-world-vh))`
                : undefined,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      }),
    [loadedFrames, markFrameSettled],
  )

  // Stations in the order the CURRENT day's journey actually visits them
  // (day1: left-to-right, matching array order; day2: the same physical
  // stations, right-to-left) — index i here lines up 1:1 with
  // breakpoints[i + 1] below, since both are sorted by the same threshold.
  const orderedStations = useMemo(() => {
    return [...points].sort(
      (a, b) =>
        activationThreshold(a.position, bounds.start, bounds.end, noseOffset) -
        activationThreshold(b.position, bounds.start, bounds.end, noseOffset),
    )
  }, [points, bounds.start, bounds.end, noseOffset])

  // One shared threshold per station drives both the automatic journey's
  // station-by-station segments and manual step navigation — see
  // useJourneyProgress.
  const breakpoints = useMemo(() => {
    const thresholds = points.map((point) => activationThreshold(point.position, bounds.start, bounds.end, noseOffset))
    return Array.from(new Set([0, ...thresholds, 1])).sort((a, b) => a - b)
  }, [points, bounds.start, bounds.end, noseOffset])

  const { progress, stepIndex, isRepositioning } = useJourneyProgress({ activeDay, breakpoints, reducedMotion })

  // stepIndex 0 is "before the first station"; stepIndex length-1 is
  // "after the last" — only the indices in between correspond to an
  // actual station.
  const currentStation: TimelineEvent | null =
    stepIndex >= 1 && stepIndex <= orderedStations.length ? orderedStations[stepIndex - 1] : null
  const currentStationNumber = Math.max(0, Math.min(orderedStations.length, stepIndex))

  // Crossfades the floating card's content: fade the outgoing station out,
  // swap the displayed content once it's invisible, then fade the new one
  // in. Skips the fade-out on the very first station (nothing was showing
  // yet to fade).
  useLayoutEffect(() => {
    if (currentStation?.id === displayedStation?.id) return
    if (cardTimeoutRef.current !== null) {
      window.clearTimeout(cardTimeoutRef.current)
      cardTimeoutRef.current = null
    }
    if (!displayedStation) {
      setDisplayedStation(currentStation)
      setCardShown(currentStation !== null)
      return
    }
    setCardShown(false)
    cardTimeoutRef.current = window.setTimeout(() => {
      setDisplayedStation(currentStation)
      setCardShown(currentStation !== null)
      cardTimeoutRef.current = null
    }, CARD_CROSSFADE_MS)
  }, [currentStation, displayedStation])

  const trainWorldPos = bounds.start + progress * (bounds.end - bounds.start)

  // Camera keeps the train roughly centered in the viewport, clamped to
  // the world's own edges — the reason the train (and the visible
  // background) can never pan past frame 1's left edge or frame 3's right
  // edge, staying inside the generated environment at all times.
  const maxCameraLeft = Math.max(0, worldWidth - viewportWidth)
  const idealCameraLeft = trainWorldPos * worldWidth - viewportWidth / 2
  const cameraPx = Math.min(maxCameraLeft, Math.max(0, idealCameraLeft))
  const trainScreenX = trainWorldPos * worldWidth

  // The floating card always sits centered above the train, moving in
  // lockstep with it (both are positioned via the same world-space X, so
  // they pan together with zero drift — no per-station rescue math
  // needed for the common case). The one exception: right at the very
  // start/end of the journey, the camera is pinned at its own pan limit
  // (maxCameraLeft above) and can't keep the train centered, so the train
  // itself can sit close enough to a screen edge that the (much wider)
  // card would spill past it and get clipped by `.timeline-viewport`'s
  // `overflow: hidden`. This nudges ONLY the card sideways, in screen
  // space, just enough to keep both its edges inside the viewport —
  // gated to that specific edge case so it never fights the card's
  // normal position the rest of the journey.
  const atCameraLimit = cameraPx <= 0.5 || cameraPx >= maxCameraLeft - 0.5
  const cardShiftPx = (() => {
    if (!cardWidth || !viewportWidth || !atCameraLimit) return 0
    const screenX = trainScreenX - cameraPx
    const idealLeft = screenX - cardWidth / 2
    const idealRight = idealLeft + cardWidth
    if (idealRight <= 0 || idealLeft >= viewportWidth) return 0
    const minLeft = CARD_EDGE_MARGIN
    const maxLeft = Math.max(minLeft, viewportWidth - cardWidth - CARD_EDGE_MARGIN)
    const clampedLeft = Math.min(Math.max(idealLeft, minLeft), maxLeft)
    return clampedLeft - idealLeft
  })()

  const selectDay = (nextDay: DayKey) => {
    if (nextDay === activeDay) return
    setActiveDay(nextDay)
  }

  return (
    <section className="timeline-journey">
      <div className="timeline-viewport" aria-label="CyberSentinel 2K26 Event Timeline">
        <div className="timeline-viewport__vignette" aria-hidden="true" />

        <div
          className={`timeline-world ${isRepositioning ? 'is-repositioning' : ''}`}
          ref={worldRef}
          style={{ transform: `translate3d(${-cameraPx}px, -50%, 0)` }}
        >
          {frameLayer}
          {seamHazeLayer}

          {activeDay &&
            points.map((point) => (
              <TimelinePoint key={point.id} point={point} isCurrent={point.id === currentStation?.id} />
            ))}

          <div
            className={`timeline-train ${activeDay ? `timeline-train--${activeDay}` : 'timeline-train--standby'} ${isRepositioning ? 'is-repositioning' : ''}`}
            style={{ transform: `translate3d(${trainScreenX}px, 0, 0) translate(-50%, -50%)` }}
            ref={trainRef}
          >
            <img src={TRAIN_SRC} alt="" draggable={false} className="timeline-train__img" fetchPriority="low" />
          </div>

          {activeDay && (
            <div
              className="timeline-active-card-anchor"
              style={{
                transform: `translate3d(${trainScreenX + cardShiftPx}px, ${-(trainHeight / 2 + CARD_TRAIN_GAP_PX)}px, 0) translate(-50%, -100%)`,
              }}
            >
              <article
                ref={setMeasuredCardRef}
                className={`timeline-active-card timeline-active-card--${activeDay} ${cardShown ? 'is-shown' : ''}`}
              >
                {displayedStation && (
                  <>
                    <div className="timeline-card__index">{String(currentStationNumber).padStart(2, '0')}</div>
                    <div className="timeline-card__divider" aria-hidden="true" />
                    <div className="timeline-card__time">{displayedStation.time}</div>
                    <div className="timeline-card__divider" aria-hidden="true" />
                    <div className="timeline-card__body">
                      <h3 className="timeline-card__title">{displayedStation.title}</h3>
                      <p className="timeline-card__desc">{displayedStation.description}</p>
                    </div>
                  </>
                )}
              </article>
            </div>
          )}
        </div>

        {activeDay && (
          <div className="timeline-hud" role="group" aria-label="Timeline controls">
            <p className="timeline-hud__eyebrow">CYBERSENTINEL // TIMELINE</p>

            <div className="timeline-hud__days">
              <button
                type="button"
                className={`timeline-hud__day timeline-hud__day--day1 ${activeDay === 'day1' ? 'is-active' : ''}`}
                onClick={() => selectDay('day1')}
                aria-pressed={activeDay === 'day1'}
              >
                DAY 01
              </button>
              <button
                type="button"
                className={`timeline-hud__day timeline-hud__day--day2 ${activeDay === 'day2' ? 'is-active' : ''}`}
                onClick={() => selectDay('day2')}
                aria-pressed={activeDay === 'day2'}
              >
                DAY 02
              </button>
            </div>

            <div className={`timeline-hud__progress timeline-hud__progress--${activeDay}`}>
              {/* One CSS variable drives both fill (scaleX) and dot (translateX)
                  — transform-only, so the per-frame journey update never
                  triggers layout. See TimelineJourney.css. */}
              <div className="timeline-hud__progress-track" style={{ '--p': progress } as CSSProperties}>
                <div className="timeline-hud__progress-fill" />
                <div className="timeline-hud__progress-dot" />
              </div>
              <span className="timeline-hud__event-count">
                EVENT {String(currentStationNumber).padStart(2, '0')} / {String(points.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {showIntro && (
          <div className="day-select" role="group" aria-label="Choose your journey">
            <p className="day-select__eyebrow">CYBERSENTINEL // TIMELINE</p>
            <h2 className="day-select__headline">CHOOSE YOUR JOURNEY</h2>

            <div className="day-select__cards">
              <button type="button" className="day-card day-card--day1" onClick={() => selectDay('day1')}>
                <span className="day-card__index">DAY 01</span>
                <span className="day-card__label">Explore Day One</span>
                <span className="day-card__cta">
                  Start Journey <span aria-hidden="true">&rarr;</span>
                </span>
              </button>

              <button type="button" className="day-card day-card--day2" onClick={() => selectDay('day2')}>
                <span className="day-card__index">DAY 02</span>
                <span className="day-card__label">Explore Day Two</span>
                <span className="day-card__cta">
                  <span aria-hidden="true">&larr;</span> Reverse Journey
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
