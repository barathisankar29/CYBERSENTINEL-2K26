import type { CSSProperties } from 'react'
import './IntroTagline.css'

interface IntroTaglineProps {
  text: string
  /** Opacity (fade in then out) + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

/**
 * A single transient "atmospheric storytelling" statement (Stage 2/3 of the
 * hero reveal) — premium/technical typography, restrained pink/magenta glow,
 * no glitch. Purely presentational: all fade-in/hold/fade-out timing comes
 * from `style`, computed from scroll progress by IdentityLayer.
 */
export function IntroTagline({ text, style }: IntroTaglineProps) {
  return (
    <p className="intro-tagline" style={style}>
      {text}
    </p>
  )
}
