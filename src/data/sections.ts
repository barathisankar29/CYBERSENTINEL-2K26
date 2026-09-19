import type { SiteSection } from '@/types/navigation'

/**
 * Canonical list of site sections, one per navigation building in
 * src/data/navigation.ts. Routing, the city navigation, and any menu UI all
 * read from this file rather than hardcoding section names. Page content
 * for each section lands in a later pass — SectionPage.tsx already resolves
 * `:slug` against this list generically.
 */
export const siteSections: SiteSection[] = [
  { slug: 'events', title: 'Events', shortLabel: 'Events', order: 1, summary: 'Competitions, workshops, and sessions at CYBERSENTINEL 2K26.' },
  { slug: 'timeline', title: 'Timeline', shortLabel: 'Timeline', order: 2, summary: 'The schedule across the symposium.' },
  { slug: 'about', title: 'About', shortLabel: 'About', order: 3, summary: 'About Vel Tech High Tech and CYBERSENTINEL 2K26.' },
  { slug: 'transport', title: 'Transport', shortLabel: 'Transport', order: 4, summary: 'Getting to and from the venue.' },
  { slug: 'credentials', title: 'Credentials', shortLabel: 'Credentials', order: 5, summary: 'Accreditation and certification details.' },
  { slug: 'contact', title: 'Contact', shortLabel: 'Contact', order: 6, summary: 'Reach the organizing team.' },
]
