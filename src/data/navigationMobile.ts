/**
 * Mobile-only navigation card layout, keyed by NavigationBuilding.id (see
 * src/data/navigation.ts). This is a SEPARATE presentation from desktop —
 * consumed only by NavigationCityMobile.tsx, never by the desktop
 * Building.tsx path — so desktop's own `position.mobile` entries in
 * navigation.ts are intentionally left untouched/unused here.
 *
 * Coordinates are percentages of the background image itself (it renders
 * at its own natural aspect ratio — see NavigationCityMobile.tsx/.css —
 * so these stay correctly anchored to the picture's actual content at
 * any phone width), matching
 * public/assets/city/navigation/navigation-mobile.webp — a high-angle
 * portrait composition (941x1672, ~9:16) with six landmarks:
 *   - left obelisk tower tagged "VTHD"        -> about
 *   - tall center tower lit "EVENTS"          -> events
 *   - right tower lit "BUS / TRANSPORT"       -> transport
 *   - small rooftop-dish building, left/mid   -> credentials
 *   - "Website" storefront, bottom-center      -> contact
 *   - "TIME GATE" cube, lower-right           -> timeline
 *
 * `anchor` is where the card's connector tip sits (the card is positioned
 * ABOVE this point via `align`, exactly like desktop's card-above-building
 * pattern) — `anchor.y` is always strictly less than `target.y` for every
 * entry, so every connector runs straight DOWN from card to building,
 * never up. `target` is the point on the building the connector line runs
 * to, and where the synchronized hover/touch glow lands.
 *
 * Cards are deliberately staggered (not one flat top row) and spaced apart
 * both from each other and from the frame edges — see the per-card notes
 * below for which quadrant each occupies.
 */
export interface MobileNavCardLayout {
  /** left-aligned cards grow rightward from `anchor.x`, right-aligned grow leftward, center is centered on it. */
  align: 'left' | 'center' | 'right'
  anchor: { x: number; y: number }
  target: { x: number; y: number }
}

export const mobileNavigationLayout: Record<string, MobileNavCardLayout> = {
  // Upper-center, topmost — the primary landmark gets the top slot alone.
  events: {
    align: 'center',
    anchor: { x: 50, y: 11 },
    target: { x: 51, y: 28 },
  },
  // Upper-left, staggered a little lower than Events so the two don't
  // form a single flat row.
  about: {
    align: 'left',
    anchor: { x: 5, y: 23 },
    target: { x: 17, y: 41 },
  },
  // Upper-right, staggered a little lower than Events (mirrors About).
  transport: {
    align: 'right',
    anchor: { x: 95, y: 25 },
    target: { x: 86, y: 34 },
  },
  // Middle-left, well clear of About above it.
  credentials: {
    align: 'left',
    anchor: { x: 4, y: 46 },
    target: { x: 17, y: 56 },
  },
  // Middle-right, paired horizontally with Credentials.
  timeline: {
    align: 'right',
    anchor: { x: 96, y: 47 },
    target: { x: 84, y: 63 },
  },
  // Lower-left/lower-middle — sits above the Website storefront. The
  // Website building itself sits at bottom-CENTER of the composition (not
  // left), so target.x is pulled in to its actual roofline/sign, not the
  // empty plaza to the card's own lower-right.
  contact: {
    align: 'left',
    anchor: { x: 10, y: 64 },
    target: { x: 50, y: 70 },
  },
}
