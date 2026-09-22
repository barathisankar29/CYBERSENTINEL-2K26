import type { CityLayerConfig } from './cityLayers.config'

/**
 * The `progress` threshold (through NavigationCityScene's own dead zone)
 * at which the six buildings reveal — single source of truth shared with
 * NavigationCityScene.tsx, which imports this rather than redeclaring it.
 * The background's own `motionRange` below is bounded to this same value
 * so its drift is fully finished (clamped) by the moment buildings pop —
 * see the note on `motionRange` below for why that matters.
 */
export const NAVIGATION_REVEAL_PROGRESS = 0.35

/**
 * The navigation city's background — ONE approved, pre-composed image
 * (`new_bg.png`), used exactly as authored: no darkening, no brightening,
 * no additional overlay layers.
 *
 * Constant opacity (`{ from: 1, to: 1 }`) — it is already fully visible
 * and stable the instant this section is on screen, like a normal next
 * page section, not a scroll-driven fade-in. The small translateY/scale
 * drift below tracks this section's own scroll progress, but only up to
 * `NAVIGATION_REVEAL_PROGRESS` (`motionRange.end`), NOT the full 0-1
 * section range — `CityLayer`'s `localProgress` clamps to 1 past a
 * layer's own `motionRange.end`, so once progress crosses the reveal
 * threshold the background is pinned at its final translateY/scale and
 * never resumes drifting, however much further the user scrolls through
 * this section. That's what guarantees the background is fully settled
 * before (and stays settled after) the buildings pop in.
 *
 * `desktop.translateY`/`scale` are also bounded so the (scaled) image
 * ALWAYS fully overscans `.navigation-city-scene__viewport`'s box, at
 * every point in the range: this section is already visibly on screen —
 * scrolled up from below by the hero un-pinning above it — for a full
 * extra viewport-height BEFORE its own scroll progress starts advancing
 * past 0 (progress only moves once this section's own top edge reaches
 * the viewport top). During that entire pre-roll window the layer sits
 * at its `from` values, so those values must be gap-safe on their own,
 * not just at motionRange's end. A constant `scale: 1.06` (6% overscan,
 * ~3vh clear on every edge) safely covers the ±1.5vh translateY drift
 * with margin, so `.navigation-city-scene__viewport`'s own `--city-black`
 * background (see NavigationCityScene.css) can never show through — that
 * exposed black band was the ROOT CAUSE of the visible seam between the
 * hero and this section, not a section-height/spacer/margin issue (their
 * boxes are already perfectly contiguous, see NavigationCityScene.tsx).
 */
export const navigationCityEnvironmentLayers: CityLayerConfig[] = [
  {
    id: 'new-bg',
    src: '/assets/city/navigation/new_bg.png',
    zIndex: 2,
    anchor: 'fill',
    objectPosition: 'center bottom',
    desktop: { translateY: { from: 1.5, to: -1.5 }, scale: { from: 1.06, to: 1.06 }, opacity: { from: 1, to: 1 } },
    mobile: { translateY: { from: 7, to: -1 }, scale: { from: 1.05, to: 1 }, opacity: { from: 1, to: 1 } },
    motionRange: { start: 0, end: NAVIGATION_REVEAL_PROGRESS },
  },
]
