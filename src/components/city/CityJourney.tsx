import { useRef } from 'react'
import { useScrollProgress } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { CityScene } from './CityScene'
import { NavigationCityScene } from './NavigationCityScene'
import './CityJourney.css'

/** The hero's own scroll distance — unchanged from before this refactor. */
const HERO_SCROLL_VH = 400
/** The navigation transition's own scroll distance — unchanged from before this refactor. */
const TRANSITION_SCROLL_VH = 260
const TOTAL_SCROLL_VH = HERO_SCROLL_VH + TRANSITION_SCROLL_VH
const HERO_FRACTION = HERO_SCROLL_VH / TOTAL_SCROLL_VH

/**
 * How much of the navigation phase's own progress the hero takes to fully
 * fade out — reaching 0 well before the navigation environment/buildings
 * are established, so there is never a moment where the outgoing hero and
 * the incoming navigation city are both visibly active at once.
 */
const HERO_FADE_END = 0.22

function remap(progress: number, start: number, end: number): number {
  const span = end - start
  if (span <= 0) return progress >= end ? 1 : 0
  return Math.min(Math.max((progress - start) / span, 0), 1)
}

/**
 * The full opening journey — hero city, then the navigation city — as ONE
 * continuous scroll-driven camera move inside a SINGLE sticky viewport.
 *
 * Previously the hero (CityScene) and the navigation city
 * (NavigationCityScene) were two separate spacer+sticky sections stacked
 * in the page. That created a visible seam: for roughly one
 * viewport-height of scroll, the hero's sticky content (already unpinned,
 * scrolling away normally) and the navigation section's sticky content
 * (not yet pinned, scrolling in normally) were BOTH partially on screen
 * at once — read as "the hero slides down while the buildings slide up",
 * two posters sliding past each other, not a camera move into a new
 * scene.
 *
 * This component owns the ONE spacer (the combined scroll distance) and
 * the ONE sticky viewport both former sections now render into.
 * `progress` (0-1 across that whole distance) splits into `heroProgress`
 * (the hero's own 0-1 — its content and timing are byte-for-byte
 * untouched, see CityScene.tsx) and `navProgress` (the navigation
 * phase's own 0-1, see NavigationCityScene.tsx). The hero's rendered
 * output is wrapped in a div whose opacity fades to 0 early in
 * `navProgress` (HERO_FADE_END) — a pure function of scroll position, not
 * a new hero animation — so the hero is fully gone before the navigation
 * environment/buildings become prominent. Everything happens inside the
 * same fixed screen rectangle: nothing physically slides past anything else.
 */
export function CityJourney() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { progress: scrollProgress } = useScrollProgress(spacerRef)

  const progress = reducedMotion ? 1 : scrollProgress
  const heroProgress = remap(progress, 0, HERO_FRACTION)
  const navProgress = remap(progress, HERO_FRACTION, 1)
  const heroOpacity = 1 - remap(navProgress, 0, HERO_FADE_END)

  return (
    <section ref={spacerRef} className="city-journey" style={{ height: `${TOTAL_SCROLL_VH}vh` }}>
      <div className="city-journey__viewport">
        <div className="city-journey__hero" style={{ opacity: heroOpacity }}>
          <CityScene progress={heroProgress} />
        </div>
        <NavigationCityScene progress={navProgress} />
      </div>
    </section>
  )
}
