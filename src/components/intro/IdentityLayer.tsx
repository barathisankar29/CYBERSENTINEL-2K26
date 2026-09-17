import type { CSSProperties } from 'react'
import { identityReveal, introTaglines } from './identityReveal.config'
import type { RevealWindow, StageRevealWindow } from './identityReveal.config'
import { BrandingStrip } from './BrandingStrip'
import { CollegeIdentity } from './CollegeIdentity'
import { IntroTagline } from './IntroTagline'
import { SymposiumIdentity } from './SymposiumIdentity'
import './IdentityLayer.css'

/**
 * `t` is this element's own fade-in fraction (0-1 across its start/end
 * window) — used for opacity. `style` uses the FULL scroll progress for
 * translateY, so the element keeps drifting gently for the whole scroll
 * even after it's fully faded in — that's the "own subtle depth" the brief
 * asks for, distinct from the fade timing. Opacity is exactly 0 before
 * `start` — every identity element begins from true darkness.
 */
function computeReveal(progress: number, window: RevealWindow): { t: number; style: CSSProperties } {
  const span = window.end - window.start
  const t = span > 0 ? Math.min(Math.max((progress - window.start) / span, 0), 1) : progress >= window.end ? 1 : 0
  const translateY = -(progress * window.depthPx)
  return { t, style: { opacity: t, transform: `translate3d(0, ${translateY}px, 0)` } }
}

/** Fades IN, holds, then fades back OUT — for the transient intro taglines. */
function computeStageReveal(progress: number, window: StageRevealWindow): CSSProperties {
  let opacity: number
  if (progress <= window.fadeInStart || progress >= window.fadeOutEnd) {
    opacity = 0
  } else if (progress < window.fadeInEnd) {
    opacity = (progress - window.fadeInStart) / (window.fadeInEnd - window.fadeInStart)
  } else if (progress < window.fadeOutStart) {
    opacity = 1
  } else {
    opacity = 1 - (progress - window.fadeOutStart) / (window.fadeOutEnd - window.fadeOutStart)
  }
  const translateY = -(progress * window.depthPx)
  return { opacity, transform: `translate3d(0, ${translateY}px, 0)` }
}

interface IdentityLayerProps {
  zIndex: number
  /** Master scroll progress 0-1 (already resolved to 1 under reduced motion by the caller). */
  progress: number
}

/**
 * The full staged hero reveal — atmospheric taglines, then college
 * identity, then the top branding strip, then the CyberSentinel logo — all
 * driven by the same master scroll progress as the city layers (see
 * cityLayers.config.ts) but through identityReveal.config.ts's own
 * windows/depths. No timers, no CSS transitions, no independent animation:
 * everything here is a pure function of `progress`. Lives inside
 * CityScene's sticky viewport so it's pinned to the camera. The branding
 * strip is pinned near the top independent of the centered
 * college/CyberSentinel block; the taglines and that centered block share
 * the same screen position as independent full-bleed overlays, so their
 * mutual crossfade is handled by opacity alone, not layout.
 */
export function IdentityLayer({ zIndex, progress }: IdentityLayerProps) {
  const brandingStrip = computeReveal(progress, identityReveal.brandingStrip)
  const logo = computeReveal(progress, identityReveal.logo)
  const name = computeReveal(progress, identityReveal.name)
  const symposium = computeReveal(progress, identityReveal.symposium)
  const info = computeReveal(progress, identityReveal.info)

  return (
    <div className="identity-layer" style={{ zIndex }}>
      <div className="identity-layer__top">
        <BrandingStrip style={brandingStrip.style} />
      </div>
      {introTaglines.map((tagline) => (
        <div key={tagline.id} className="identity-layer__stage">
          <IntroTagline text={tagline.text} style={computeStageReveal(progress, tagline.window)} />
        </div>
      ))}
      <div className="identity-layer__center">
        <CollegeIdentity logoStyle={logo.style} nameStyle={name.style} />
        <SymposiumIdentity nameStyle={symposium.style} taglineStyle={symposium.style} infoStyle={info.style} />
      </div>
    </div>
  )
}
