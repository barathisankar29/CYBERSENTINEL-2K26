import { identityExitFraction } from '@/animation/timingConfig'
import { CollegeIdentity } from './CollegeIdentity'
import { SymposiumIdentity } from './SymposiumIdentity'
import './IdentityLayer.css'

interface IdentityLayerProps {
  zIndex: number
  logoVisible: boolean
  nameVisible: boolean
  symposiumVisible: boolean
  infoVisible: boolean
  /** Post-settle scroll progress 0-1. Ignored (identity stays put) under reduced motion. */
  scrollProgress: number
  reducedMotion: boolean
}

/**
 * Category A (camera-anchored): lives inside CityScene's sticky viewport so
 * it never scroll-parallaxes with the city, but fades out as the user makes
 * their first scroll past the settled intro, handing off toward the future
 * camera transition. Entrance timing (logo -> name -> symposium -> info)
 * comes from useIntroSequence; exit is driven directly by scroll position,
 * not a fixed duration.
 */
export function IdentityLayer({
  zIndex,
  logoVisible,
  nameVisible,
  symposiumVisible,
  infoVisible,
  scrollProgress,
  reducedMotion,
}: IdentityLayerProps) {
  const exitT = reducedMotion ? 0 : Math.min(scrollProgress / identityExitFraction, 1)
  const exitOpacity = 1 - exitT
  const exitTranslateY = -exitT * 24

  return (
    <div
      className="identity-layer"
      style={{
        zIndex,
        opacity: exitOpacity,
        transform: `translate3d(0, ${exitTranslateY}px, 0)`,
        pointerEvents: exitT >= 1 ? 'none' : 'auto',
      }}
    >
      <CollegeIdentity logoVisible={logoVisible} nameVisible={nameVisible} />
      <SymposiumIdentity symposiumVisible={symposiumVisible} infoVisible={infoVisible} />
    </div>
  )
}
