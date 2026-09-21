import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/animation/useReducedMotion'
import './FuturisticTransition.css'

interface FuturisticTransitionProps {
  onComplete: () => void
}

export function FuturisticTransition({ onComplete }: FuturisticTransitionProps) {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState<'blank' | 'beam' | 'reveal'>('blank')

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => {
        onComplete()
      }, 400)
      return () => clearTimeout(timer)
    }

    // Phase 1: Blank pause (0 to 180ms)
    const timer1 = setTimeout(() => {
      setStage('beam')
    }, 180)

    // Phase 2: Beam ignition & text decode (180ms to 650ms)
    const timer2 = setTimeout(() => {
      setStage('reveal')
    }, 650)

    // Phase 3: Aperture opens fully into website (650ms to 1550ms)
    const timer3 = setTimeout(() => {
      onComplete()
    }, 1550)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete, reducedMotion])

  return (
    <div className={`futuristic-transition futuristic-transition--${stage} ${reducedMotion ? 'futuristic-transition--reduced' : ''}`}>
      {/* Top and bottom dark holographic shutter panels */}
      <div className="futuristic-transition__shutter futuristic-transition__shutter--top">
        <div className="futuristic-transition__grid" />
        <div className="futuristic-transition__beam futuristic-transition__beam--top" />
      </div>

      <div className="futuristic-transition__shutter futuristic-transition__shutter--bottom">
        <div className="futuristic-transition__grid" />
        <div className="futuristic-transition__beam futuristic-transition__beam--bottom" />
      </div>

      {/* Center Laser Ignition & Decrypting Text HUD */}
      <div className="futuristic-transition__center-stage">
        <div className="futuristic-transition__laser-line" />
        <div className="futuristic-transition__telemetry">
          <span className="futuristic-transition__status-dot" />
          <span className="futuristic-transition__status-text">INITIALIZING SENTINEL GRID</span>
          <span className="futuristic-transition__bracket">[ONLINE]</span>
        </div>
      </div>

      {/* Ambient radial lens glow bloom */}
      <div className="futuristic-transition__glow-bloom" />
    </div>
  )
}
