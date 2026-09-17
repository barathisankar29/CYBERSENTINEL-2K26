import type { CSSProperties } from 'react'
import './BrandLogo.css'

interface BrandLogoProps {
  src: string
  alt: string
  /** Intrinsic pixel dimensions — reserves the aspect ratio so nothing shifts as the image loads. */
  width: number
  height: number
  /** Max width at normal (desktop/tablet) viewports — any CSS length. */
  maxWidth: string
  /** Max width under the mobile breakpoint (src/styles/breakpoints.ts). Falls back to `maxWidth`. */
  maxWidthMobile?: string
  /** Defaults to 'eager' — this is meant for primary, immediately-visible hero art. */
  loading?: 'eager' | 'lazy'
  /** Opacity/transform driving this logo's scroll-linked reveal — no animation happens in here. */
  style?: CSSProperties
  /** Extra class for a specific instance's own treatment (e.g. a contact shadow) without touching this file. */
  className?: string
}

/**
 * Generic scroll-driven brand image slot for the hero identity composition.
 * Renders artwork directly — no card, no panel, no background box — at its
 * natural aspect ratio (intrinsic width/height + `object-fit: contain`,
 * never stretched). This is the shared primitive for ANY hero branding
 * image (CyberSentinelLogo today; sponsor marks / partner badges / event
 * seals later reuse this directly with a different `src` + sizing — no new
 * component or rewrite needed for the common case).
 */
export function BrandLogo({
  src,
  alt,
  width,
  height,
  maxWidth,
  maxWidthMobile,
  loading = 'eager',
  style,
  className,
}: BrandLogoProps) {
  const sizeVars = {
    ['--brand-logo-max-width' as string]: maxWidth,
    ['--brand-logo-max-width-mobile' as string]: maxWidthMobile ?? maxWidth,
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      draggable={false}
      className={`brand-logo ${className ?? ''}`.trim()}
      style={{ ...sizeVars, ...style }}
    />
  )
}
