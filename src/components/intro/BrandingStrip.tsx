import type { CSSProperties } from 'react'
import { brandingStripLogos } from './brandingStrip.config'
import './BrandingStrip.css'

interface BrandingStripProps {
  /** Opacity + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

/**
 * The top accreditation/branding strip: ONE shared glass container (the
 * pink/magenta glow belongs to this container only) holding each logo as
 * an independent <img> so they can be sized/reflowed individually. Reveal
 * motion comes entirely from `style` (scroll progress, via IdentityLayer) —
 * nothing here animates on its own. Logos are lazy-loaded since they're
 * secondary to the hero identity; being inside the initial viewport means
 * browsers still load them immediately rather than deferring.
 */
export function BrandingStrip({ style }: BrandingStripProps) {
  return (
    <div className="branding-strip" style={style}>
      {brandingStripLogos.map((logo) => (
        <span key={logo.id} className={logo.blend === 'multiply' ? 'branding-strip__chip' : 'branding-strip__mark'}>
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`branding-strip__logo ${logo.blend === 'multiply' ? 'branding-strip__logo--multiply' : ''}`}
          />
        </span>
      ))}
    </div>
  )
}
