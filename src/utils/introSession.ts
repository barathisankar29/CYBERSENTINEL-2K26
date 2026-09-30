/**
 * Intro video state: the cinematic intro plays on EVERY visit — each fresh
 * open or reload of the site. Only moving around inside the site (e.g.
 * coming back to the home page from another page) skips it, so it is
 * tracked in memory for the current page load, never persisted.
 */

// Earlier builds remembered the intro for 7 days (cookie + storage); those
// flags are cleared so they can't keep skipping it for returning visitors.
const LEGACY_KEY = 'cybersentinel_intro_seen'

let playedThisLoad = false

function clearLegacyFlags(): void {
  if (typeof document === 'undefined') return
  try {
    document.cookie = `${LEGACY_KEY}=; path=/; max-age=0; SameSite=Lax`
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
}
clearLegacyFlags()

/** Whether the intro already played (or was skipped) during this page load. */
export function hasSeenIntro(): boolean {
  return playedThisLoad
}

/** Marks the intro as done for the rest of this page load. */
export function markIntroAsSeen(): void {
  playedThisLoad = true
}

/** Lets the intro play again (e.g. a "replay intro" control). */
export function resetIntroSeen(): void {
  playedThisLoad = false
}
