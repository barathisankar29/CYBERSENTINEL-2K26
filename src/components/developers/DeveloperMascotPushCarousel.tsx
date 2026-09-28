import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { FrontendDeveloperMember } from '@/data/developers'
import { MASCOT_SPRITES, type MascotExpression } from '@/data/mascot'
import { FrontendDeveloperCard } from './FrontendDeveloperCard'
import './DeveloperMascotPushCarousel.css'

interface DeveloperMascotPushCarouselProps {
  developers: FrontendDeveloperMember[]
}

// Each developer card stays up 7s before the mascot pushes the next one in.
const HOLD_DURATION_MS = 7000
const PUSH_ANIMATION_MS = 750

export const DeveloperMascotPushCarousel: React.FC<DeveloperMascotPushCarouselProps> = ({ developers }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [isPushing, setIsPushing] = useState(false)
  const [pushDirection, setPushDirection] = useState<'next' | 'prev'>('next')
  const [isPaused, setIsPaused] = useState(false)
  // Hold progress lives in a ref (updated every frame); React only re-renders
  // when the mascot's pose phase changes: 0 = just landed (<25%), 1 = idle,
  // 2 = winding up for the next push (>85%).
  const [phase, setPhase] = useState<0 | 1 | 2>(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const [isOffscreen, setIsOffscreen] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const pushTimeoutRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const progressRef = useRef(0)
  const total = developers.length

  // The first developer (Barathi) is always the one showing when the carousel
  // scrolls into view, from above or below: it rewinds to the first card while
  // off screen (so the reset is never seen) and only auto-plays while visible.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsOffscreen(false)
        return
      }
      setIsOffscreen(true)
      if (pushTimeoutRef.current !== null) window.clearTimeout(pushTimeoutRef.current)
      pushTimeoutRef.current = null
      setActiveIndex(0)
      setIncomingIndex(null)
      setIsPushing(false)
      progressRef.current = 0
      setPhase(0)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Trigger push transition to a specific index
  const triggerPush = useCallback(
    (targetIndex: number, direction: 'next' | 'prev') => {
      if (isPushing) return
      const normalizedTarget = ((targetIndex % total) + total) % total
      if (normalizedTarget === activeIndex) return

      setIncomingIndex(normalizedTarget)
      setPushDirection(direction)
      setIsPushing(true)
      progressRef.current = 0
      setPhase(0)

      // Transition completes
      pushTimeoutRef.current = window.setTimeout(() => {
        pushTimeoutRef.current = null
        setActiveIndex(normalizedTarget)
        setIncomingIndex(null)
        setIsPushing(false)
        startTimeRef.current = Date.now()
      }, PUSH_ANIMATION_MS)
    },
    [activeIndex, isPushing, total]
  )

  const pushNext = useCallback(() => {
    triggerPush(activeIndex + 1, 'next')
  }, [activeIndex, triggerPush])

  const pushPrev = useCallback(() => {
    triggerPush(activeIndex - 1, 'prev')
  }, [activeIndex, triggerPush])

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        pushPrev()
      } else if (e.key === 'ArrowRight') {
        pushNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pushPrev, pushNext])

  // Timer loop for auto-push. The start time is only re-derived when the
  // timer (re)starts — not on every progress update — so the hold lasts
  // exactly HOLD_DURATION_MS instead of losing a frame per tick.
  useEffect(() => {
    if (isPaused || isOffscreen || isPushing) return

    startTimeRef.current = Date.now() - (progressRef.current / 100) * HOLD_DURATION_MS

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100)
      progressRef.current = pct
      setPhase(pct > 85 ? 2 : pct < 25 ? 0 : 1)

      if (pct >= 100) {
        pushNext()
      } else {
        timerRef.current = requestAnimationFrame(tick)
      }
    }

    timerRef.current = requestAnimationFrame(tick)

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
    }
  }, [isPaused, isOffscreen, isPushing, pushNext])

  // Choose mascot pose based on state
  let mascotPose: MascotExpression = 'float'
  if (isPushing) {
    mascotPose = pushDirection === 'next' ? 'dash2' : 'fly'
  } else if (phase === 2) {
    mascotPose = 'dash1' // Leaning into push position anticipation!
  } else if (phase === 0) {
    mascotPose = 'cheer' // Celebrating after landing new card!
  } else {
    mascotPose = activeIndex % 2 === 0 ? 'wave' : 'happy'
  }

  const activeDev = developers[activeIndex]
  const incomingDev = incomingIndex !== null ? developers[incomingIndex] : null

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const diff = e.changedTouches[0].clientX - touchStartX
    if (diff > 50) {
      pushPrev()
    } else if (diff < -50) {
      pushNext()
    }
    setTouchStartX(null)
  }

  return (
    <div
      ref={rootRef}
      className="mascot-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="mascot-carousel"
      aria-label="Frontend Developer Syndicate Interactive Mascot Carousel"
    >
      {/* Background Holographic Atmosphere Flare */}
      <div
        className="mascot-carousel__flare"
        style={{
          background: `radial-gradient(ellipse 65% 50% at 50% 40%, ${activeDev.nameColor}22 0%, ${activeDev.textColor}14 55%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Main Card Stage Viewport */}
      <div className="mascot-carousel__stage">
        {/* Navigation Arrow Flank: Left (Crisp White Solid Triangle from Image 1) */}
        <button
          type="button"
          className="mascot-carousel__nav-btn mascot-carousel__nav-btn--prev"
          onClick={pushPrev}
          disabled={isPushing}
          aria-label="Previous Frontend Developer"
          title="Previous Developer"
        >
          <svg
            className="mascot-carousel__arrow-svg"
            viewBox="0 0 40 50"
            fill="none"
          >
            <polygon
              points="38,4 38,46 4,25"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        {/* Active Developer Card Container */}
        <div className="mascot-carousel__card-wrapper">
          {/* Animated Mascot Pusher Actor anchored directly to card shoulder */}
          <div
            className={`mascot-pusher ${isPushing ? `is-pushing is-pushing--${pushDirection}` : 'is-hovering'}`}
            aria-hidden="true"
          >
            {/* Cyber Thruster Flame / Particle Trails */}
            <div className="mascot-pusher__thruster" />

            {/* Mascot Speech Callout */}
            <div className="mascot-pusher__callout">
              <span className="mascot-pusher__callout-dot" />
              <span className="mascot-pusher__callout-msg">
                {isPushing
                  ? 'PUSHING NEW OPERATIVE! 🚀'
                  : `MEET ${activeDev.name.split(' ')[0]}! ✨`}
              </span>
            </div>

            {/* Mascot Image Sprite */}
            <img
              src={MASCOT_SPRITES[mascotPose].src}
              alt="Mascot Pusher"
              className="mascot-pusher__sprite"
            />

            {/* Push Energy Impact Rings */}
            {isPushing && <div className="mascot-pusher__shockwave" />}
          </div>

          {/* Exiting Card and Incoming Card during Push Animation */}
          {isPushing && incomingDev ? (
            <>
              <div
                key={`exit-${activeDev.id}`}
                className={`mascot-card-slot is-exiting is-exiting--${pushDirection}`}
              >
                <FrontendDeveloperCard developer={activeDev} />
              </div>
              <div
                key={`enter-${incomingDev.id}`}
                className={`mascot-card-slot is-entering is-entering--${pushDirection}`}
              >
                <FrontendDeveloperCard developer={incomingDev} />
              </div>
            </>
          ) : (
            <div
              key={`current-${activeDev.id}`}
              className="mascot-card-slot is-current"
            >
              <FrontendDeveloperCard developer={activeDev} />
            </div>
          )}
        </div>

        {/* Navigation Arrow Flank: Right (Crisp White Solid Triangle from Image 1) */}
        <button
          type="button"
          className="mascot-carousel__nav-btn mascot-carousel__nav-btn--next"
          onClick={pushNext}
          disabled={isPushing}
          aria-label="Next Frontend Developer"
          title="Next Developer"
        >
          <svg
            className="mascot-carousel__arrow-svg"
            viewBox="0 0 40 50"
            fill="none"
          >
            <polygon
              points="2,4 2,46 36,25"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
