/**
 * "Back to the city" navigation. Every page's back/exit control returns to
 * the navigation city (the six buildings), not the top of the parallax
 * hero — HomePage reads this and skips the intro + hero on arrival.
 *
 * Two signals:
 * - Router state `{ returnTo: 'city' }` on in-app back links (CITY_RETURN_STATE).
 * - An in-memory flag set whenever the home page is left, so the
 *   browser/phone Back button (a POP navigation, which carries no state
 *   from our links) lands on the buildings too. In memory (not storage) so
 *   a fresh visit or reload always starts from the intro and hero.
 */
let leftHomeThisLoad = false

export const CITY_RETURN_STATE = { returnTo: 'city' } as const

export function isCityReturnState(state: unknown): boolean {
  return typeof state === 'object' && state !== null && (state as { returnTo?: unknown }).returnTo === 'city'
}

export function markLeftHome(): void {
  leftHomeThisLoad = true
}

export function hasLeftHome(): boolean {
  return leftHomeThisLoad
}

export function clearLeftHome(): void {
  leftHomeThisLoad = false
}
