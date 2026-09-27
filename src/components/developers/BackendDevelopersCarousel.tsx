import React, { useState, useEffect, useCallback } from 'react'
import type { DeveloperMember } from '@/data/developers'
import { DeveloperGlitchCard } from './DeveloperGlitchCard'
import './BackendDevelopersCarousel.css'

interface BackendDevelopersCarouselProps {
  developers: DeveloperMember[]
}

const AUTO_DELAY_MS = 3000 // 3.0s delay between movements as requested
const TRANSITION_DURATION_MS = 550

export const BackendDevelopersCarousel: React.FC<BackendDevelopersCarouselProps> = ({ developers }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const total = developers.length

  const triggerSlide = useCallback(
    (targetIndex: number, dir: 'next' | 'prev') => {
      if (isTransitioning) return
      const normalized = ((targetIndex % total) + total) % total
      if (normalized === activeIndex) return

      setIncomingIndex(normalized)
      setDirection(dir)
      setIsTransitioning(true)

      setTimeout(() => {
        setActiveIndex(normalized)
        setIncomingIndex(null)
        setIsTransitioning(false)
      }, TRANSITION_DURATION_MS)
    },
    [activeIndex, isTransitioning, total]
  )

  const handleNext = useCallback(() => {
    triggerSlide(activeIndex + 1, 'next')
  }, [activeIndex, triggerSlide])

  const handlePrev = useCallback(() => {
    triggerSlide(activeIndex - 1, 'prev')
  }, [activeIndex, triggerSlide])

  // Unstoppable 3s Auto-Loop (advances every 3 seconds)
  useEffect(() => {
    if (isPaused || isTransitioning || total <= 1) return

    const timer = setTimeout(() => {
      handleNext()
    }, AUTO_DELAY_MS)

    return () => clearTimeout(timer)
  }, [activeIndex, isPaused, isTransitioning, total, handleNext])

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const diff = e.changedTouches[0].clientX - touchStartX
    if (diff > 40) {
      handlePrev()
    } else if (diff < -40) {
      handleNext()
    }
    setTouchStartX(null)
  }

  const activeDev = developers[activeIndex]
  const incomingDev = incomingIndex !== null ? developers[incomingIndex] : null

  return (
    <div
      className="backend-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="backend-carousel"
      aria-label="Backend Developer Carousel"
    >
      {/* Background Holographic Atmosphere Flare */}
      <div
        className="backend-carousel__flare"
        style={{
          background: `radial-gradient(ellipse 65% 50% at 50% 45%, ${activeDev.accentHex}24 0%, ${activeDev.secondaryHex}12 55%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Main Center Carousel Stage (styled like Frontend Developers Carousel) */}
      <div className="backend-carousel__stage">
        {/* Previous Button (like Student Coordinators) */}
        <button
          type="button"
          className="backend-carousel-arrow-btn backend-carousel-arrow-btn--prev"
          onClick={handlePrev}
          disabled={isTransitioning}
          aria-label="Previous Backend Developer"
          title="Previous Developer"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Card Viewport Container */}
        <div className="backend-carousel__card-wrapper">
          {isTransitioning && incomingDev ? (
            <>
              <div
                key={`exit-${activeDev.id}`}
                className={`backend-card-slot is-exiting is-exiting--${direction}`}
              >
                <DeveloperGlitchCard developer={activeDev} isActive={false} />
              </div>
              <div
                key={`enter-${incomingDev.id}`}
                className={`backend-card-slot is-entering is-entering--${direction}`}
              >
                <DeveloperGlitchCard developer={incomingDev} isActive={true} />
              </div>
            </>
          ) : (
            <div
              key={`current-${activeDev.id}`}
              className="backend-card-slot is-current"
            >
              <DeveloperGlitchCard developer={activeDev} isActive={true} />
            </div>
          )}
        </div>

        {/* Next Button (like Student Coordinators) */}
        <button
          type="button"
          className="backend-carousel-arrow-btn backend-carousel-arrow-btn--next"
          onClick={handleNext}
          disabled={isTransitioning}
          aria-label="Next Backend Developer"
          title="Next Developer"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Pagination Indicator Dots (like Student Coordinators) */}
      <div className="backend-carousel-dots" role="tablist" aria-label="Backend Developer Slides">
        {developers.map((dev, idx) => (
          <button
            key={dev.id}
            type="button"
            className={`backend-carousel-dot ${idx === activeIndex ? 'backend-carousel-dot--active' : ''}`}
            onClick={() => triggerSlide(idx, idx > activeIndex ? 'next' : 'prev')}
            aria-label={`Slide ${idx + 1}: ${dev.name}`}
            role="tab"
            aria-selected={idx === activeIndex}
          />
        ))}
      </div>
    </div>
  )
}
