import type { CSSProperties } from 'react'
import './CyberSentinelWordmark.css'

interface CyberSentinelWordmarkProps {
  edition: string
  /** This element's own reveal fraction (0-1) — settles the glitch jitter as it finishes revealing. */
  t: number
  /** Master scroll progress (0-1) — feeds a deterministic (not random) glitch offset. */
  progress: number
  /** Opacity + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

/**
 * The CYBERSENTINEL wordmark: a cyberpunk logotype treatment (forward-leaning
 * italic, angular clipped edges, chromatic violet/cyan/magenta edge split)
 * built entirely with CSS transforms/clip-path/pseudo-elements on the
 * project's existing font stack — no bundled display font, no generated
 * logo image. That keeps it a drop-in swap for a real logo asset later:
 * replace the markup below with an <img>/<svg> and this component's
 * consumers (SymposiumIdentity) don't need to change.
 *
 * All motion — reveal opacity/rise AND the glitch offset — is a pure
 * function of scroll progress (t, progress), matching every other layer in
 * this scene: no timers, no autoplay, nothing moves when scrolling stops.
 */
export function CyberSentinelWordmark({ edition, t, progress, style }: CyberSentinelWordmarkProps) {
  // Deterministic jitter (sine/cosine of scroll progress, not Math.random):
  // scrubbing back and forth always reproduces the same offset at the same
  // scroll position. Largest while still revealing, settles to a small
  // permanent chromatic-edge offset once fully visible.
  const jitter = 1.5 + (1 - t) * 5
  const glitchX = Math.sin(progress * 47) * jitter
  const glitchY = Math.cos(progress * 31) * jitter * 0.4

  const groupStyle: CSSProperties = {
    ...style,
    ['--glitch-x' as string]: `${glitchX}px`,
    ['--glitch-y' as string]: `${glitchY}px`,
  }

  return (
    <div className="cyber-wordmark-group" style={groupStyle}>
      <h1 className="cyber-wordmark" data-text="CYBERSENTINEL" aria-label={`CyberSentinel ${edition}`}>
        <span aria-hidden="true">CYBERSENTINEL</span>
      </h1>
      <span className="cyber-wordmark-edition" aria-hidden="true">
        {edition}
      </span>
    </div>
  )
}
