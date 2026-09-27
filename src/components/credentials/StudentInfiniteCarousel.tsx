import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { CredentialMember } from '@/data/credentials'
import { StudentCircuitCard } from './StudentCircuitCard'
import './StudentInfiniteCarousel.css'

interface StudentInfiniteCarouselProps {
  items: CredentialMember[]
}

const REPEAT_SETS = 5 // 5 cloned sets for uninterrupted infinite traversal
const BASE_SET = 2 // middle set index (0, 1, [2], 3, 4)
const AUTO_DELAY_MS = 2000 // 2.0s delay between movements

export function StudentInfiniteCarousel({ items }: StudentInfiniteCarouselProps) {
  const n = items.length
  const baseIndex = BASE_SET * n

  const [activeIndex, setActiveIndex] = useState(baseIndex)
  const [enableTransition, setEnableTransition] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  // Pre-generate cloned 5-set virtual list
  const extendedList = useMemo(() => {
    if (n === 0) return []
    const list: Array<{
      member: CredentialMember
      originalIndex: number
      globalIndex: number
    }> = []

    for (let s = 0; s < REPEAT_SETS; s++) {
      for (let i = 0; i < n; i++) {
        list.push({
          member: items[i],
          originalIndex: i,
          globalIndex: s * n + i,
        })
      }
    }
    return list
  }, [items, n])

  // Viewport resize detection
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // Infinite Next & Prev
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => prev - 1)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => prev + 1)
  }, [])

  // Unstoppable 2s Auto-Loop (never pauses on mouse hover, keeps moving continuously)
  useEffect(() => {
    if (n === 0) return

    const timer = setTimeout(() => {
      setActiveIndex((prev) => prev + 1)
    }, AUTO_DELAY_MS)

    return () => clearTimeout(timer)
  }, [activeIndex, n])

  // Silent Modulo Normalization:
  // When drifting outside middle buffer range, silently normalize activeIndex to middle set
  useEffect(() => {
    if (n === 0) return

    if (!enableTransition) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true)
        })
      })
      return () => cancelAnimationFrame(frame)
    }

    if (activeIndex >= 3 * n || activeIndex < n) {
      const settleTimer = setTimeout(() => {
        const currentReal = ((activeIndex % n) + n) % n
        const normalized = baseIndex + currentReal
        setEnableTransition(false)
        setActiveIndex(normalized)
      }, 760)

      return () => clearTimeout(settleTimer)
    }
  }, [activeIndex, enableTransition, n, baseIndex])

  // Direct Click-to-Center Handler
  const handleCardClick = (targetGlobalIndex: number) => {
    if (targetGlobalIndex === activeIndex) return
    setActiveIndex(targetGlobalIndex)
  }

  // Jump to specific dot via shortest circular route
  const handleDotClick = (targetDotIndex: number) => {
    const currentReal = ((activeIndex % n) + n) % n
    let diff = targetDotIndex - currentReal
    if (diff > n / 2) diff -= n
    if (diff < -n / 2) diff += n
    setActiveIndex((prev) => prev + diff)
  }

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return
    if (touchDeltaX.current > 45) {
      handlePrev()
    } else if (touchDeltaX.current < -45) {
      handleNext()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  // 3D CoverFlow Geometry Styling matching reference media_1790002846990.jpg
  const getCardStyle = (offset: number): React.CSSProperties => {
    const absOffset = Math.abs(offset)
    const sign = Math.sign(offset)

    const xStep = isMobile ? 88 : 225
    const zStep = isMobile ? -45 : -75
    const rotY = isMobile ? 26 : 38

    if (offset === 0) {
      return {
        transform: 'translateX(0px) translateZ(85px) rotateY(0deg) scale(1)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
        pointerEvents: 'auto',
      }
    }

    if (absOffset === 1) {
      return {
        transform: `translateX(${sign * xStep}px) translateZ(${zStep}px) rotateY(${-sign * rotY}deg) scale(0.86)`,
        zIndex: 20,
        opacity: isMobile ? 0.75 : 0.88,
        filter: 'brightness(0.82)',
        pointerEvents: 'auto',
      }
    }

    if (absOffset === 2) {
      return {
        transform: `translateX(${sign * (xStep * 1.76)}px) translateZ(${zStep * 2}px) rotateY(${-sign * (rotY * 1.25)}deg) scale(0.72)`,
        zIndex: 10,
        opacity: isMobile ? 0 : 0.62,
        filter: 'brightness(0.62)',
        pointerEvents: 'auto',
      }
    }

    if (absOffset === 3) {
      return {
        transform: `translateX(${sign * (xStep * 2.35)}px) translateZ(${zStep * 3}px) rotateY(${-sign * 54}deg) scale(0.56)`,
        zIndex: 5,
        opacity: 0,
        filter: 'brightness(0.35)',
        pointerEvents: 'none',
      }
    }

    // Farther buffer cards
    return {
      transform: `translateX(${sign * (xStep * 2.8)}px) translateZ(${zStep * 4}px) scale(0.4)`,
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      visibility: 'hidden',
    }
  }

  const currentActiveDot = ((activeIndex % n) + n) % n

  if (n === 0) return null

  return (
    <div
      className="infinite-carousel-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D CoverFlow Perspective Stage */}
      <div className="infinite-carousel-stage">
        {extendedList.map(({ member, originalIndex, globalIndex }) => {
          const offset = globalIndex - activeIndex
          const isCenter = offset === 0

          // Render only within visible range buffer (|offset| <= 3) for high performance
          if (Math.abs(offset) > 3) return null

          return (
            <div
              key={globalIndex}
              className={`infinite-carousel-item ${
                enableTransition ? 'infinite-carousel-item--animated' : ''
              } ${isCenter ? 'infinite-carousel-item--active' : ''}`}
              style={getCardStyle(offset)}
              data-active={isCenter}
            >
              <StudentCircuitCard
                member={member}
                isActive={isCenter}
                index={originalIndex + 1}
                onClick={() => handleCardClick(globalIndex)}
              />

              {/* Click to Center Hint Badge on Side Cards */}
              {!isCenter && (
                <div className="infinite-carousel-click-hint" aria-hidden="true">
                  <span>CLICK TO CENTER</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation Controls Bar with Arrow Buttons on the sides of the Dots */}
      <div className="infinite-carousel-controls-bar">
        <button
          type="button"
          className="infinite-carousel-arrow-btn infinite-carousel-arrow-btn--prev"
          onClick={handlePrev}
          aria-label="Previous Student Coordinator"
          title="Previous Coordinator"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          className="infinite-carousel-dots"
          role="tablist"
          aria-label="Student coordinators navigation"
        >
          {items.map((member, idx) => (
            <button
              key={member.id}
              type="button"
              className={`infinite-carousel-dot ${
                idx === currentActiveDot ? 'infinite-carousel-dot--active' : ''
              }`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to coordinator ${member.name}`}
              role="tab"
              aria-selected={idx === currentActiveDot}
            />
          ))}
        </div>

        <button
          type="button"
          className="infinite-carousel-arrow-btn infinite-carousel-arrow-btn--next"
          onClick={handleNext}
          aria-label="Next Student Coordinator"
          title="Next Coordinator"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}


