import { useRef } from 'react'
import type { IntroState } from '@/animation/useIntroSequence'
import { useScrollProgress } from '@/animation/scrollController'
import { useIsMobile } from '@/hooks/useIsMobile'
import { IdentityLayer } from '@/components/intro/IdentityLayer'
import { CityLayer } from './CityLayer'
import { ParticleField } from './ParticleField'
import { cityLayers } from './cityLayers.config'
import './CityScene.css'

/**
 * Scroll distance reserved, in viewport heights, for the post-settle
 * scroll-parallax + identity exit before this section ends. This is
 * deliberately modest — the big reveal already happens during the boot
 * establish sequence, not via scroll. It'll grow once the future
 * navigation city occupies the rest of this scroll region.
 */
const SCROLL_LENGTH_VH = 160

const PARTICLE_Z_INDEX = 8
const IDENTITY_Z_INDEX = 9

interface CitySceneProps {
  intro: IntroState
}

/**
 * The persistent city scene: a tall scroll region with a sticky viewport
 * inside it. Layers establish once (boot sequence, driven by `intro`) and
 * then take on a small continued scroll parallax once `intro.settled`.
 * Ambient particles and the identity overlay live in the same sticky
 * viewport so they share its camera-anchored behavior (see CityLayer.tsx
 * and IdentityLayer.tsx for how establish vs. scroll motion is separated).
 */
export function CityScene({ intro }: CitySceneProps) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { progress: scrollProgress } = useScrollProgress(spacerRef)

  return (
    <section ref={spacerRef} className="city-scene" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <div className="city-scene__viewport">
        {cityLayers.map((layer) => (
          <CityLayer
            key={layer.id}
            layer={layer}
            established={layer.id === 'sky' ? intro.skyVisible : intro.cityVisible}
            scrollProgress={scrollProgress}
            isMobile={isMobile}
            reducedMotion={intro.reducedMotion}
          />
        ))}
        <ParticleField zIndex={PARTICLE_Z_INDEX} reducedMotion={intro.reducedMotion} />
        <IdentityLayer
          zIndex={IDENTITY_Z_INDEX}
          logoVisible={intro.logoVisible}
          nameVisible={intro.nameVisible}
          symposiumVisible={intro.symposiumVisible}
          infoVisible={intro.infoVisible}
          scrollProgress={scrollProgress}
          reducedMotion={intro.reducedMotion}
        />
      </div>
    </section>
  )
}
