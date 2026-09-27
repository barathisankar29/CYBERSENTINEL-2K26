import type { CSSProperties } from 'react'
import { driftPx, stageT, windowT } from '@/animation/progressCss'
import { identityReveal, introTaglines } from './identityReveal.config'
import type { RevealWindow, StageRevealWindow } from './identityReveal.config'
import { BrandingStrip } from './BrandingStrip'
import { IntroTagline } from './IntroTagline'
import { PresentedByGroup } from './PresentedByGroup'
import { SymposiumIdentity } from './SymposiumIdentity'
import { RegisterNowButton } from '@/components/ui/RegisterNowButton'
import { HeroMascotCompanion } from '@/components/mascot/HeroMascotCompanion'
import './IdentityLayer.css'

/**
 * Opacity is this element's own fade-in fraction (0-1 across its start/end
 * window). translateY uses the FULL scroll progress, so the element keeps
 * drifting gently for the whole scroll even after it's fully faded in —
 * that's the "own subtle depth" the brief asks for, distinct from the fade
 * timing. Opacity is exactly 0 before `start` — every identity element
 * begins from true darkness. Both are CSS expressions of the scene's
 * `--scene-progress` (see progressCss.ts), so they are computed once and
 * nothing here re-renders while scrolling.
 */
function computeReveal(window: RevealWindow): CSSProperties {
  return {
    opacity: `calc(${windowT(window.start, window.end)})`,
    transform: `translate3d(0, ${driftPx(-window.depthPx)}, 0)`,
  }
}

/** Fades IN, holds, then fades back OUT — for the transient intro taglines. */
function computeStageReveal(window: StageRevealWindow): CSSProperties {
  return {
    opacity: `calc(${stageT(window.fadeInStart, window.fadeInEnd, window.fadeOutStart, window.fadeOutEnd)})`,
    transform: `translate3d(0, ${driftPx(-window.depthPx)}, 0)`,
  }
}

/** Scroll progress at which the Register Now CTA is visible enough (60%)
 * to accept taps — CityScene tracks it as a boolean. */
export const REGISTER_CTA_INTERACTIVE_PROGRESS =
  identityReveal.registerCta.start + 0.6 * (identityReveal.registerCta.end - identityReveal.registerCta.start)

const brandingStripStyle = computeReveal(identityReveal.brandingStrip)
const departmentStyle = computeReveal(identityReveal.department)
const presentedByStyle = computeReveal(identityReveal.presentedBy)
const presentsStyle = computeReveal(identityReveal.presents)
const symposiumStyle = computeReveal(identityReveal.symposium)
const infoStyle = computeReveal(identityReveal.info)
const registerCtaStyle = computeReveal(identityReveal.registerCta)
const mascotStyle = computeReveal(identityReveal.symposium)
const taglineStyles = introTaglines.map((tagline) => computeStageReveal(tagline.window))

interface IdentityLayerProps {
  zIndex: number
  /** Whether the Register Now CTA accepts taps — only once it is mostly
   * visible, so an invisible button never swallows a tap during the reveal. */
  ctaInteractive: boolean
}

/**
 * The full staged hero reveal — atmospheric taglines, then the top
 * branding strip, then the CyberSentinel logo — all driven by the same
 * master scroll progress as the city layers (see cityLayers.config.ts) but
 * through identityReveal.config.ts's own windows/depths. No timers, no CSS
 * transitions, no independent animation: everything here is a pure
 * function of the scene's scroll progress. Lives inside CityScene's sticky
 * viewport so it's pinned to the camera. The branding strip is pinned near
 * the top independent of the centered CyberSentinel block; the taglines and
 * that centered block share the same screen position as independent
 * full-bleed overlays, so their mutual crossfade is handled by opacity
 * alone, not layout.
 *
 * The centered college logo/name (CollegeIdentity) has been removed from
 * this hero position — see .identity-layer__center's padding-bottom in
 * IdentityLayer.css for the resulting upward nudge into the space it used
 * to occupy. CollegeIdentity.tsx/.css are left in place, unused, in case
 * the college identity is placed elsewhere later. In its place, the
 * "presented by" text hierarchy (department -> association -> "Presents")
 * now reveals directly above the CyberSentinel logo — see
 * PresentedByGroup.tsx.
 *
 * The Register Now CTA reveals last, directly under the CyberSentinel
 * identity.
 */
export function IdentityLayer({ zIndex, ctaInteractive }: IdentityLayerProps) {
  return (
    <div className="identity-layer" style={{ zIndex }}>
      <div className="identity-layer__top">
        <BrandingStrip style={brandingStripStyle} />
      </div>
      {introTaglines.map((tagline, index) => (
        <div key={tagline.id} className="identity-layer__stage">
          <IntroTagline text={tagline.text} style={taglineStyles[index]} />
        </div>
      ))}
      <div className="identity-layer__center">
        <PresentedByGroup
          departmentStyle={departmentStyle}
          associationStyle={presentedByStyle}
          presentsStyle={presentsStyle}
        />
        <SymposiumIdentity nameStyle={symposiumStyle} taglineStyle={symposiumStyle} infoStyle={infoStyle} />
        <div
          className="identity-layer__cta"
          style={{ ...registerCtaStyle, pointerEvents: ctaInteractive ? 'auto' : 'none' }}
        >
          <RegisterNowButton variant="hero" />
        </div>
      </div>

      {/* Floating Hero Cyber Mascot Companion */}
      <div className="identity-layer__mascot" style={mascotStyle}>
        <HeroMascotCompanion />
      </div>
    </div>
  )
}
