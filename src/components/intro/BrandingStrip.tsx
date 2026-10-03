import type { CSSProperties } from 'react'
import { brandingStripLogos } from './brandingStrip.config'
import './BrandingStrip.css'

interface BrandingStripProps {
  /** Opacity + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

/**
 * The top accreditation/branding strip: ONE shared container (a soft dark
 * backing for contrast, no glow) holding each logo as
 * an independent <img> so they can be sized/reflowed individually. Reveal
 * motion comes entirely from `style` (scroll progress, via IdentityLayer) —
 * nothing here animates on its own. Logos are lazy-loaded since they're
 * secondary to the hero identity; being inside the initial viewport means
 * browsers still load them immediately rather than deferring.
 */
export function BrandingStrip({ style }: BrandingStripProps) {
  const velTechLogo = brandingStripLogos.find((logo) => logo.id === 'vel-tech')
  const badgeLogos = brandingStripLogos.filter((logo) => logo.id !== 'vel-tech')

  return (
    <div className="branding-strip" style={style}>
      {velTechLogo && (
        <div className="branding-strip__main" data-logo-id="vel-tech">
          <img
            src={velTechLogo.src}
            alt={velTechLogo.alt}
            width={velTechLogo.width}
            height={velTechLogo.height}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="branding-strip__logo branding-strip__logo--hero"
          />
        </div>
      )}
      <div className="branding-strip__badges">
        {badgeLogos.map((logo) => (
          <span
            key={logo.id}
            data-logo-id={logo.id}
            className={logo.blend === 'multiply' ? 'branding-strip__chip' : 'branding-strip__mark'}
          >
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
    </div>
  )
}
