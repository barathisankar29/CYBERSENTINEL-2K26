import { useCallback, useRef, useState } from 'react'
import { useScrollProgressVar } from '@/animation/scrollController'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { IdentityLayer, REGISTER_CTA_INTERACTIVE_PROGRESS } from '@/components/intro/IdentityLayer'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { CityLayer } from './CityLayer'
import { ParticleField } from './ParticleField'
import { cityLayers } from './cityLayers.config'
import './CityScene.css'

/** Progress past which the "scroll to see magic" hint has done its job. */
const SCROLL_HINT_HIDE_PROGRESS = 0.04

const PARTICLE_Z_INDEX = 8
const IDENTITY_Z_INDEX = 9

/**
 * The hero's own scroll distance, driving its own internal cinematic reveal.
 * Sticky-pin math: the sticky viewport stays pinned for (this value -
 * 100vh) of scroll; the reveal (progress 0->1) uses the first
 * HERO_COMPLETE_AT of that span — 300vh = ~3 viewport-height scrolls of
 * progressive assembly — and the remainder is a hold. Every reveal window (cityLayers.config.ts,
 * identityReveal.config.ts) is expressed as a 0-1 fraction of that span, so
 * shortening it keeps every stage and their relative pacing intact.
 */
const HERO_SCROLL_VH = 475

/**
 * The reveal finishes at this fraction of the hero's scroll; the rest is a
 * hold on the fully-assembled scene so the hero visibly ends before the
 * navigation city scrolls in. 300vh of reveal / 0.8 = 375vh of scroll
 * (HERO_SCROLL_VH - 100vh), i.e. the reveal keeps its original pacing and
 * gains a ~75vh hold at the end.
 */
const HERO_COMPLETE_AT = 0.8

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
interface CitySceneProps {
  /** Whether the intro (video + FuturisticTransition) has finished — gates
   * the "SCROLL TO SEE MAGIC" indicator so it only shows once the hero is
   * actually revealed, not underneath the intro overlays. */
  introCompleted?: boolean
}

export function CityScene({ introCompleted = true }: CitySceneProps) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  // Per-frame progress goes straight to CSS (--scene-progress on the
  // section; see progressCss.ts) — React only re-renders here when one of
  // these two coarse flags actually flips, never on every scroll tick.
  const [scrolledPast, setScrolledPast] = useState(reducedMotion)
  const [ctaInteractive, setCtaInteractive] = useState(reducedMotion)
  const handleProgress = useCallback((progress: number) => {
    setScrolledPast(progress > SCROLL_HINT_HIDE_PROGRESS)
    setCtaInteractive(progress >= REGISTER_CTA_INTERACTIVE_PROGRESS)
  }, [])
  useScrollProgressVar(spacerRef, {
    pinned: reducedMotion ? 1 : null,
    onProgress: handleProgress,
    completeAt: HERO_COMPLETE_AT,
  })

  return (
    <section ref={spacerRef} className="city-scene" style={{ height: `${HERO_SCROLL_VH}vh` }}>
      <div className="city-scene__viewport">
        {cityLayers.map((layer) => (
          <CityLayer key={layer.id} layer={layer} isMobile={isMobile} />
        ))}
        <ParticleField zIndex={PARTICLE_Z_INDEX} reducedMotion={reducedMotion} isMobile={isMobile} />
        <IdentityLayer zIndex={IDENTITY_Z_INDEX} ctaInteractive={ctaInteractive} />
        <ScrollIndicator scrolledPast={scrolledPast} visible={introCompleted} />
      </div>
    </section>
  )
}
