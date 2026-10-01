import { memo, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { getDevicePerfInfo } from '@/utils/devicePerf'
import './ParticleField.css'

const PARTICLE_COLORS = ['var(--city-violet-soft)', 'var(--city-cyan)', 'var(--city-pink)']

interface Particle {
  id: number
  left: number
  top: number
  size: number
  color: string
  baseOpacity: number
  duration: number
  delay: number
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 70, // keep sparse/ambient, favor the upper-mid scene over the busy foreground
    size: 1.5 + Math.random() * 2.5,
    color: PARTICLE_COLORS[id % PARTICLE_COLORS.length],
    baseOpacity: 0.15 + Math.random() * 0.35,
    duration: 18 + Math.random() * 16,
    delay: Math.random() * -30,
  }))
}

interface ParticleFieldProps {
  zIndex: number
  reducedMotion: boolean
  isMobile: boolean
}

/**
 * Sparse, procedural ambient particles — no image asset, no scroll parallax.
 * Category A (camera-anchored): they live inside CityScene's sticky viewport
 * so they never move with the page, only drift gently in place via CSS.
 */
// memo: CityScene re-renders on every scroll frame, but nothing here depends
// on scroll progress — skip re-rendering the whole field each frame.
export const ParticleField = memo(function ParticleField({ zIndex, reducedMotion }: ParticleFieldProps) {
  const particles = useMemo(() => {
    const perf = getDevicePerfInfo()
    return createParticles(perf.particleCount)
  }, [])

  return (
    <div className="particle-field" style={{ zIndex }} aria-hidden="true">
      {particles.map((particle) => {
        // '--particle-opacity' is a CSS custom property, which the installed
        // @types/react version doesn't model on CSSProperties — cast needed.
        const style = {
          left: `${particle.left}%`,
          top: `${particle.top}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          '--particle-color': particle.color,
          animationDuration: reducedMotion ? '0s' : `${particle.duration}s`,
          animationDelay: reducedMotion ? '0s' : `${particle.delay}s`,
          animationPlayState: reducedMotion ? 'paused' : 'running',
          opacity: reducedMotion ? particle.baseOpacity : undefined,
          '--particle-opacity': particle.baseOpacity,
        } as CSSProperties
        return <span key={particle.id} className="particle" style={style} />
      })}
    </div>
  )
})
