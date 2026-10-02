import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { timelineEvents } from '@/data/timelineSchedule'
import type { DayKey, StationKind, TimelineEvent } from '@/types/timeline'
import { FRAME_LAYOUT, JOURNEY_BOUNDS, SEAM_LAYOUTS, activationThreshold, featherMaskImage } from './timelineWorld'
import { useJourneyProgress } from './useJourneyProgress'
import { TimelinePoint } from './TimelinePoint'
import { CharacterFight } from './CharacterFight'
import './TimelineJourney.css'

const TRAIN_SRC = '/assets/timeline/timeline-train.webp'

// Frame 1 is the only one ever visible at rest (the journey starts there —
// see JOURNEY_BOUNDS) so it alone loads eagerly/with priority.
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

const DAY_LABEL: Record<DayKey, string> = { day1: 'DAY 01', day2: 'DAY 02' }

/** The card's day label (where the old time slot was — no times exist). */
function stopTag(day: DayKey, kind: StationKind): string {
  return kind === 'destination' ? `${DAY_LABEL[day]} // FINAL STOP` : DAY_LABEL[day]
}

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
 * The Timeline page's centerpiece — THE SENTINEL JOURNEY: three background
 * frames stitched into ONE continuous horizontal world (Frame01 -> Frame02
 * -> Frame03) that the train crosses once, carrying the whole symposium
 * programme from registration and the inauguration, through both days'
 * events, to the prize distribution (src/data/timelineSchedule.ts). A
 * single normalized `progress` value (0-1) from useJourneyProgress —
 * driven automatically once started, then one stop at a time by the
 * user's own scroll/swipe/keys — drives the train's world position, the
 * camera pan, and which single stop is "current"; see useJourneyProgress.ts
 * and timelineWorld.ts for the shared math.
 */
