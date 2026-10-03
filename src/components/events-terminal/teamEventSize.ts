import type { TeamPackage } from '@/services/registration';

export type TeamEvent = TeamPackage['events'][number];

/** Sizes team-management accepts for one event: its own range clamped to 2..3. */
export function eventSizeRange(event: TeamEvent): [number, number] {
  return [Math.max(2, event.min_team_size), Math.min(3, event.max_team_size)];
}

export function eventFitsSize(event: TeamEvent, size: number): boolean {
  const [min, max] = eventSizeRange(event);
  return size >= min && size <= max;
}
