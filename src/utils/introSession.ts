/**
 * Utility for managing intro video seen state across user sessions.
 * Stores state in cookies (with fallback to localStorage & sessionStorage)
 * so that new users see the cinematic intro clip once, while returning users
 * jump directly to the opening initializing transition.
 */

const INTRO_COOKIE_KEY = 'cybersentinel_intro_seen'
// 7 days cookie lifespan (in seconds)
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

/**
 * Checks if the user has already seen the intro clip.
 * Reads from document.cookie, with localStorage and sessionStorage fallbacks.
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

  // 2. Fallback check localStorage
  try {
    if (localStorage.getItem(INTRO_COOKIE_KEY) === 'true') {
      return true
    }
  } catch {
    // Ignore localStorage error
  }

  // 3. Fallback check sessionStorage
  try {
    if (sessionStorage.getItem(INTRO_COOKIE_KEY) === 'true') {
      return true
    }
  } catch {
    // Ignore sessionStorage error
  }

  return false
}

/**
 * Marks the intro clip as seen in cookies, localStorage, and sessionStorage.
 */
export function markIntroAsSeen(): void {
  if (typeof document === 'undefined') return

  // 1. Store in document.cookie
  try {
    document.cookie = `${INTRO_COOKIE_KEY}=true; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
  } catch {
    // Ignore cookie write error
  }

  // 2. Store in localStorage
  try {
    localStorage.setItem(INTRO_COOKIE_KEY, 'true')
  } catch {
    // Ignore localStorage error
  }

  // 3. Store in sessionStorage
  try {
    sessionStorage.setItem(INTRO_COOKIE_KEY, 'true')
  } catch {
    // Ignore sessionStorage error
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

  // 2. Clear localStorage
  try {
    localStorage.removeItem(INTRO_COOKIE_KEY)
  } catch {
    // Ignore
  }

  // 3. Clear sessionStorage
  try {
    sessionStorage.removeItem(INTRO_COOKIE_KEY)
  } catch {
    // Ignore sessionStorage error
  }
}
