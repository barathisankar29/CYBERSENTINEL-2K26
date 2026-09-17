import { useRef } from 'react'
import { useScrollProgress } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { CityLayer } from './CityLayer'
import { cityLayers } from './cityLayers.config'
import './CityScene.css'

/**
 * How long the reveal plays out over, in viewport heights of scroll. Raise
 * for a slower/longer scroll-driven reveal, lower for a snappier one.
 */
const SCROLL_LENGTH_VH = 220

/** Static composition shown when prefers-reduced-motion is on (no scroll-driven movement). */
const REDUCED_MOTION_PROGRESS = 0.4

/**
 * Full-screen cinematic city reveal: a tall scroll region with a sticky
 * viewport inside it, layering the city parallax images (see
 * cityLayers.config.ts) at independent depths/speeds as the user scrolls.
 */
export function CityScene() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const { progress: liveProgress } = useScrollProgress(spacerRef)
  const progress = reducedMotion ? REDUCED_MOTION_PROGRESS : liveProgress

  return (
    <section
      ref={spacerRef}
      className="city-scene"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
      aria-hidden="true"
    >
      <div className="city-scene__viewport">
        {cityLayers.map((layer) => (
          <CityLayer key={layer.id} layer={layer} progress={progress} isMobile={isMobile} />
        ))}
      </div>
    </section>
  )
}
