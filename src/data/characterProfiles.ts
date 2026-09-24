import type { CharacterConfig } from '@/types/characterProfile'

/**
 * The real CyberSentinel 2K26 event lineup, grouped into the four
 * registration packs specified for this feature. These are the same 10
 * competitive events already listed on the site (see
 * src/data/eventsTerminalData.ts) — Group Dance and Thiruvizha Corner are
 * deliberately excluded from the day packs and sold as their own
 * independent Dr. Dacre registrations instead, per spec.
 */
const DAY_1_EVENTS = ['Paper Presentation', 'Cypher Coding', 'Unsaid', 'Weblica', 'X-Coders']
const DAY_2_EVENTS = ['Connections', 'BGM', 'Lyrics', 'Mixed Signal', 'Talent Show']

export const characterProfiles: Record<string, CharacterConfig> = {
  nico: {
    id: 'nico',
    name: 'NICO',
    recordId: 'NICO-007',
    image: '/assets/characters/Nico.webp',
    shortImage: '/assets/characters/short_nico.webp',
    theme: {
      primary: '#38bdf8',
      secondary: '#3b82f6',
      accent: '#7dd3fc',
      glow: 'rgba(56, 189, 248, 0.55)',
      textTint: '#bae6fd',
      backgroundGradient: 'radial-gradient(ellipse at 20% 20%, rgba(56,189,248,0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.12) 0%, transparent 55%)',
    },
    quote: '"Systems, people, patterns — same thing."',
    sideLines: ['SYSTEMS', 'PEOPLE', 'PATTERNS', 'SAME THING.'],
    intent: 'Grants full access to Day 1 of CyberSentinel 2K26 — the technical and non-technical events run on the opening day of the symposium, from paper presentation to the UI design arena.',
    packs: [
      { id: 'nico-day1', label: 'DAY 1 PACK', price: 177, events: DAY_1_EVENTS },
    ],
  },
  ruelle: {
    id: 'ruelle',
    name: 'RUELLE',
    recordId: 'RUELLE-077',
    image: '/assets/characters/Ruelle.webp',
    shortImage: '/assets/characters/short_ruelle.webp',
    theme: {
      primary: '#a855f7',
      secondary: '#7c3aed',
      accent: '#d926c9',
      glow: 'rgba(168, 85, 247, 0.55)',
      textTint: '#e9d5ff',
      backgroundGradient: 'radial-gradient(ellipse at 20% 20%, rgba(168,85,247,0.16) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(217,38,201,0.12) 0%, transparent 55%)',
    },
    quote: '"Information always finds me."',
    sideLines: ['INFORMATION', 'RETRIEVAL', 'STRATEGY', 'BEYOND THE ORDINARY.'],
    intent: 'Grants full access to Day 2 of CyberSentinel 2K26 — the puzzle, music, reflex, and performance events that close out the symposium.',
    packs: [
      { id: 'ruelle-day2', label: 'DAY 2 PACK', price: 177, events: DAY_2_EVENTS },
    ],
  },
  dacre: {
    id: 'dacre',
    name: 'Dr. DACRE',
    recordId: 'DACRE-001',
    image: '/assets/characters/Dr_Dacre.webp',
    shortImage: '/assets/characters/short_dr_dacre.webp',
    theme: {
      primary: '#2dd4bf',
      secondary: '#10b981',
      accent: '#5eead4',
      glow: 'rgba(45, 212, 191, 0.55)',
      textTint: '#99f6e4',
      backgroundGradient: 'radial-gradient(ellipse at 20% 20%, rgba(45,212,191,0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 55%)',
    },
    quote: '"Some experiences were never meant to be missed."',
    sideLines: ['SCIENCE', 'PERFORMANCE', 'CULTURE', 'BEYOND THE STAGE.'],
    intent: 'Two standalone showcase registrations — each independently selectable, not bundled into a day pack. Group Dance is the mega-stage crew battle; Thiruvizha Corner is the all-day carnival zone.',
    packs: [
      { id: 'dacre-group-dance', label: 'GROUP DANCE', price: 590, events: ['Group Dance'] },
      { id: 'dacre-thiruvizha', label: 'THIRUVIZHA CORNER', price: 690, events: ['Thiruvizha Corner'] },
    ],
  },
  cosma: {
    id: 'cosma',
    name: 'COSMA',
    recordId: 'COSMA-001',
    image: '/assets/characters/Cosma.webp',
    shortImage: '/assets/characters/short_cosma.webp',
    theme: {
      primary: '#d4af37',
      secondary: '#f5c542',
      accent: '#fde68a',
      glow: 'rgba(212, 175, 55, 0.55)',
      textTint: '#fef3c7',
      backgroundGradient: 'radial-gradient(ellipse at 20% 20%, rgba(212,175,55,0.16) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(245,197,66,0.12) 0%, transparent 55%)',
    },
    quote: '"The next variable is you."',
    sideLines: ['ACCESS', 'EVERYTHING', 'BOTH DAYS', 'NO COMPROMISE.'],
    intent: 'Grants full access to both Day 1 and Day 2 of CyberSentinel 2K26 — every technical and non-technical event across the entire symposium in one registration.',
    packs: [
      { id: 'cosma-full', label: 'DAY 1 + DAY 2 PACK', price: 354, events: [...DAY_1_EVENTS, ...DAY_2_EVENTS] },
    ],
  },
}

export const characterList = Object.values(characterProfiles)
