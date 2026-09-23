/**
 * Utility for managing intro video seen state across user sessions.
 * Stores state in cookies (with fallback to sessionStorage & localStorage)
 * so that new users see the cinematic intro, while returning users jump directly to the experience.
 */

const INTRO_COOKIE_KEY = 'cybersentinel_intro_seen'
// 7 days cookie lifespan (in seconds)
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

/**
 * Checks if the user has already seen the intro clip.
 */
export function hasSeenIntro(): boolean {
  if (typeof document === 'undefined') return false

  // 1. Check cookies
  try {
    const cookies = document.cookie.split(';')
    for (const rawCookie of cookies) {
      const trimmed = rawCookie.trim()
      const [key, val] = trimmed.split('=')
      if (key === INTRO_COOKIE_KEY && val === 'true') {
        return true
      }
    }
  } catch {
    // Ignore cookie read error
  }

  // 2. Fallback check sessionStorage
  try {
    if (sessionStorage.getItem(INTRO_COOKIE_KEY) === 'true') {
      return true
    }
  } catch {
    // Ignore sessionStorage error
  }

  // 3. Fallback check localStorage
  try {
    if (localStorage.getItem(INTRO_COOKIE_KEY) === 'true') {
      return true
    }
  } catch {
    // Ignore localStorage error
  }

  return false
}

/**
 * Marks the intro clip as seen in cookies and session storage.
 */
export function markIntroAsSeen(): void {
  if (typeof document === 'undefined') return

  // 1. Store in document.cookie
  try {
    document.cookie = `${INTRO_COOKIE_KEY}=true; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
  } catch {
    // Ignore cookie write error
  }

  // 2. Store in sessionStorage
  try {
    sessionStorage.setItem(INTRO_COOKIE_KEY, 'true')
  } catch {
    // Ignore sessionStorage error
  }

  // 3. Store in localStorage
  try {
    localStorage.setItem(INTRO_COOKIE_KEY, 'true')
  } catch {
    // Ignore localStorage error
  }
}

/**
 * Resets the intro seen state so the user can replay the intro.
 */
export function resetIntroSeen(): void {
  if (typeof document === 'undefined') return

  // 1. Clear cookie
  try {
    document.cookie = `${INTRO_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`
  } catch {
    // Ignore
  }

  // 2. Clear sessionStorage
  try {
    sessionStorage.removeItem(INTRO_COOKIE_KEY)
  } catch {
    // Ignore
  }

  // 3. Clear localStorage
  try {
    localStorage.removeItem(INTRO_COOKIE_KEY)
  } catch {
    // Ignore
  }
}
