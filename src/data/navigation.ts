import type { NavigationBuilding } from '@/types/navigation'

/**
 * Navigation buildings for the city, rendered by
 * src/components/city/NavigationCityScene.tsx as its own page section
 * (see that file — the buildings all pop in together once, gated by a
 * single scroll-threshold boolean, not a per-building scroll window).
 *
 * Every building has its own independent `position` — no shared row,
 * baseline, grid, or common transform anywhere (see Building.tsx).
 * Desktop `x`/`y`/`scale` were each measured independently off
 * `public/assets/city/navigation/ref.png` (2048x768 — a "lineup" style
 * composition guide, NOT the asset we render; ours are the real building
 * PNGs) using a cropped pixel-grid overlay per landmark, exactly like the
 * measurement pass before it, redone against this newer/wider reference
 * image (old ref.jpeg was 1536x1024 and is stale). `scale` is relative to
 * `events` (1 = full size, the primary anchor).
 *
 * Mobile positions are UNCHANGED from the previous pass in this file —
 * out of scope for this "desktop first" correction.
 *
 * Timeline is the one exception to the "simple centered portrait asset"
 * model: its image is a wide landscape canvas (tower on the left, a long
 * track extending right), so `position.anchorXPercent` targets the tower
 * specifically (not the image's midpoint), and it carries its own
 * `maxWidthVwDesktopOverride`/`maxHeightVhMobileOverride` because the
 * shared safety caps (tuned for portrait buildings) would otherwise
 * shrink it to fit a cap sized for a completely different aspect ratio.
 */
export const navigationBuildings: NavigationBuilding[] = [
  {
    id: 'credentials',
    sectionSlug: 'credentials',
    label: 'Credentials',
    description: 'Team & Credits',
    assetPath: '/assets/buildings/credentials-building.png',
    assetWidth: 1254,
    assetHeight: 1254,
    accentColor: 'var(--city-cyan)',
    position: {
      // Measured in ref.png: roof ~(185,350)px of 2048x768, base
      // ~(185,620)px -> x=9%. `y` brought down independently so the base
      // sits in the wet foreground instead of floating above it. Scale
      // pulled in and `y` nudged up slightly so it reads at the same
      // depth as Transport/Timeline rather than sitting closer to the
      // camera than the rest of the row — base stays on the same ground
      // plane (this isn't a downward/upward move, just a smaller,
      // slightly-farther-back read).
      desktop: { x: 9, y: 7, z: 2, scale: 0.45 },
      mobile: { x: 18, y: 8, z: 4, scale: 0.7 },
    },
    order: 1,
    cardEmphasis: 'compact',
  },
  {
    id: 'about',
    sectionSlug: 'about',
    label: 'About',
    description: 'About VTHT',
    assetPath: '/assets/buildings/about-building.png',
    assetWidth: 941,
    assetHeight: 1672,
    accentColor: 'var(--city-violet)',
    position: {
      // Measured in ref.png: spire tip ~(775,65)px, base ~(775,560)px ->
      // x=38%. Tall (rendered height ~89% of Events'). `y` brought down
      // independently so the base sits in the wet foreground. Scale
      // pulled in and `y` nudged up slightly for the same
      // same-depth-as-Transport/Timeline read as the other three.
      desktop: { x: 38, y: 11, z: 5, scale: 0.84 },
      mobile: { x: 26, y: 16, z: 2, scale: 1.1 },
    },
    order: 2,
  },
  {
    id: 'contact',
    sectionSlug: 'contact',
    label: 'Contact',
    description: 'Get in Touch',
    assetPath: '/assets/buildings/contact-building.png',
    assetWidth: 1145,
    assetHeight: 1374,
    accentColor: 'var(--city-magenta)',
    position: {
      // Measured in ref.png: roof ~(505,310)px, base ~(505,600)px ->
      // x=25%. `y` brought down independently so the base sits in the
      // wet foreground. Scale pulled in and `y` nudged up slightly for
      // the same same-depth-as-Transport/Timeline read as the other
      // three.
      desktop: { x: 25, y: 8, z: 3, scale: 0.48 },
      mobile: { x: 38, y: 5, z: 6, scale: 0.52 },
    },
    order: 3,
    cardEmphasis: 'compact',
  },
  {
    id: 'events',
    sectionSlug: 'events',
    label: 'Events',
    description: 'Explore Events',
    assetPath: '/assets/buildings/events-building.png',
    assetWidth: 944,
    assetHeight: 1665,
    accentColor: 'var(--city-pink)',
    position: {
      // Measured in ref.png: top ~(1055,45)px, base ~(1055,600)px ->
      // x=52% — the tallest silhouette and scale=1 anchor. `y` brought
      // down independently so the base sits in the wet foreground. Scale
      // pulled in and `y` nudged up slightly for the same
      // same-depth-as-Transport/Timeline read as the other three; `x`
      // shifted right for breathing room between About and Transport,
      // still the central landmark.
      desktop: { x: 57, y: 9, z: 6, scale: 0.95 },
      mobile: { x: 51, y: 12, z: 3, scale: 1.45 },
    },
    order: 4,
    cardEmphasis: 'prominent',
  },
  {
    id: 'transport',
    sectionSlug: 'transport',
    label: 'Transport',
    description: 'Travel & Routes',
    assetPath: '/assets/buildings/transport-building.png',
    assetWidth: 944,
    assetHeight: 1666,
    accentColor: 'var(--city-blue)',
    position: {
      // Right foreground landmark, base on the SAME low-`y` ground plane
      // as credentials/about/contact/events. Positioned so only its own
      // left/upper edge overlaps the FINAL stretch of Timeline's track
      // (not the station, not most of the track — see Timeline's own
      // position/anchorXPercent below) — `x` is deliberately close to
      // the track's own endpoint, not centered under the whole Timeline
      // asset. `z` is higher than Timeline's, so Transport paints in
      // front of that small overlap area rather than the reverse.
      desktop: { x: 93, y: 6, z: 4, scale: 0.85 },
      mobile: { x: 82, y: 8, z: 5, scale: 0.95 },
    },
    order: 5,
  },
  {
    id: 'timeline',
    sectionSlug: 'timeline',
    label: 'Timeline',
    description: 'Event Timeline',
    assetPath: '/assets/buildings/timeline-building.png',
    assetWidth: 1215,
    assetHeight: 1295,
    accentColor: 'var(--city-cyan)',
    position: {
      // Upper-right, set back BEHIND the foreground landmarks (moderate
      // `y`, smaller `scale`) so it reads as occupying an elevated spot
      // within the city skyline itself — not sitting on the foreground
      // wet platform, but also not pushed so far back it floats above
      // the water/horizon in isolation. Its track extends from here
      // toward the foreground/right, where the large Transport sits (see
      // Transport's own position) — the track visually disappears
      // behind/into Transport rather than ending in open space.
      // `anchorXPercent` targets the tower (roughly the left third of
      // the canvas), leaving the track free to extend toward Transport.
      desktop: { x: 81, y: 33, z: 1, scale: 0.42, anchorXPercent: 32 },
      mobile: { x: 85, y: 31, z: 1, scale: 0.88, anchorXPercent: 32 },
    },
    order: 6,
    maxWidthVwDesktopOverride: 85,
    maxHeightVhMobileOverride: 70,
  },
]
