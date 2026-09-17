import type { CSSProperties } from 'react'
import { identityReveal } from './identityReveal.config'
import type { RevealWindow } from './identityReveal.config'
import { CollegeIdentity } from './CollegeIdentity'
import { SymposiumIdentity } from './SymposiumIdentity'
import './IdentityLayer.css'

/**
 * `t` is this element's own fade-in fraction (0-1 across its start/end
 * window) — used for opacity. `style` uses the FULL scroll progress for
 * translateY, so the element keeps drifting gently for the whole scroll
 * even after it's fully faded in — that's the "own subtle depth" the brief
 * asks for, distinct from the fade timing.
 */
function computeReveal(progress: number, window: RevealWindow): { t: number; style: CSSProperties } {
  const span = window.end - window.start
  const t = span > 0 ? Math.min(Math.max((progress - window.start) / span, 0), 1) : progress >= window.end ? 1 : 0
  const translateY = -(progress * window.depthPx)
  return { t, style: { opacity: t, transform: `translate3d(0, ${translateY}px, 0)` } }
}

interface IdentityLayerProps {
  zIndex: number
  /** Master scroll progress 0-1 (already resolved to 1 under reduced motion by the caller). */
  progress: number
}

/**
 * College logo/name + symposium title/info, all driven by the same master
 * scroll progress as the city layers (see cityLayers.config.ts) but through
 * identityReveal.config.ts's own windows/depths — no timers, no CSS
 * transitions, no independent animation. Lives inside CityScene's sticky
 * viewport so it's pinned to the camera, with a smaller depth multiplier
 * than the city so it reads as part of the scene without matching the
 * city's own parallax 1:1.
 */
export function IdentityLayer({ zIndex, progress }: IdentityLayerProps) {
  const logo = computeReveal(progress, identityReveal.logo)
  const name = computeReveal(progress, identityReveal.name)
  const symposium = computeReveal(progress, identityReveal.symposium)
  const info = computeReveal(progress, identityReveal.info)

  return (
    <div className="identity-layer" style={{ zIndex }}>
      <CollegeIdentity logoStyle={logo.style} nameStyle={name.style} />
      <SymposiumIdentity nameStyle={symposium.style} taglineStyle={symposium.style} infoStyle={info.style} />
    </div>
  )
}
