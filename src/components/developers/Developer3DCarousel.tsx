import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { DeveloperMember } from '@/data/developers'
import { DeveloperGlitchCard } from './DeveloperGlitchCard'
import './Developer3DCarousel.css'

interface Developer3DCarouselProps {
  developers: DeveloperMember[]
}

export const Developer3DCarousel: React.FC<Developer3DCarouselProps> = ({ developers }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef<number>(0)
  const dragStartAngle = useRef<number>(0)
  const currentAngleRef = useRef<number>(0)
  currentAngleRef.current = rotationAngle

  const total = developers.length
  const stepAngle = 360 / total // 60 degrees for 6 cards

  // Viewport detection for 3D radius scaling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Rotate to specific index using shortest angular distance
  const rotateToIndex = useCallback((targetIndex: number) => {
    const normalizedTarget = ((targetIndex % total) + total) % total
    setActiveIndex(normalizedTarget)

    // Calculate target angle based on 60deg steps
    const current = currentAngleRef.current
    const targetDeg = -normalizedTarget * stepAngle

    // Find closest equivalent rotation
    const diff = (targetDeg - current) % 360
    let shortest = diff
    if (diff > 180) shortest -= 360
    if (diff < -180) shortest += 360

    setRotationAngle((prev) => prev + shortest)
  }, [total, stepAngle])

  const nextSlide = useCallback(() => {
    rotateToIndex(activeIndex + 1)
  }, [activeIndex, rotateToIndex])

  const prevSlide = useCallback(() => {
    rotateToIndex(activeIndex - 1)
  }, [activeIndex, rotateToIndex])

  // Auto-rotation timer (3s delay, pauses on hover or active user drag)
  useEffect(() => {
    if (isPaused || isDragging) return
    const timer = setInterval(() => {
      nextSlide()
    }, 3000)
    return () => clearInterval(timer)
  }, [isPaused, isDragging, nextSlide])


  // Keyboard navigation when hovered
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Pointer & Touch handlers attached to stage container
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const onPointerDown = (e: MouseEvent) => {
      // Only drag with primary mouse button
      if (e.button !== 0) return
      setIsDragging(true)
      dragStartX.current = e.clientX
      dragStartAngle.current = currentAngleRef.current
    }

    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - dragStartX.current
      const sensitivity = isMobile ? 0.35 : 0.28
      setRotationAngle(dragStartAngle.current + deltaX * sensitivity)
    }

    const onPointerUp = () => {
      if (!isDragging) return
      setIsDragging(false)
      const nearestIndex = Math.round(-currentAngleRef.current / stepAngle)
      const normalized = ((nearestIndex % total) + total) % total
      rotateToIndex(normalized)
    }

    const onTouchStart = (e: TouchEvent) => {
      setIsDragging(true)
      dragStartX.current = e.touches[0].clientX
      dragStartAngle.current = currentAngleRef.current
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      const deltaX = e.touches[0].clientX - dragStartX.current
      const sensitivity = 0.35
      setRotationAngle(dragStartAngle.current + deltaX * sensitivity)
    }

    const onTouchEnd = () => {
      if (!isDragging) return
      setIsDragging(false)
      const nearestIndex = Math.round(-currentAngleRef.current / stepAngle)
      const normalized = ((nearestIndex % total) + total) % total
      rotateToIndex(normalized)
    }

    el.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)

      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging, isMobile, rotateToIndex, stepAngle, total])

  const activeDev = developers[activeIndex]
  // 3D Cylinder Radius: tuned for 345px desktop / 220px mobile cards
  const cylinderRadius = isMobile ? 185 : 350

  return (
    <div
      ref={stageRef}
      className={`holo-deck ${isDragging ? 'is-dragging' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="3d-carousel"
      aria-label="Meet Our Developers 3D Holographic Matrix"
    >
      {/* Dynamic Ambient Holographic Flare */}
      <div
        className="holo-deck__flare"
        style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 45%, ${activeDev.accentHex}33 0%, ${activeDev.secondaryHex}18 50%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* 3D Perspective Stage Scene */}
      <div className="holo-deck__viewport">
        {/* Holographic Overhead Laser Projector Beams */}
        <div className="holo-deck__projectors" aria-hidden="true">
          <div
            className="holo-deck__beam holo-deck__beam--left"
            style={{ background: `linear-gradient(135deg, ${activeDev.accentHex}40, transparent 70%)` }}
          />
          <div
            className="holo-deck__beam holo-deck__beam--right"
            style={{ background: `linear-gradient(225deg, ${activeDev.secondaryHex}40, transparent 70%)` }}
          />
        </div>

        {/* 3D Rotating Cylinder Rotor */}
        <div
          className="holo-deck__rotor"
          style={{
            transform: `rotateY(${rotationAngle}deg)`,
            transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.18, 0.9, 0.22, 1)',
          }}
        >
          {developers.map((dev, idx) => {
            const cardAngle = idx * stepAngle
            const isCenter = idx === activeIndex

            return (
              <div
                key={dev.id}
                className={`holo-deck__card-socket ${isCenter ? 'is-front' : 'is-orbital'}`}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${cylinderRadius}px)`,
                }}
              >
                <DeveloperGlitchCard
                  developer={dev}
                  isActive={isCenter}
                  onClick={() => {
                    if (!isCenter) {
                      rotateToIndex(idx)
                    }
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Cyber Quick-Nav Chevrons */}
      <div className="holo-deck__nav-flanks">
        <button
          type="button"
          className="holo-deck__nav-btn holo-deck__nav-btn--prev"
          onClick={prevSlide}
          aria-label="Rotate Previous Developer"
          title="Previous Developer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          className="holo-deck__nav-btn holo-deck__nav-btn--next"
          onClick={nextSlide}
          aria-label="Rotate Next Developer"
          title="Next Developer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Sleek Cyber Navigation Dots */}
      <div className="holo-deck__dots" aria-label="Carousel navigation">
        {developers.map((dev, idx) => (
          <button
            key={dev.id}
            type="button"
            className={`holo-deck__dot ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => rotateToIndex(idx)}
            aria-label={`Go to slide ${idx + 1}: ${dev.name}`}
            style={{
              '--dot-color': dev.accentHex,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}

