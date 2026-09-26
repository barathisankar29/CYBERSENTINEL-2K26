/**
 * "Back to the city" navigation. Every page's back/exit control returns to
 * the navigation city (the six buildings), not the top of the parallax
 * hero — HomePage reads this and skips the intro + hero on arrival.
 *
 * Two signals:
 * - Router state `{ returnTo: 'city' }` on in-app back links (CITY_RETURN_STATE).
 * - A sessionStorage flag set whenever the home page is left, so the
 *   browser/phone Back button (a POP navigation, which carries no state
 *   from our links) lands on the buildings too. Per-tab, so a fresh tab
 *   still gets the full hero.
 */
const LEFT_HOME_KEY = 'cybersentinel_left_home'

export const CITY_RETURN_STATE = { returnTo: 'city' } as const

export function isCityReturnState(state: unknown): boolean {
  return typeof state === 'object' && state !== null && (state as { returnTo?: unknown }).returnTo === 'city'
}

export function markLeftHome(): void {
  try {
    sessionStorage.setItem(LEFT_HOME_KEY, '1')
  } catch {
    // Storage unavailable — Back simply lands on the hero.
  }
}

export function hasLeftHome(): boolean {
  try {
    return sessionStorage.getItem(LEFT_HOME_KEY) === '1'
  } catch {
    return false
  }
}

export function clearLeftHome(): void {
  try {
    sessionStorage.removeItem(LEFT_HOME_KEY)
  } catch {
    // Ignore
  }
}
