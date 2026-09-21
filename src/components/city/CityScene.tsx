import { useRef } from 'react'
import { useScrollProgress } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { IdentityLayer } from '@/components/intro/IdentityLayer'
import { CityLayer } from './CityLayer'
import { ParticleField } from './ParticleField'
import { cityLayers } from './cityLayers.config'
import './CityScene.css'

const PARTICLE_Z_INDEX = 8
const IDENTITY_Z_INDEX = 9

/** The hero's own scroll distance, driving its own internal cinematic reveal. */
const HERO_SCROLL_VH = 400

/**
 * The opening hero city — a normal, self-contained page section (its own
 * spacer + sticky viewport + scroll progress), not sharing scroll
 * mechanics with anything after it. It runs its own internal
 * scroll-driven reveal exactly as before; once its spacer's height is
 * exhausted, it un-pins and scrolls away like any ordinary section,
 * handing off to whatever section follows it in the page (see
 * HomePage.tsx) purely through normal document flow — no shared
 * progress value, no cross-fade with the next section.
 */
export function CityScene() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const { progress: scrollProgress } = useScrollProgress(spacerRef)
  const progress = reducedMotion ? 1 : scrollProgress

  return (
    <section ref={spacerRef} className="city-scene" style={{ height: `${HERO_SCROLL_VH}vh` }}>
      <div className="city-scene__viewport">
        {cityLayers.map((layer) => (
          <CityLayer key={layer.id} layer={layer} progress={progress} isMobile={isMobile} />
        ))}
        <ParticleField zIndex={PARTICLE_Z_INDEX} reducedMotion={reducedMotion} />
        <IdentityLayer zIndex={IDENTITY_Z_INDEX} progress={progress} />
      </div>
    </section>
  )
}
