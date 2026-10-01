import type { CSSProperties } from 'react'
import { BrandLogo } from './BrandLogo'
import './CyberSentinelLogo.css'

interface CyberSentinelLogoProps {
  /** Opacity + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

const LOGO_SRC = '/assets/branding/cybersentinel-logo.webp'
const MAX_WIDTH = 'min(46vw, 40rem, 78vh)'
const MAX_WIDTH_MOBILE = 'min(86vw, 30rem)'

/**
 * The CyberSentinel brand mark — real artwork
 * (public/assets/branding/cybersentinel-logo.webp), including "2K26" as part
 * of the lockup. This is the PRIMARY visual element of the hero — sized as a
 * fraction of the viewport (not a fixed px cap) so it stays dominant at any
 * screen size, capped only to keep it sane on ultra-wide desktops. The asset
 * itself was already trimmed to its visible artwork (937x289, no large
 * transparent margins), so these percentages apply almost directly to the
 * visible mark. Separation from the busy city behind it comes from a soft
 * drop-shadow that hugs the artwork's own silhouette — not a card/panel.
 *
 * Glitch: the logo itself never moves — it only flickers. During a burst,
 * thin horizontal slices of the artwork tear sideways and pink/cyan
 * RGB-split ghosts snap in and out (see CyberSentinelLogo.css). Slices
 * reuse the same image as a background and the ghosts are flat colour
 * masked by it, so there is no extra download. All scroll motion comes from `style`, computed from
 * scroll progress by IdentityLayer, and is applied to the wrapper so the
 * glitch copies reveal together with the logo.
 */
export function CyberSentinelLogo({ style }: CyberSentinelLogoProps) {
  const vars = {
    '--brand-logo-max-width': MAX_WIDTH,
    '--brand-logo-max-width-mobile': MAX_WIDTH_MOBILE,
    '--cs-logo-mask': `url(${LOGO_SRC})`,
  } as CSSProperties

  return (
    <div className="cyber-sentinel-logo-wrap" style={{ ...vars, ...style }}>
      <div className="cyber-sentinel-logo-glitch">
        <BrandLogo
          src={LOGO_SRC}
          alt="CyberSentinel 2K26"
          width={937}
          height={289}
          maxWidth={MAX_WIDTH}
          maxWidthMobile={MAX_WIDTH_MOBILE}
          className="cyber-sentinel-logo"
        />
        <span className="cyber-sentinel-logo-split cyber-sentinel-logo-split--pink" aria-hidden="true" />
        <span className="cyber-sentinel-logo-split cyber-sentinel-logo-split--cyan" aria-hidden="true" />
        <span className="cyber-sentinel-logo-slice cyber-sentinel-logo-slice--a" aria-hidden="true" />
        <span className="cyber-sentinel-logo-slice cyber-sentinel-logo-slice--b" aria-hidden="true" />
      </div>
    </div>
  )
}
