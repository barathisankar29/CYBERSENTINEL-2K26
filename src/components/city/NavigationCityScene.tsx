import { useCallback, useRef, useState } from 'react'
import { useScrollProgressVar } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { navigationBuildings } from '@/data/navigation'
import { CityLayer } from './CityLayer'
import { navigationCityEnvironmentLayers, NAVIGATION_REVEAL_PROGRESS } from './navigationCityEnvironment.config'
import { Building } from './buildings/Building'
import { BuildingMascotGuide } from './buildings/BuildingMascotGuide'
import { NavigationCityMobile } from './NavigationCityMobile'
import { RainEffect } from './RainEffect'
import { useWarmBuildingsImages } from './useWarmBuildingsImages'
import { ProfileAccessBadge } from '@/components/ui/ProfileAccessBadge'
import { RegisterNowButton } from '@/components/ui/RegisterNowButton'
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
 * single normal scroll gesture, not several. Defined once, in
 * navigationCityEnvironment.config.ts, and imported here so the
 * background's own motionRange (bounded to the same value) can never
 * drift out of sync with this threshold.
 */
const REVEAL_PROGRESS = NAVIGATION_REVEAL_PROGRESS

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
  // Scroll progress goes straight to the --scene-progress CSS variable (the
  // background layers read it); React only hears about the one boolean it
  // needs, so the six buildings are not re-rendered on every scroll frame.
  const [revealed, setRevealed] = useState(reducedMotion)
  const handleProgress = useCallback((value: number) => setRevealed(value >= REVEAL_PROGRESS), [])
  useScrollProgressVar(spacerRef, { pinned: reducedMotion ? 1 : null, onProgress: handleProgress })
  // Fetch this section's images ahead of time (after the hero has loaded) so
  // arriving here never shows a black screen while they download.
  useWarmBuildingsImages(isMobile)

  // MOBILE — an entirely different container model from desktop: a
  // normal in-flow section sized by the nav image's own natural aspect
  // ratio (see NavigationCityMobile.tsx), NOT a pinned/sticky 100vh
  // viewport — that fixed-height model is what caused letterboxing when
  // it was (wrongly) shared with mobile before. `useScrollProgressVar` above
  // still runs every render (rules of hooks) but safely no-ops here since
  // `spacerRef` never attaches to anything on this branch. Desktop below
  // is completely untouched by this early return.
  if (isMobile) {
    return <NavigationCityMobile />
  }

  return (
    <section
      ref={spacerRef}
      id="buildings"
      className="navigation-city-scene"
      // CityLayer reads its motion from --scene-progress (see progressCss.ts),
      // written by useScrollProgressVar above.
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div className="navigation-city-scene__viewport">
        {navigationCityEnvironmentLayers.map((layer) => (
          <CityLayer key={layer.id} layer={layer} isMobile={isMobile} lazy />
        ))}
        {/* Futuristic Laser Seam & Portal Mist between Hero and Buildings */}
        <div className="navigation-city-scene__horizon-line" aria-hidden="true" />
        <div className="navigation-city-scene__portal-mist" aria-hidden="true" />
        <div className="navigation-city-scene__grid-pattern" aria-hidden="true" />
        <div className="navigation-city-scene__atmosphere-blend" aria-hidden="true" />
        <div className="navigation-city-scene__depth-veil" aria-hidden="true" />
        {/* Above the mist/veil (z 3-5), under the buildings (z 12). */}
        <RainEffect zIndex={6} />
        <ProfileAccessBadge />
        <RegisterNowButton />
        <div className="navigation-city-scene__buildings" style={{ zIndex: BUILDINGS_Z_INDEX }}>
          {navigationBuildings.map((building) => (
            <Building key={building.id} building={building} revealed={revealed} isMobile={isMobile} />
          ))}
        </div>
        {revealed && <BuildingMascotGuide />}
      </div>
    </section>
  )
}
