import { useRef } from 'react'
import { useScrollProgress } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { IdentityLayer } from '@/components/intro/IdentityLayer'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { CityLayer } from './CityLayer'
import { ParticleField } from './ParticleField'
import { cityLayers } from './cityLayers.config'
import './CityScene.css'

/**
 * How much scroll distance (in viewport heights) the opening reveal plays
 * out over — "several viewport heights ... enough to breathe" per the
 * brief. Raise for a slower/longer reveal, lower for a snappier one. This
 * is the single biggest knob for how much scroll control the user has over
 * the parallax.
 */
const SCROLL_LENGTH_VH = 400

const PARTICLE_Z_INDEX = 8
const IDENTITY_Z_INDEX = 9

interface CitySceneProps {
  introCompleted?: boolean
}

/**
 * The opening cinematic city, entirely scroll-driven: a tall scroll region
 * with a sticky viewport inside it. Every visual change — city layers,
 * identity text, everything — is a pure function of `progress` (0-1 through
 * this section). There is no autoplay: stop scrolling and the scene stops;
 * resume and it picks back up exactly where it was. See
 * cityLayers.config.ts and identityReveal.config.ts for the per-element
 * tuning; this component only wires scroll position to `progress`.
 */
export function CityScene({ introCompleted = true }: CitySceneProps) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const { progress: scrollProgress } = useScrollProgress(spacerRef)

  // Reduced motion: skip the parallax entirely and render the fully
  // resolved composition, statically, regardless of actual scroll position.
  const progress = reducedMotion ? 1 : scrollProgress

  return (
    <section ref={spacerRef} className="city-scene" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <div className="city-scene__viewport">
        {cityLayers.map((layer) => (
          <CityLayer key={layer.id} layer={layer} progress={progress} isMobile={isMobile} />
        ))}
        <ParticleField zIndex={PARTICLE_Z_INDEX} reducedMotion={reducedMotion} />
        <IdentityLayer zIndex={IDENTITY_Z_INDEX} progress={progress} />
        <ScrollIndicator progress={progress} visible={introCompleted} />
        {/* Seamless atmospheric bottom gradient blend into About Section */}
        <div className="city-scene__bottom-blend" aria-hidden="true" />
      </div>
    </section>
  )
}
