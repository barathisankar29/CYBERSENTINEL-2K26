/**
 * Utility for managing intro video seen state.
 * Stored in sessionStorage, which is scoped to a single browser tab: every
 * new tab/window plays the cinematic intro, while reloading or navigating
 * back to the homepage within the same tab jumps straight to the experience.
 */

const INTRO_SEEN_KEY = 'cybersentinel_intro_seen'

/**
 * Checks if the intro clip has already played in this tab.
 */
export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Marks the intro clip as seen for this tab.
 */
export function markIntroAsSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, 'true')
  } catch {
    // Ignore sessionStorage error
  }
}

/**
 * Resets the intro seen state so the intro plays again in this tab.
 */
export function resetIntroSeen(): void {
  try {
    sessionStorage.removeItem(INTRO_SEEN_KEY)
  } catch {
    // Ignore sessionStorage error
  }
}
