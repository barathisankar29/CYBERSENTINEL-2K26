import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import type { FrontendDeveloperMember, DeveloperMember } from '@/data/developers'
import { MASCOT_SPRITES, type MascotExpression } from '@/data/mascot'
import { FrontendDeveloperCard } from './FrontendDeveloperCard'
import { DeveloperGlitchCard } from './DeveloperGlitchCard'
import './DeveloperMascotPushCarousel.css'

export type UnifiedDeveloper =
  | { type: 'frontend'; data: FrontendDeveloperMember }
  | { type: 'backend'; data: DeveloperMember }

export interface DeveloperMascotPushCarouselProps {
  developers: UnifiedDeveloper[]
  onActiveChange?: (dev: UnifiedDeveloper) => void
}

const HOLD_DURATION_MS = 4500
const PUSH_ANIMATION_MS = 750

export const DeveloperMascotPushCarousel: React.FC<DeveloperMascotPushCarouselProps> = memo(
  ({ developers, onActiveChange }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
    const [isPushing, setIsPushing] = useState(false)
    const [pushDirection, setPushDirection] = useState<'next' | 'prev'>('next')
    const [isPaused, setIsPaused] = useState(false)
    const [mascotPose, setMascotPose] = useState<MascotExpression>('float')
    const [touchStartX, setTouchStartX] = useState<number | null>(null)

    const isPushingRef = useRef(false)
    isPushingRef.current = isPushing

    const total = developers.length

    // Notify parent on initial mount or developers update
    useEffect(() => {
      if (developers[0]) {
        onActiveChange?.(developers[0])
      }
    }, [developers, onActiveChange])

    // Preload all mascot sprites and developer portraits for instant zero-stutter rendering
    useEffect(() => {
      Object.values(MASCOT_SPRITES).forEach((sprite) => {
        const img = new Image()
        img.src = sprite.src
      })
      developers.forEach((dev) => {
        const img = new Image()
        img.src = dev.type === 'frontend' ? dev.data.image : dev.data.avatar
      })
    }, [developers])

    // Trigger push transition to a specific index
    const triggerPush = useCallback(
      (targetIndex: number, direction: 'next' | 'prev') => {
        if (isPushingRef.current || total <= 1) return
        const normalizedTarget = ((targetIndex % total) + total) % total
        if (normalizedTarget === activeIndex) return

        setIncomingIndex(normalizedTarget)
        setPushDirection(direction)
        setIsPushing(true)
        setMascotPose(direction === 'next' ? 'dash2' : 'fly')

        // Notify parent immediately so subtitle updates smoothly
        onActiveChange?.(developers[normalizedTarget])

        // Transition completes cleanly on timer
        setTimeout(() => {
          setActiveIndex(normalizedTarget)
          setIncomingIndex(null)
          setIsPushing(false)
          setMascotPose('cheer')

          // Return to natural waving/happy pose after celebration
          setTimeout(() => {
            setMascotPose((prev) =>
              prev === 'cheer' ? (normalizedTarget % 2 === 0 ? 'wave' : 'happy') : prev
            )
          }, 1100)
        }, PUSH_ANIMATION_MS)
      },
      [activeIndex, total, developers, onActiveChange]
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

    // Discrete auto-advance timer: zero re-renders between slides!
    useEffect(() => {
      if (isPaused || isPushing) return

      // Mascot gets ready (anticipation lean) 600ms before push
      const anticipationTimer = setTimeout(() => {
        setMascotPose('dash1')
      }, Math.max(HOLD_DURATION_MS - 600, 1000))

      const pushTimer = setTimeout(() => {
        pushNext()
      }, HOLD_DURATION_MS)

      return () => {
        clearTimeout(anticipationTimer)
        clearTimeout(pushTimer)
      }
    }, [activeIndex, isPaused, isPushing, pushNext])

    const activeDev = developers[activeIndex] || developers[0]
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

    // Determine flare colors for the active developer
    const flareColors =
      activeDev.type === 'frontend'
        ? {
            c1: activeDev.data.nameColor || '#ff3ea5',
            c2: activeDev.data.textColor || '#00f0ff',
          }
        : {
            c1: activeDev.data.accentHex || '#00f0ff',
            c2: activeDev.data.secondaryHex || '#7c3aed',
          }

    // Helper to render card component based on type
    const renderCard = (dev: UnifiedDeveloper, isActive: boolean = true) => {
      if (dev.type === 'frontend') {
        return <FrontendDeveloperCard developer={dev.data} />
      }
      return <DeveloperGlitchCard developer={dev.data} isActive={isActive} />
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
        aria-label="Meet Our Developers Interactive Mascot Carousel"
      >
        {/* Background Holographic Atmosphere Flare */}
        <div
          className="mascot-carousel__flare"
          style={{
            background: `radial-gradient(ellipse 65% 50% at 50% 40%, ${flareColors.c1}22 0%, ${flareColors.c2}14 55%, transparent 75%)`,
          }}
          aria-hidden="true"
        />

        {/* Main Card Stage Viewport */}
        <div className="mascot-carousel__stage">
          {/* Navigation Arrow Flank: Left (Crisp White Solid Triangle) */}
          <button
            type="button"
            className="mascot-carousel__nav-btn mascot-carousel__nav-btn--prev"
            onClick={pushPrev}
            disabled={isPushing}
            aria-label="Previous Developer"
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
              className={`mascot-pusher ${
                isPushing ? `is-pushing is-pushing--${pushDirection}` : 'is-hovering'
              }`}
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
                    : `MEET ${activeDev.data.name.split(' ')[0]}! ✨`}
                </span>
              </div>

              {/* Mascot Image Sprite */}
              <img
                src={MASCOT_SPRITES[mascotPose]?.src || MASCOT_SPRITES.float.src}
                alt="Mascot Pusher"
                className="mascot-pusher__sprite"
                loading="eager"
                decoding="async"
              />

              {/* Push Energy Impact Rings */}
              {isPushing && <div className="mascot-pusher__shockwave" />}
            </div>

            {/* Exiting Card and Incoming Card during Push Animation */}
            {isPushing && incomingDev ? (
              <>
                <div
                  key={`exit-${activeDev.data.id}`}
                  className={`mascot-card-slot is-exiting is-exiting--${pushDirection}`}
                >
                  {renderCard(activeDev, false)}
                </div>
                <div
                  key={`enter-${incomingDev.data.id}`}
                  className={`mascot-card-slot is-entering is-entering--${pushDirection}`}
                >
                  {renderCard(incomingDev, true)}
                </div>
              </>
            ) : (
              <div
                key={`current-${activeDev.data.id}`}
                className="mascot-card-slot is-current"
              >
                {renderCard(activeDev, true)}
              </div>
            )}
          </div>

          {/* Navigation Arrow Flank: Right (Crisp White Solid Triangle) */}
          <button
            type="button"
            className="mascot-carousel__nav-btn mascot-carousel__nav-btn--next"
            onClick={pushNext}
            disabled={isPushing}
            aria-label="Next Developer"
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

        {/* Developer Pagination Dots Indicator */}
        <div
          className="mascot-carousel__dots"
          role="tablist"
          aria-label="Developer Selection"
        >
          {developers.map((dev, idx) => {
            const isDotActive = idx === (incomingIndex ?? activeIndex)
            return (
              <button
                key={dev.data.id}
                type="button"
                role="tab"
                aria-selected={isDotActive}
                className={`mascot-carousel__dot ${
                  isDotActive ? 'is-active' : ''
                } mascot-carousel__dot--${dev.type}`}
                onClick={() => {
                  if (idx !== activeIndex && !isPushingRef.current) {
                    triggerPush(idx, idx > activeIndex ? 'next' : 'prev')
                  }
                }}
                title={dev.data.name}
                aria-label={`Show ${dev.data.name}`}
              >
                <span className="mascot-carousel__dot-inner" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)
