import React, { useState, useCallback, useEffect } from 'react'
import { useReducedMotion } from '@/animation/useReducedMotion'
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

// The mascot moves on to its next pose by itself this often (ms). A tap
// still switches immediately and restarts this timer.
const AUTO_POSE_INTERVAL = 3500
const HOP_MS = 600

export const HeroMascotCompanion: React.FC<HeroMascotCompanionProps> = ({ className = '' }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isSparkling, setIsSparkling] = useState(false)

  const reducedMotion = useReducedMotion()

  // Idle animation without a tap: step to the next pose with a little hop
  // (silent — the chirp stays tap-only). Ticks are skipped while the tab is
  // hidden. Re-created on every pose change, so a tap restarts the wait.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return
      setCurrentIdx((prev) => (prev + 1) % CYCLE_ORDER.length)
      if (!reducedMotion) setIsSparkling(true)
    }, AUTO_POSE_INTERVAL)
    return () => window.clearInterval(timer)
  }, [currentIdx, reducedMotion])

  // Ends the hop, however it was started.
  useEffect(() => {
    if (!isSparkling) return
    const timer = window.setTimeout(() => setIsSparkling(false), HOP_MS)
    return () => window.clearTimeout(timer)
  }, [isSparkling])

  const currentExpression = CYCLE_ORDER[currentIdx]
  const sprite = MASCOT_SPRITES[currentExpression]

  // Interactive expression click handler
  const handleMascotClick = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % CYCLE_ORDER.length)
    setIsSparkling(true)

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
