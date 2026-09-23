import type { CharacterConfig, RegistrationPack } from '@/types/characterProfile'
import { characterProfiles, characterList } from '@/data/characterProfiles'

/** Given a purchased pack's id, finds which character it resolves to.
 * This is the single source of truth for "DAY 1 PACK -> NICO" etc. —
 * character assignment is a result of what was purchased, derived here,
 * never chosen directly by the user. */
export function getCharacterForPack(packId: string): { character: CharacterConfig; pack: RegistrationPack } | undefined {
  for (const character of characterList) {
    const pack = character.packs.find((p) => p.id === packId)
    if (pack) return { character, pack }
  }
  return undefined
}

/**
 * Character assignment for the events-terminal's per-event registration
 * flow (src/components/events-terminal/RegisterModal.tsx) — registering
 * for any individual event resolves to the character that event's day/type
 * maps to: Day 1 events -> NICO, Day 2 events -> RUELLE, Group Dance /
 * Thiruvizha Corner -> Dr. DACRE. There is no per-event route to COSMA
 * (Day 1 + Day 2 combined) since the terminal registers one event at a
 * time, not a bundled pack.
 */
export function getCharacterForEvent(eventId: string, day: 1 | 2): CharacterConfig {
  if (eventId === 'group_dance') return characterProfiles.dacre
  if (eventId === 'thiruvizha_corner') return characterProfiles.dacre
  return day === 1 ? characterProfiles.nico : characterProfiles.ruelle
}
