import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { IdentityLayer } from '@/components/intro/IdentityLayer'
import { CityLayer } from './CityLayer'
import { ParticleField } from './ParticleField'
import { cityLayers } from './cityLayers.config'
import './CityScene.css'

const PARTICLE_Z_INDEX = 8
const IDENTITY_Z_INDEX = 9

interface CitySceneProps {
  /** The hero's own 0-1 progress — already resolved for reduced motion by CityJourney. */
  progress: number
}

/**
 * The opening cinematic city's actual content — city layers, particles,
 * identity reveal. Purely a function of `progress`; owns no scroll
 * mechanics of its own (see CityJourney.tsx, which computes `progress`
 * and renders this inside its single shared sticky viewport). Every
 * visual change here is still a pure function of `progress`, exactly as
 * before — this component's own content/timing/behavior is unchanged,
 * only how it receives `progress` and where it's mounted changed.
 */
export function CityScene({ progress }: CitySceneProps) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()

  return (
    <>
      {cityLayers.map((layer) => (
        <CityLayer key={layer.id} layer={layer} progress={progress} isMobile={isMobile} />
      ))}
      <ParticleField zIndex={PARTICLE_Z_INDEX} reducedMotion={reducedMotion} />
      <IdentityLayer zIndex={IDENTITY_Z_INDEX} progress={progress} />
    </>
  )
}
