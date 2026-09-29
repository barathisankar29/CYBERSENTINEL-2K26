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
  { slug: 'about', title: 'About', shortLabel: 'About', order: 3, summary: 'About Vel Tech High Tech, CyberSentinel 2K26, Hackathon Club, College Leadership, and Convenors.' },
  {
    slug: 'transportation',
    title: 'Transportation & Campus Navigation',
    shortLabel: 'Transport',
    order: 4,
    summary: 'College Bus Transit, Government MTC Bus Routes, Campus Directions & Live Tactical Nav Grid',
  },
  { slug: 'credentials', title: 'Coordinators', shortLabel: 'Coordinators', order: 5, summary: 'Student Coordinators, Developers, Editing Experts, and Designers.' },
  { slug: 'contact', title: 'Contact', shortLabel: 'Contact', order: 6, summary: 'Reach the organizing team.' },
]
