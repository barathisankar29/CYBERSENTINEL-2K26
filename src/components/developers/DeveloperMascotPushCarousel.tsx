import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { FrontendDeveloperMember } from '@/data/developers'
import { FrontendDeveloperCard } from './FrontendDeveloperCard'
import './DeveloperMascotPushCarousel.css'

interface DeveloperMascotPushCarouselProps {
  developers: FrontendDeveloperMember[]
}

// Each developer card stays up 7s before the next one is pushed in.
const HOLD_DURATION_MS = 7000
const PUSH_ANIMATION_MS = 750

export const DeveloperMascotPushCarousel: React.FC<DeveloperMascotPushCarouselProps> = ({ developers }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [isPushing, setIsPushing] = useState(false)
  const [pushDirection, setPushDirection] = useState<'next' | 'prev'>('next')
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const [isOffscreen, setIsOffscreen] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const pushTimeoutRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  /** How much of the current card's hold has elapsed (kept across hover pauses). */
  const elapsedRef = useRef(0)
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
      elapsedRef.current = 0
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
      elapsedRef.current = 0

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

  // Auto-advance: one timeout for the rest of this card's hold — no
  // per-frame work. Hovering pauses it and it resumes where it left off.
  useEffect(() => {
    if (isPaused || isOffscreen || isPushing) return

    startTimeRef.current = Date.now()
    timerRef.current = window.setTimeout(pushNext, Math.max(HOLD_DURATION_MS - elapsedRef.current, 0))

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      elapsedRef.current += Date.now() - startTimeRef.current
    }
  }, [isPaused, isOffscreen, isPushing, pushNext])

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
