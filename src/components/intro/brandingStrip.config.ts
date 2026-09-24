export interface BrandingStripLogo {
  id: string
  src: string
  alt: string
  /** Intrinsic pixel dimensions — reserves layout space so the strip never shifts as images load. */
  width: number
  height: number
  /**
   * 'multiply' is for logos supplied with an opaque WHITE background (no
   * real alpha) — multiply-blending against this strip's dark glass
   * container makes the white fade into it instead of showing as a box.
   * Genuinely transparent logos omit this.
   */
  blend?: 'multiply'
}

/**
 * The top branding/accreditation strip's contents, in left-to-right order —
 * add/remove/reorder a logo here without touching BrandingStrip.tsx.
 */
export const brandingStripLogos: BrandingStripLogo[] = [
  { id: 'aicte', src: '/assets/branding/aicte-logo.webp', alt: 'AICTE', width: 316, height: 316 },
  { id: 'naac', src: '/assets/branding/naac-logo.png', alt: 'NAAC Accredited Grade A', width: 225, height: 225, blend: 'multiply' },
  {
    id: 'vel-tech',
    src: '/assets/branding/vel-tech-high-tech-logo.png',
    alt: 'Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College',
    width: 504,
    height: 93,
    blend: 'multiply',
  },
  { id: 'nba', src: '/assets/branding/nba-logo.png', alt: 'National Board of Accreditation', width: 225, height: 225, blend: 'multiply' },
  {
    id: 'hackathon-club',
    src: '/assets/branding/hackathon_club_logo.webp',
    alt: 'Hackathon Club',
    width: 1152,
    height: 1152,
  },
]
