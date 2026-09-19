import type { NavigationBuilding } from '@/types/navigation'

/**
 * Navigation buildings for the city, rendered by
 * src/components/city/NavigationCityScene.tsx as part of the combined
 * hero -> navigation journey (see src/components/city/CityJourney.tsx).
 * `position.desktop`/`.mobile` place each building on the ground plane
 * (x = % across, y = % the base sits above the ground line). `scale` is
 * relative to `events` (1 = full size, the primary anchor). `revealWindow`
 * is this building's own 0-1 window within the navigation phase's own
 * progress (`navProgress` in CityJourney.tsx) — see NavigationCityScene.tsx.
 *
 * All six buildings sit at roughly the SAME foreground level now — `y`
 * only varies slightly (a few points) for natural spacing, not as a
 * back/front depth device. Horizontal order, left to right: credentials,
 * about (LEFT group), events (CENTER), contact, transport, timeline
 * (RIGHT group — far right, open space beyond timeline preserved for the
 * future metro track).
 *
 * `revealWindow`s are clustered tightly (all within navProgress 0.35-0.73)
 * so the six buildings rise as ONE coordinated group with only a slight
 * stagger — not spread across the whole transition. Cards reveal on their
 * own later window (see Building.tsx's `cardT`), after each building has
 * mostly finished rising.
 *
 * Visual hierarchy (desktop `scale`): events (1.12) is the dominant
 * central anchor; about/timeline/transport (~0.72-0.85) are the major
 * landmark tier; credentials/contact (~0.5) stay clearly smaller without
 * going tiny or touching the ground line (`y` > 0 for every building).
 *
 * Positions/scales/windows are a first pass, tuned by eye against the
 * actual artwork — expect to retune after visual review, not a fixed spec.
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
      // Far left, same foreground level as everything else.
      desktop: { x: 11, y: 4, z: 1, scale: 0.5 },
      mobile: { x: 14, y: 6, z: 1, scale: 0.62 },
    },
    order: 1,
    revealWindow: { start: 0.43, end: 0.71 },
  },
  {
    id: 'about',
    sectionSlug: 'about',
    label: 'About',
    description: 'About CVTHT',
    assetPath: '/assets/buildings/about-building.png',
    assetWidth: 941,
    assetHeight: 1672,
    accentColor: 'var(--city-violet)',
    position: {
      // Left of Events, same foreground level — its height (a tall, thin
      // spire) is what reads as "landmark", not elevation/depth.
      desktop: { x: 32, y: 6, z: 2, scale: 0.85 },
      mobile: { x: 30, y: 8, z: 2, scale: 1.05 },
    },
    order: 2,
    revealWindow: { start: 0.37, end: 0.65 },
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
      // RIGHT group — nestled between Events and Transport (not the left
      // cluster), clearly separated from Credentials. `z` set above both
      // neighbors so it paints cleanly on top where their footprints
      // overlap. Lifted off the ground line (`y` > 0) so it reads as a
      // building, not a card pinned to the edge.
      desktop: { x: 63, y: 4, z: 7, scale: 0.42 },
      mobile: { x: 60, y: 4, z: 7, scale: 0.58 },
    },
    order: 3,
    revealWindow: { start: 0.45, end: 0.73 },
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
      // Dead center — the main hub, largest scale, with open `y` for
      // breathing room around its base.
      desktop: { x: 52, y: 8, z: 4, scale: 1.12 },
      mobile: { x: 54, y: 6, z: 4, scale: 1.65 },
    },
    order: 4,
    revealWindow: { start: 0.35, end: 0.63 },
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
      // Right of Events, a clear secondary landmark, same foreground level.
      desktop: { x: 72, y: 4, z: 5, scale: 0.72 },
      mobile: { x: 64, y: 3, z: 5, scale: 0.92 },
    },
    order: 5,
    revealWindow: { start: 0.39, end: 0.67 },
  },
  {
    id: 'timeline',
    sectionSlug: 'timeline',
    label: 'Timeline',
    description: 'Event Timeline',
    assetPath: '/assets/buildings/timeline-building.png',
    assetWidth: 1024,
    assetHeight: 1536,
    accentColor: 'var(--city-cyan)',
    position: {
      // Far right — clear open space beyond it for the future metro
      // track; nothing else placed further right.
      desktop: { x: 84, y: 5, z: 6, scale: 0.82 },
      mobile: { x: 86, y: 5, z: 6, scale: 1.15 },
    },
    order: 6,
    revealWindow: { start: 0.41, end: 0.69 },
  },
]
