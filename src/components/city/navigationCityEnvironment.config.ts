import type { CityLayerConfig } from './cityLayers.config'

/**
 * The FOUR dedicated navigation-city environment assets — deliberately
 * separate layers (never flattened). These are the ENTIRE background of
 * the navigation city; nothing from the hero is reused here anymore (see
 * CityJourney.tsx — the hero fades out on its own opacity wrapper before
 * this environment is even halfway established, so there's no point
 * where hero and navigation environment are both visible at real strength).
 *
 * Ordered back to front (see NavigationCityScene.tsx for the full
 * z-index list, including buildings): sky (furthest, deep atmosphere + a
 * hint of skyline) -> distant-city (a closer, more detailed aerial
 * skyline) -> city-environment (the aerial cityscape — roads, water,
 * distant towers — that gives the six landmark buildings somewhere to
 * stand) -> clouds (a thin, mostly-transparent layer drifting in front
 * of all of it).
 *
 * All four finish establishing (reach full opacity) by navProgress ~0.3
 * at the latest — well before the buildings start rising at 0.35 (see
 * src/data/navigation.ts's revealWindows) — so the brief's "new
 * background appears, THEN buildings rise" sequencing is a real gap in
 * scroll progress, not just a visual impression.
 */
export const navigationCityEnvironmentLayers: CityLayerConfig[] = [
  {
    id: 'navigation-sky',
    src: '/assets/city/navigation/navigation-sky.png',
    zIndex: 2,
    anchor: 'fill',
    objectPosition: 'center top',
    // Fades in first, in step with the hero fading out (HERO_FADE_END in
    // CityJourney.tsx) — a crossfade, not a gap, then a hair of continued
    // upward drift for the rest of the scroll matching the camera.
    desktop: { translateY: { from: 4, to: -2 }, scale: { from: 1.03, to: 1 }, opacity: { from: 0, to: 0.9 } },
    mobile: { translateY: { from: 5, to: -1 }, scale: { from: 1.05, to: 1 }, opacity: { from: 0, to: 0.88 } },
    motionRange: { start: 0, end: 1 },
    opacityRange: { start: 0, end: 0.22 },
  },
  {
    id: 'navigation-distant-city',
    src: '/assets/city/navigation/navigation-distant-city.png',
    zIndex: 4,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // A closer, more detailed aerial skyline sitting behind the ground
    // layer — still subdued, "atmosphere + a subdued distant city".
    desktop: { translateY: { from: 6, to: -2 }, scale: { from: 1.05, to: 1 }, opacity: { from: 0, to: 0.42 } },
    mobile: { translateY: { from: 7, to: -1 }, scale: { from: 1.08, to: 1 }, opacity: { from: 0, to: 0.36 } },
    motionRange: { start: 0, end: 1 },
    opacityRange: { start: 0.03, end: 0.25 },
  },
  {
    id: 'navigation-city-environment',
    src: '/assets/city/navigation/navigation-city-environment.png',
    zIndex: 5,
    anchor: 'fill',
    objectPosition: 'center bottom',
    // The environmental grounding the six buildings visually stand in —
    // there is no per-building platform anymore (see Building.tsx); this
    // layer is the entire "ground" now. Capped well under half opacity:
    // a real city is visible, but it must stay quiet support, never
    // competing with the six landmarks.
    desktop: { translateY: { from: 8, to: -1 }, scale: { from: 1.04, to: 1 }, opacity: { from: 0, to: 0.4 } },
    mobile: { translateY: { from: 9, to: -1 }, scale: { from: 1.07, to: 1 }, opacity: { from: 0, to: 0.34 } },
    motionRange: { start: 0, end: 1 },
    opacityRange: { start: 0.06, end: 0.28 },
  },
  {
    id: 'navigation-clouds',
    src: '/assets/city/navigation/navigation-clouds.png',
    zIndex: 11,
    anchor: 'fill',
    objectPosition: 'center center',
    // The front-most environment layer, just behind the buildings — a
    // thin, mostly-transparent atmospheric drift, kept subtle (never
    // above ~0.55 opacity). Last of the four to finish establishing,
    // right before the buildings begin rising.
    desktop: { translateY: { from: 2, to: -3 }, translateX: { from: -3, to: 2 }, opacity: { from: 0, to: 0.55 } },
    mobile: { translateY: { from: 2, to: -2 }, translateX: { from: -2, to: 1 }, opacity: { from: 0, to: 0.45 } },
    motionRange: { start: 0, end: 1 },
    opacityRange: { start: 0.1, end: 0.32 },
  },
]
