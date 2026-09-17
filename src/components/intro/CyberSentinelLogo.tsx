import type { CSSProperties } from 'react'
import { BrandLogo } from './BrandLogo'

interface CyberSentinelLogoProps {
  /** Opacity + translateY from IdentityLayer's scroll-driven reveal. */
  style: CSSProperties
}

/**
 * The CyberSentinel brand mark — real artwork
 * (public/assets/branding/cybersentinel-logo.png), not CSS-rendered type or
 * an added glitch/RGB-split effect layer; the artwork already carries its
 * own cyberpunk identity, including "2K26" as part of the lockup. All
 * motion comes from `style`, computed from scroll progress by
 * IdentityLayer — this component has no animation of its own.
 */
export function CyberSentinelLogo({ style }: CyberSentinelLogoProps) {
  return (
    <BrandLogo
      src="/assets/branding/cybersentinel-logo.png"
      alt="CyberSentinel 2K26"
      maxWidth="30rem"
      maxWidthMobile="16rem"
      style={style}
    />
  )
}
