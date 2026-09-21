import { useRef } from 'react'
import { useScrollProgress } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { navigationBuildings } from '@/data/navigation'
import { CityLayer } from './CityLayer'
import { navigationCityEnvironmentLayers } from './navigationCityEnvironment.config'
import { Building } from './buildings/Building'
import { NavigationCityMobile } from './NavigationCityMobile'
import './NavigationCityScene.css'

// Above every navigationCityEnvironmentLayers entry — buildings always
// paint in front of the whole environment stack.
const BUILDINGS_Z_INDEX = 12

/**
 * This section's own scroll distance — a short pinned "dead zone" past
 * one viewport height, NOT a cinematic scene length. Just enough room
 * for: background is immediately visible and stable, then one further
 * scroll gesture (REVEAL_PROGRESS) pops the buildings in, then a little
 * settle room before this section un-pins and normal scrolling continues
 * to whatever comes next in the page.
 */
const SCROLL_VH = 150

/**
 * The `progress` threshold (through this section's own dead zone) at
 * which the buildings reveal. Deliberately small — reachable with a
 * single normal scroll gesture, not several.
 */
const REVEAL_PROGRESS = 0.35

/**
 * The navigation city — a normal page section (its own spacer + sticky
 * viewport + scroll progress, entirely separate from the hero's, see
 * CityScene.tsx). The background renders at a constant, already-settled
 * opacity the instant this section is pinned (see
 * navigationCityEnvironment.config.ts — no scroll-driven fade-in); the
 * six buildings stay hidden until scroll progress through this section's
 * own short dead zone crosses REVEAL_PROGRESS, at which point `revealed`
 * flips true for all of them at once and a real CSS transition (not
 * scroll-scrubbed per-frame values, see Building.css) pops them into
 * their final, already-authored positions together — no per-building
 * stagger, no multi-scroll build-up.
 */
export function NavigationCityScene() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const { progress: scrollProgress } = useScrollProgress(spacerRef)
  const progress = reducedMotion ? 1 : scrollProgress
  const revealed = progress >= REVEAL_PROGRESS

  // MOBILE — an entirely different container model from desktop: a
  // normal in-flow section sized by the nav image's own natural aspect
  // ratio (see NavigationCityMobile.tsx), NOT a pinned/sticky 100vh
  // viewport — that fixed-height model is what caused letterboxing when
  // it was (wrongly) shared with mobile before. `useScrollProgress` above
  // still runs every render (rules of hooks) but safely no-ops here since
  // `spacerRef` never attaches to anything on this branch. Desktop below
  // is completely untouched by this early return.
  if (isMobile) {
    return <NavigationCityMobile />
  }

  return (
    <section ref={spacerRef} className="navigation-city-scene" style={{ height: `${SCROLL_VH}vh` }}>
      <div className="navigation-city-scene__viewport">
        {navigationCityEnvironmentLayers.map((layer) => (
          <CityLayer key={layer.id} layer={layer} progress={progress} isMobile={isMobile} />
        ))}
        <div className="navigation-city-scene__buildings" style={{ zIndex: BUILDINGS_Z_INDEX }}>
          {navigationBuildings.map((building) => (
            <Building key={building.id} building={building} revealed={revealed} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  )
}
