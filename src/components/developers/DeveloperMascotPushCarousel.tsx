import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { FrontendDeveloperMember } from '@/data/developers'
import { MASCOT_SPRITES, type MascotExpression } from '@/data/mascot'
import { FrontendDeveloperCard } from './FrontendDeveloperCard'
import './DeveloperMascotPushCarousel.css'

interface DeveloperMascotPushCarouselProps {
  developers: FrontendDeveloperMember[]
}

const HOLD_DURATION_MS = 3000
const PUSH_ANIMATION_MS = 750

export const DeveloperMascotPushCarousel: React.FC<DeveloperMascotPushCarouselProps> = ({ developers }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [isPushing, setIsPushing] = useState(false)
  const [pushDirection, setPushDirection] = useState<'next' | 'prev'>('next')
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const total = developers.length

  // Trigger push transition to a specific index
  const triggerPush = useCallback(
    (targetIndex: number, direction: 'next' | 'prev') => {
      if (isPushing) return
      const normalizedTarget = ((targetIndex % total) + total) % total
      if (normalizedTarget === activeIndex) return

      setIncomingIndex(normalizedTarget)
      setPushDirection(direction)
      setIsPushing(true)
      setProgress(0)

      // Transition completes
      setTimeout(() => {
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

  // Timer loop for auto-push (3.5 to 5s delay requested by user)
  useEffect(() => {
    if (isPaused || isPushing) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
      return
    }

    startTimeRef.current = Date.now() - (progress / 100) * HOLD_DURATION_MS

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100)
      setProgress(pct)

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
  }, [isPaused, isPushing, progress, pushNext])

  // Choose mascot pose based on state
  let mascotPose: MascotExpression = 'float'
  if (isPushing) {
    mascotPose = pushDirection === 'next' ? 'dash2' : 'fly'
  } else if (progress > 85) {
    mascotPose = 'dash1' // Leaning into push position anticipation!
  } else if (progress < 25) {
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
