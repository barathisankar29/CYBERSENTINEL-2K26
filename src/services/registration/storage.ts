import type { LastRegistration } from './types'

/**
 * Same key and shape the backend team's reference client writes after a
 * successful submission (register2/js/registration.js). It only remembers
 * which registration to look up — status always comes from the backend.
 */
const STORAGE_KEY = 'cs_last_registration'

export function getLastRegistration(): LastRegistration | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LastRegistration) : null
  } catch {
    return null
  }
}

export function saveLastRegistration(record: LastRegistration): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Storage unavailable (private mode etc.) — the registration itself
    // already succeeded server-side, so this is non-fatal.
  }
}
