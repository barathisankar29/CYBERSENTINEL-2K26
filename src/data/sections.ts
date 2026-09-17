import type { SiteSection } from '@/types/navigation'

/**
 * Canonical list of site sections. This is intentionally empty for now —
 * the real section list (About, Events, Registration, Timeline, Venue,
 * Contact, or otherwise) will be provided later. Routing, the city
 * navigation, and any menu UI should all read from this file rather than
 * hardcoding section names, so the list can change without touching
 * component code.
 */
export const siteSections: SiteSection[] = []
