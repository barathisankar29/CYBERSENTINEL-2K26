/** A responsive 3D-ish anchor point for a building within the city world. */
export interface CityPosition {
  /** Horizontal placement, % across the city ground plane (0 = left edge, 100 = right edge). */
  x: number
  /** How far the building's base sits above the ground line, % of the scene height (0 = resting on it, higher = set further back/up). */
  y: number
  z?: number
  /** Rotation in degrees, if the building needs to face a specific direction. */
  rotation?: number
  /**
   * Relative size multiplier against this composition's own base size (see
   * BASE_HEIGHT_VH_DESKTOP/BASE_WIDTH_VW_MOBILE in Building.tsx) — desktop
   * and mobile scale independently, so the same building's desktop and
   * mobile `scale` are not directly comparable to each other, only to
   * other buildings' scale within the same variant.
   */
  scale?: number
}

/** A window of the (0-1) navigation-city transition progress a building's rise animation is remapped across. */
export interface RevealWindow {
  start: number
  end: number
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
  /** Title shown in the building's floating info card. */
  label: string
  /** Short descriptive line shown under `label` in the same card. */
  description?: string
  /** Path to this building's visual asset(s), under public/assets/buildings. */
  assetPath?: string
  /** Intrinsic pixel dimensions of `assetPath` — preserves aspect ratio in the responsive vh/vw size clamp (see Building.tsx). */
  assetWidth: number
  assetHeight: number
  /** Accent color for this building's neon/glow (violet/magenta/blue/cyan only — never gold). */
  accentColor?: string
  /** Independent placement for desktop vs mobile camera compositions. */
  position: {
    desktop: CityPosition
    mobile: CityPosition
  }
  /** Draw/animation order, lower renders first. */
  order?: number
  /** When this building rises/fades in during the navigation-city transition's own scroll progress. */
  revealWindow: RevealWindow
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
