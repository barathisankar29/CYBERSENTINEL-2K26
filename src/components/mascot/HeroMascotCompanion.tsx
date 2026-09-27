import React, { useState, useCallback } from 'react'
import { MASCOT_SPRITES, mascotAudio, type MascotExpression } from '@/data/mascot'
import './HeroMascotCompanion.css'

interface HeroMascotCompanionProps {
  className?: string
}

const CYCLE_ORDER: MascotExpression[] = [
  'idle',
  'wave',
  'cheer',
  'curious',
  'happy',
  'smug',
  'float',
  'sleep',
]

export const HeroMascotCompanion: React.FC<HeroMascotCompanionProps> = ({ className = '' }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isSparkling, setIsSparkling] = useState(false)

  const currentExpression = CYCLE_ORDER[currentIdx]
  const sprite = MASCOT_SPRITES[currentExpression]

  // Interactive expression click handler
  const handleMascotClick = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % CYCLE_ORDER.length)
    setIsSparkling(true)
    setTimeout(() => setIsSparkling(false), 600)

    mascotAudio.playChirp(1.0 + Math.random() * 0.4)
  }, [])

  return (
    <div
      className={`hero-mascot-companion ${className}`}
      aria-label="CyberSentinel Interactive Mascot Companion"
    >
      <div className="hero-mascot__dock">
        {/* Mascot Avatar Viewport Stage */}
        <div
          className={`hero-mascot__avatar-stage ${isSparkling ? 'is-reacting' : ''}`}
          onClick={handleMascotClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleMascotClick()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Cyber Ghost in ${sprite.label} pose. Click to switch.`}
          title="Click me to change pose & chirp!"
        >
          {/* Cyberpunk Hologram Glow Ring */}
          <div className="hero-mascot__glow-ring" aria-hidden="true" />

          {/* Mascot Sprite */}
          <img
            src={sprite.src}
            alt={`CyberSentinel Mascot - ${sprite.label}`}
            className="hero-mascot__img"
            draggable={false}
          />

          {/* Interactive Tap Sparkles */}
          {isSparkling && (
            <div className="hero-mascot__sparkles" aria-hidden="true">
              <span className="hero-mascot__sparkle hero-mascot__sparkle--1">✦</span>
              <span className="hero-mascot__sparkle hero-mascot__sparkle--2">★</span>
              <span className="hero-mascot__sparkle hero-mascot__sparkle--3">✦</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
