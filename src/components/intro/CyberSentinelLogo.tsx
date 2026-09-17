import type { CSSProperties } from 'react'
import { BrandLogo } from './BrandLogo'
import './CyberSentinelLogo.css'

interface CyberSentinelLogoProps {
  /** Opacity + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

/**
 * The CyberSentinel brand mark — real artwork
 * (public/assets/branding/cybersentinel-logo.png), not CSS-rendered type or
 * an added glitch/RGB-split effect layer; the artwork already carries its
 * own cyberpunk identity, including "2K26" as part of the lockup. This is
 * the PRIMARY visual element of the hero — sized as a fraction of the
 * viewport (not a fixed px cap) so it stays dominant at any screen size,
 * capped only to keep it sane on ultra-wide desktops. The asset itself was
 * already trimmed to its visible artwork (937x289, no large transparent
 * margins), so these percentages apply almost directly to the visible mark.
 * Separation from the busy city behind it comes from a soft drop-shadow
 * that hugs the artwork's own silhouette — not a card/panel. All motion
 * comes from `style`, computed from scroll progress by IdentityLayer.
 */
export function CyberSentinelLogo({ style }: CyberSentinelLogoProps) {
  return (
    <BrandLogo
      src="/assets/branding/cybersentinel-logo.png"
      alt="CyberSentinel 2K26"
      width={937}
      height={289}
      maxWidth="min(52vw, 44rem)"
      maxWidthMobile="min(80vw, 30rem)"
      className="cyber-sentinel-logo"
      style={style}
    />
  )
}
