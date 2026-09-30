import type { DayKey, StationKind, TimelineEvent } from '@/types/timeline'

/**
 * THE SENTINEL JOURNEY — what happens across the two days of CyberSentinel
 * 2K26, as ONE continuous train journey across the three-frame bridge.
 *
 * These are the major PROGRAMME STAGES of the symposium, not the individual
 * competitions (those live on the Events page). Stage names are generic on
 * purpose and there are no times: nothing more specific is confirmed for
 * 2K26 yet. The journey's final destination is the prize distribution.
 */

interface StageContent {
  id: string
  kind: StationKind
  title: string
  description: string
}

const stage = (id: string, title: string, description: string, kind: StationKind = 'stage'): StageContent => ({
  id,
  kind,
  title,
  description,
})

const DAY_1: StageContent[] = [
  stage('registration', 'REGISTRATION', 'Participant arrival, registration and check-in.'),
  stage('inauguration', 'INAUGURATION', 'The official opening ceremony of CyberSentinel 2K26.', 'milestone'),
  stage('welcome', 'WELCOME & INTRODUCTION', 'Welcome address and introduction to the symposium.'),
  stage('technical-programme', 'TECHNICAL & NON-TECHNICAL PROGRAMME', 'The main CyberSentinel activities begin.'),
  stage('day1-closing', 'DAY 01 CLOSING', "Conclusion of the first day's programme."),
]

const DAY_2: StageContent[] = [
  stage('day2-opening', 'DAY 02 OPENING', 'The symposium continues.'),
  stage('techno-cultural', 'TECHNO-CULTURAL ACTIVITIES', "Continuation of the symposium's technical and cultural programme."),
  stage('special-programme', 'SPECIAL / CULTURAL PROGRAMME', 'Major cultural and special activities.'),
  stage('valedictory', 'VALEDICTORY', 'Closing ceremony and conclusion of CyberSentinel 2K26.', 'milestone'),
  stage(
    'prize-distribution',
    'PRIZE DISTRIBUTION',
    'Recognition of winners and achievements. The end of the Sentinel Journey.',
    'destination',
  ),
]

// Stages are spread evenly along the bridge, inset from the outer edges of
// frame 1 and frame 3 so the first and last cards never sit at the very end
// of the generated art (see timelineWorld.ts for the 0-1 world space).
// FIRST_STOP sits clear of the departure point (JOURNEY_BOUNDS.start plus
// the train's half-length), so the train visibly departs and ARRIVES at the
// first stage; LAST_STOP is reachable before the journey's end bound.
const FIRST_STOP = 0.08
const LAST_STOP = 0.95

function layOut(days: [DayKey, StageContent[]][]): TimelineEvent[] {
  const stops = days.flatMap(([day, content]) => content.map((entry) => ({ ...entry, day })))
  const gap = (LAST_STOP - FIRST_STOP) / (stops.length - 1)
  return stops.map((stop, index) => ({ ...stop, position: FIRST_STOP + index * gap }))
}

/** The whole journey, in travel order (left-to-right along the bridge). */
export const timelineEvents: TimelineEvent[] = layOut([
  ['day1', DAY_1],
  ['day2', DAY_2],
])
