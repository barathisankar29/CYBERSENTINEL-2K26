/** A responsive 3D-ish anchor point for a building within the city world. */
export interface CityPosition {
  x: number
  y: number
  z?: number
  /** Rotation in degrees, if the building needs to face a specific direction. */
  rotation?: number
  /** Relative scale multiplier, 1 = authored size. */
  scale?: number
}

/**
 * A single navigation building in the city. Buildings are the primary
 * navigation mechanism (no traditional navbar during the city experience),
 * so each building maps to exactly one site section.
 */
export interface NavigationBuilding {
  /** Stable identifier, also used as the React key and asset lookup key. */
  id: string
  /** Slug of the SiteSection this building navigates to. */
  sectionSlug: string
  /** Label rendered on/near the building (holographic tag, etc). */
  label: string
  /** Optional short descriptor shown on hover/focus. */
  description?: string
  /** Path to this building's visual asset(s), under public/assets/city/buildings. */
  assetPath?: string
  /** Accent color for this building's neon/glow (violet/magenta/blue/cyan only — never gold). */
  accentColor?: string
  /** Independent placement for desktop vs mobile camera compositions. */
  position: {
    desktop: CityPosition
    mobile: CityPosition
  }
  /** Draw/animation order, lower renders first. */
  order?: number
}

/**
 * A site section reachable either via a city building or a direct route.
 * Kept separate from NavigationBuilding so section content/metadata can
 * exist independently of how (or whether) it's represented in the city.
 */
export interface SiteSection {
  /** URL slug, e.g. "about". */
  slug: string
  /** Full title used on the section page. */
  title: string
  /** Short label used on compact/mobile UI. */
  shortLabel: string
  /** Display/navigation order. */
  order: number
  /** One-line summary for meta tags / building tooltips. */
  summary?: string
}
