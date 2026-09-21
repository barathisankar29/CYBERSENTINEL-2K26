import type { CityLayerConfig } from './cityLayers.config'

/**
 * The navigation city's background — ONE approved, pre-composed image
 * (`new_bg.png`), used exactly as authored: no darkening, no brightening,
 * no additional overlay layers.
 *
 * Constant opacity (`{ from: 1, to: 1 }`) — it is already fully visible
 * and stable the instant this section is on screen, like a normal next
 * page section, not a scroll-driven fade-in. Only the small translateY/
 * scale drift below still tracks this section's own scroll progress, for
 * a hair of continued camera motion once the buildings are in view —
 * that's independent of (and much subtler than) the opacity, which never
 * animates.
 */
export const navigationCityEnvironmentLayers: CityLayerConfig[] = [
  {
    id: 'new-bg',
    src: '/assets/city/navigation/new_bg.png',
    zIndex: 2,
    anchor: 'fill',
    objectPosition: 'center bottom',
    desktop: { translateY: { from: 6, to: -2 }, scale: { from: 1.03, to: 1 }, opacity: { from: 1, to: 1 } },
    mobile: { translateY: { from: 7, to: -1 }, scale: { from: 1.05, to: 1 }, opacity: { from: 1, to: 1 } },
    motionRange: { start: 0, end: 1 },
  },
]
