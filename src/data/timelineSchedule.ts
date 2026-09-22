import type { TimelineEvent } from '@/types/timeline'

/**
 * The 12 physical station positions on the bridge, normalized (0-1)
 * across the COMPLETE three-frame world — see
 * src/components/timeline/timelineWorld.ts for how the frames map into
 * that same 0-1 space (frame 1 ≈ 0-0.334, frame 2 ≈ 0.334-0.667, frame 3
 * ≈ 0.667-1). Four evenly-spaced stops per frame, inset from each frame's
 * own edges so no card ever anchors right at a frame seam.
 *
 * Day 1 and Day 2 are two different SCHEDULES sharing these exact same
 * physical stations — Day 1 reaches them in this order (left-to-right),
 * Day 2 reaches them in reverse order (right-to-left). Never a second set
 * of stations.
 */
const STATION_POSITIONS = [
  0.05, 0.1268, 0.2068, 0.2835, // frame 1
  0.3836, 0.4602, 0.5402, 0.6169, // frame 2
  0.7168, 0.7935, 0.8734, 0.95, // frame 3
]

/**
 * Placeholder per-day schedule content — none of the times/titles/
 * descriptions below are real, replace once the actual event schedule is
 * finalized. Content is intentionally decoupled from position: swap,
 * add, or remove entries freely, the architecture supports any count.
 */
const DAY1_CONTENT: Omit<TimelineEvent, 'day' | 'position'>[] = [
  { id: 'day1-registration', time: '08:30 AM', title: 'Registration Opens', description: 'Placeholder — check-in details to be confirmed.' },
  { id: 'day1-inauguration', time: '09:00 AM', title: 'Inauguration', description: 'Placeholder — opening ceremony details to be confirmed.' },
  { id: 'day1-keynote', time: '10:00 AM', title: 'Keynote Session', description: 'Placeholder — keynote speaker and topic to be confirmed.' },
  { id: 'day1-workshop', time: '11:15 AM', title: 'Workshop Track', description: 'Placeholder — workshop lineup to be confirmed.' },
  { id: 'day1-tech-talk', time: '12:30 PM', title: 'Tech Talk Series', description: 'Placeholder — speaker lineup to be confirmed.' },
  { id: 'day1-lunch', time: '01:30 PM', title: 'Lunch Break', description: 'Placeholder — venue details to be confirmed.' },
  { id: 'day1-ctf', time: '02:30 PM', title: 'CTF Round 1', description: 'Placeholder — capture-the-flag round details to be confirmed.' },
  { id: 'day1-panel', time: '03:45 PM', title: 'Security Panel', description: 'Placeholder — panelist lineup to be confirmed.' },
  { id: 'day1-demo', time: '04:30 PM', title: 'Demo Showcase', description: 'Placeholder — showcased projects to be confirmed.' },
  { id: 'day1-networking', time: '05:15 PM', title: 'Networking Mixer', description: 'Placeholder — venue and format to be confirmed.' },
  { id: 'day1-recap', time: '06:00 PM', title: 'Day 1 Recap', description: 'Placeholder — recap format to be confirmed.' },
  { id: 'day1-wrap', time: '06:30 PM', title: 'Day 1 Wrap', description: 'Placeholder — closing remarks to be confirmed.' },
]

const DAY2_CONTENT: Omit<TimelineEvent, 'day' | 'position'>[] = [
  { id: 'day2-briefing', time: '09:00 AM', title: 'Morning Briefing', description: 'Placeholder — briefing agenda to be confirmed.' },
  { id: 'day2-masterclass', time: '09:45 AM', title: 'Masterclass', description: 'Placeholder — session details to be confirmed.' },
  { id: 'day2-hackathon-start', time: '10:30 AM', title: 'Hackathon Begins', description: 'Placeholder — hackathon rules to be confirmed.' },
  { id: 'day2-mentor', time: '11:30 AM', title: 'Mentor Rounds', description: 'Placeholder — mentor lineup to be confirmed.' },
  { id: 'day2-lunch', time: '01:00 PM', title: 'Lunch Break', description: 'Placeholder — venue details to be confirmed.' },
  { id: 'day2-cultural', time: '02:00 PM', title: 'Cultural Showcase', description: 'Placeholder — performance schedule to be confirmed.' },
  { id: 'day2-panel', time: '03:00 PM', title: 'Industry Panel', description: 'Placeholder — panelist lineup to be confirmed.' },
  { id: 'day2-hackathon-end', time: '03:45 PM', title: 'Hackathon Finals', description: 'Placeholder — finalist showcase details to be confirmed.' },
  { id: 'day2-judging', time: '04:30 PM', title: 'Judging Round', description: 'Placeholder — judging criteria to be confirmed.' },
  { id: 'day2-awards', time: '05:15 PM', title: 'Awards Ceremony', description: 'Placeholder — award categories to be confirmed.' },
  { id: 'day2-closing-note', time: '05:45 PM', title: 'Closing Note', description: 'Placeholder — closing remarks to be confirmed.' },
  { id: 'day2-farewell', time: '06:00 PM', title: 'Farewell', description: 'Placeholder — farewell details to be confirmed.' },
]

function withPositions(day: 'day1' | 'day2', content: Omit<TimelineEvent, 'day' | 'position'>[]): TimelineEvent[] {
  return content.map((entry, index) => ({ ...entry, day, position: STATION_POSITIONS[index] }))
}

/** Single flat, data-driven schedule for both days — see TimelineEvent's
 * doc comment for why `position` is shared between the two days. */
export const timelineEvents: TimelineEvent[] = [
  ...withPositions('day1', DAY1_CONTENT),
  ...withPositions('day2', DAY2_CONTENT),
]
