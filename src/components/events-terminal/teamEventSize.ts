import type { TeamPackage } from '@/services/registration';

export type TeamEvent = TeamPackage['events'][number];

/** Most members a team can have (Paper Presentation teams are 4). */
const MAX_TEAM_SIZE = 4;

/** Sizes a team can be for one event: the event's own range, clamped to 2..MAX_TEAM_SIZE. */
export function eventSizeRange(event: TeamEvent): [number, number] {
  return [Math.max(2, event.min_team_size), Math.min(MAX_TEAM_SIZE, event.max_team_size)];
}

export function eventFitsSize(event: TeamEvent, size: number): boolean {
  const [min, max] = eventSizeRange(event);
  return size >= min && size <= max;
}
