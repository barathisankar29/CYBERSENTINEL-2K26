export interface CatalogEvent {
  id: string
  name: string
  description: string
  venue: string
  time: string
  fee: string
  crew: string
}

/**
 * Informational listing for the Events discovery page (see
 * pages/EventsProfilePage.tsx) — these events are shown so a visitor can
 * see what Day 1 / Day 2 actually contain, but aren't individually
 * purchasable on their own; they're bundled into DAY 1 PACK / DAY 2 PACK
 * (see data/characterProfiles.ts for the actual purchasable options).
 * Content matches the site's real event data (src/data/eventsTerminalData.ts).
 */
export const DAY_1_EVENTS: CatalogEvent[] = [
  {
    id: 'paper-presentation',
    name: 'Paper Presentation',
    description: 'Showcase cutting-edge technical insights across AI, cyber defense, IoT, quantum computing, and distributed networks before an esteemed panel of researchers.',
    venue: 'Seminar Hall A / Floor 2',
    time: '10:00 AM - 01:00 PM',
    fee: '₹200 / Team',
    crew: '2-3 Members',
  },
  {
    id: 'cypher-coding',
    name: 'Cypher Coding',
    description: 'Decipher obfuscated logic puzzles, encrypted algorithms, and reverse-engineer compiled snippets under high-pressure clock decay penalties.',
    venue: 'Systems Lab 01 / Block B',
    time: '11:30 AM - 02:00 PM',
    fee: '₹150 / Solo',
    crew: 'Solo',
  },
  {
    id: 'unsaid',
    name: 'Unsaid',
    description: 'Express thoughts, narratives, and unspoken perspectives through expressive acting, silent charades, and emotional articulation without vocal speech.',
    venue: 'Open Air Auditorium',
    time: '01:30 PM - 03:30 PM',
    fee: '₹100 / Duo',
    crew: '2 Members',
  },
  {
    id: 'weblica',
    name: 'Weblica',
    description: 'Transform raw wireframe briefs into responsive, visually arresting UI/UX prototypes and retro-futuristic web designs within the time limit.',
    venue: 'Web Lab 03 / Floor 1',
    time: '02:30 PM - 05:00 PM',
    fee: '₹150 / Cadet',
    crew: '1-2 Designers',
  },
  {
    id: 'x-coders',
    name: 'X-Coders',
    description: 'A hardcore competitive coding tournament featuring bug hunting, blind coding phases, and collaborative speed algorithm challenges.',
    venue: 'Main CAD Dock / Lab 02',
    time: '03:30 PM - 06:00 PM',
    fee: '₹200 / Pair',
    crew: '2 Members',
  },
]

export const DAY_2_EVENTS: CatalogEvent[] = [
  {
    id: 'connections',
    name: 'Connections',
    description: 'Deduce computer science terminology, pop culture lore, and cinema titles by discovering cryptic logical connections between random pictures.',
    venue: 'Room 302 / Main Block',
    time: '12:00 PM - 02:00 PM',
    fee: '₹100 / Crew',
    crew: '2-3 Members',
  },
  {
    id: 'bgm',
    name: 'BGM',
    description: 'Test your cinema and video game audio acuity by recognizing theme scores, background tracks, and iconic instrumental stems in seconds.',
    venue: 'Audio Auditorium 01',
    time: '09:30 AM - 11:30 AM',
    fee: '₹100 / Crew',
    crew: '2-3 Players',
  },
  {
    id: 'lyrics',
    name: 'Lyrics',
    description: 'Unleash your music IQ by finishing missing song lyrics, deciphering reversed vocal recordings, and humming iconic musical hooks to victory.',
    venue: 'Seminar Hall B / Block C',
    time: '11:00 AM - 01:00 PM',
    fee: '₹100 / Crew',
    crew: '2-4 Members',
  },
  {
    id: 'mixed-signal',
    name: 'Mixed Signal',
    description: 'A fast-paced reflex tournament featuring opposite action commands, Stroop effects, reverse cues, and high-intensity cognitive challenges.',
    venue: 'Central Plaza Stage',
    time: '01:30 PM - 03:00 PM',
    fee: '₹50 / Player',
    crew: 'Solo',
  },
  {
    id: 'talent-show',
    name: 'Talent Show',
    description: 'Showcase your distinct artistic mastery — standup comedy, beatboxing, instrumental music, mimicry, or theatrical performances before an enthusiastic audience.',
    venue: 'Main Auditorium / Stage 1',
    time: '02:30 PM - 05:00 PM',
    fee: '₹150 / Entry',
    crew: 'Solo or Group (1-4)',
  },
]

export const SPECIAL_EVENTS: CatalogEvent[] = [
  {
    id: 'group-dance',
    name: 'Group Dance',
    description: 'High-energy dance battle where collegiate dance crews unleash synchronized moves, thematic costumes, and explosive rhythms on the mega stage.',
    venue: 'Open Air Mega Stage',
    time: '04:30 PM - 07:00 PM',
    fee: '₹590 / Crew',
    crew: '6-15 Members',
  },
  {
    id: 'thiruvizha-corner',
    name: 'Thiruvizha Corner',
    description: 'Festive carnival zone featuring student-run cultural game booths, savory street food, craft merchandise, and interactive celebratory carnival fun.',
    venue: 'Festival Quadrangle / Ground',
    time: '10:00 AM - 05:00 PM',
    fee: '₹690 / Entry',
    crew: 'Open to All',
  },
]
