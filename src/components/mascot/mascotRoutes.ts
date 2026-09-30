/**
 * The site mascot appears only on the home page's buildings section (the
 * city guide shows/hides it as that section enters/leaves the screen). On
 * every other page it renders nothing and runs none of its background work
 * (sprite preloads, scroll and idle listeners).
 */
export function isMascotRoute(pathname: string): boolean {
  return pathname === '/' || pathname === ''
}
