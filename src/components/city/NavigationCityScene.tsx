import { useIsMobile } from '@/hooks/useIsMobile'
import { navigationBuildings } from '@/data/navigation'
import { CityLayer } from './CityLayer'
import { navigationCityEnvironmentLayers } from './navigationCityEnvironment.config'
import { Building } from './buildings/Building'
import './NavigationCityScene.css'

// Above every navigationCityEnvironmentLayers entry (navigation-clouds,
// the front-most, tops out at 11) — buildings always paint in front of
// the whole environment stack.
const BUILDINGS_Z_INDEX = 12

interface NavigationCitySceneProps {
  /** The navigation phase's own 0-1 progress — see CityJourney.tsx. */
  progress: number
}

/**
 * The navigation city's actual content — environment layers and the six
 * navigation buildings. Purely a function of `progress`; owns no scroll
 * mechanics of its own (see CityJourney.tsx, which computes `progress`
 * and renders this inside the single shared sticky viewport, directly
 * after the hero fades out — not a separately-pinned section anymore, so
 * there's no physical handoff/slide against the hero).
 */
export function NavigationCityScene({ progress }: NavigationCitySceneProps) {
  const isMobile = useIsMobile()

  return (
    <>
      {navigationCityEnvironmentLayers.map((layer) => (
        <CityLayer key={layer.id} layer={layer} progress={progress} isMobile={isMobile} />
      ))}
      <div className="navigation-city-scene__buildings" style={{ zIndex: BUILDINGS_Z_INDEX }}>
        {navigationBuildings.map((building) => (
          <Building key={building.id} building={building} progress={progress} isMobile={isMobile} />
        ))}
      </div>
    </>
  )
}