export function TimelineJourney() {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const worldRef = useRef<HTMLDivElement>(null)
  const trainRef = useRef<HTMLDivElement>(null)
  const cardObserverRef = useRef<ResizeObserver | null>(null)
  const [started, setStarted] = useState(false)
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

  const points = timelineEvents
  const bounds = JOURNEY_BOUNDS
  const showIntro = !started

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

  // Stops in the order the journey actually reaches them (left-to-right) —
  // index i here lines up 1:1 with breakpoints[i + 1] below, since both are
  // sorted by the same threshold.
  const orderedStations = useMemo(() => {
    return [...points].sort(
      (a, b) =>
        activationThreshold(a.position, bounds.start, bounds.end, noseOffset) -
        activationThreshold(b.position, bounds.start, bounds.end, noseOffset),
    )
  }, [points, bounds.start, bounds.end, noseOffset])

  // One shared threshold per stop drives both the automatic journey's
  // stop-by-stop segments and manual step navigation — see
  // useJourneyProgress. Starts at 0 (departure) and deliberately ENDS at
  // the final stop's threshold (no trailing 1): the journey's last resting
  // point is the prize distribution itself, with its card up. Exactly one
  // entry per stop — never deduped — so breakpoints[i] always lines up with
  // orderedStations[i - 1] even if a stop's threshold ever clamps onto the
  // departure point (deduping it would shift every card by one).
  const breakpoints = useMemo(() => {
    const thresholds = points.map((point) => activationThreshold(point.position, bounds.start, bounds.end, noseOffset))
    return [0, ...thresholds].sort((a, b) => a - b)
  }, [points, bounds.start, bounds.end, noseOffset])

  const { progress, stepIndex, jumpTo } = useJourneyProgress({ active: started, breakpoints, reducedMotion })

  // stepIndex 0 is the departure point, before the first stop; every index
  // after that is a stop, the last being the final destination.
  const currentStation: TimelineEvent | null =
    stepIndex >= 1 && stepIndex <= orderedStations.length ? orderedStations[stepIndex - 1] : null
  const currentStationNumber = Math.max(0, Math.min(orderedStations.length, stepIndex))
  // Which day of the programme the train is in — drives the Day 1 (cyan) /
  // Day 2 (magenta) accents and the HUD's day buttons.
  const journeyDay: DayKey = currentStation?.day ?? 'day1'
  // HUD bar: 0 at departure, full at the final destination.
  const finalBreakpoint = breakpoints[breakpoints.length - 1] || 1
  const hudProgress = Math.min(1, progress / finalBreakpoint)
  const day2StopIndex = orderedStations.findIndex((stop) => stop.day === 'day2') + 1

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

  // The single active card. Same element, content and crossfade on every
  // layout — only WHERE it's placed differs: desktop floats it above the
  // train inside the world; mobile gives it its own slot under the HUD.
  const cardDay = displayedStation?.day ?? journeyDay
  const activeCard = started && (
    <article
      ref={setMeasuredCardRef}
      className={`timeline-active-card timeline-active-card--${cardDay} ${displayedStation ? `timeline-active-card--${displayedStation.kind}` : ''} ${cardShown ? 'is-shown' : ''}`}
    >
      {displayedStation && (
        <>
          <div className="timeline-card__index">{String(currentStationNumber).padStart(2, '0')}</div>
          <div className="timeline-card__divider" aria-hidden="true" />
          {/* The small label in the old time slot — the programme has no times. */}
          <div className="timeline-card__time">{stopTag(displayedStation.day, displayedStation.kind)}</div>
          <div className="timeline-card__divider" aria-hidden="true" />
          <div className="timeline-card__body">
            <h3 className="timeline-card__title">{displayedStation.title}</h3>
            <p className="timeline-card__desc">{displayedStation.description}</p>
          </div>
        </>
      )}
    </article>
  )

  // HUD DAY 01 / DAY 02: ride the train along the track to that day's first
  // stage (the journey stays one continuous run — no restart, no teleport,
  // never reversed into a separate Day 2 journey).
  const goToDay = (target: DayKey) => {
    jumpTo(target === 'day1' ? 1 : day2StopIndex)
  }

  return (
    <section id="timeline" className="timeline-journey">
      <div className="timeline-viewport" aria-label="CyberSentinel 2K26 Event Timeline">
        <div className="timeline-viewport__vignette" aria-hidden="true" />

        {/* The world's own region. Desktop: the whole viewport (inset: 0), so
            positioning is identical to before. Mobile: the middle grid row,
            and the world scales to fit its height (see --tl-world-vh). */}
        <div className="timeline-stage">
          <div
            className="timeline-world"
            ref={worldRef}
            style={{ transform: `translate3d(${Math.round(-cameraPx)}px, -50%, 0)` }}
          >
            {frameLayer}
            {seamHazeLayer}

            {started &&
              points.map((point) => (
                <TimelinePoint key={point.id} point={point} isCurrent={point.id === currentStation?.id} />
              ))}

            <div
              className={`timeline-train ${started ? `timeline-train--${journeyDay}` : 'timeline-train--standby'}`}
              style={{ transform: `translate3d(${Math.round(trainScreenX)}px, 0, 0) translate(-50%, -50%)` }}
              ref={trainRef}
            >
              <img src={TRAIN_SRC} alt="" draggable={false} className="timeline-train__img" fetchPriority="low" />
            </div>

            {activeCard && !isMobile && (
              <div
                className="timeline-active-card-anchor"
                style={{
                  transform: `translate3d(${Math.round(trainScreenX + cardShiftPx)}px, ${Math.round(-(trainHeight / 2 + CARD_TRAIN_GAP_PX))}px, 0) translate(-50%, -100%)`,
                }}
              >
                {activeCard}
              </div>
            )}
          </div>

          {/* NICO vs RUELLE on a ledge below the track, over the city
              artwork. Shown once the journey is running (the intro screen
              owns the screen before then). */}
          {started && <CharacterFight />}

          {/* Mobile: the current stop's card sits in the scene's sky, anchored
              just above the train's roof (screen-centred rather than
              following the train sideways — see .timeline-card-slot). */}
          {isMobile && <div className="timeline-card-slot">{activeCard}</div>}
        </div>

        {started && (
          <div className="timeline-hud" role="group" aria-label="Timeline controls">
            <p className="timeline-hud__eyebrow">CYBERSENTINEL // 2K26</p>

            <div className="timeline-hud__days">
              <button
                type="button"
                className={`timeline-hud__day timeline-hud__day--day1 ${journeyDay === 'day1' ? 'is-active' : ''}`}
                onClick={() => goToDay('day1')}
                aria-pressed={journeyDay === 'day1'}
              >
                DAY 01
              </button>
              <button
                type="button"
                className={`timeline-hud__day timeline-hud__day--day2 ${journeyDay === 'day2' ? 'is-active' : ''}`}
                onClick={() => goToDay('day2')}
                aria-pressed={journeyDay === 'day2'}
              >
                DAY 02
              </button>
            </div>

            <div className={`timeline-hud__progress timeline-hud__progress--${journeyDay}`}>
              {/* One CSS variable drives both fill (scaleX) and dot (translateX)
                  — transform-only, so the per-frame journey update never
                  triggers layout. See TimelineJourney.css. */}
              <div className="timeline-hud__progress-track" style={{ '--p': hudProgress } as CSSProperties}>
                <div className="timeline-hud__progress-fill" />
                <div className="timeline-hud__progress-dot" />
              </div>
              <span className="timeline-hud__event-count">
                {isMobile && (
                  <span className="timeline-hud__swipe-hint" aria-hidden="true">
                    ‹ SWIPE ›
                  </span>
                )}
                STAGE {String(currentStationNumber).padStart(2, '0')} / {String(points.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {showIntro && (
          <div className="day-select" role="group" aria-label="The Sentinel Journey">
            <p className="day-select__eyebrow">CYBERSENTINEL // 2K26</p>
            <h2 className="day-select__headline">THE SENTINEL JOURNEY</h2>
            <p className="day-select__subtitle">
              TWO DAYS. <span>ONE JOURNEY.</span> ONE SENTINEL.
            </p>

            <div className="day-select__cards">
              <button type="button" className="day-card day-card--day1" onClick={() => setStarted(true)}>
                <span className="day-card__index">DAY 01 &rarr; 02</span>
                <span className="day-card__label">Registration to Prize Distribution</span>
                <span className="day-card__cta">
                  Start Journey <span aria-hidden="true">&rarr;</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
