import { useMediaQuery } from '@/hooks/useMediaQuery'
import { BREAKPOINTS } from '@/styles/breakpoints'

/**
 * Drives the responsive CAMERA/COMPOSITION split described in the brief:
 * mobile is not a scaled-down desktop city, it's a different camera angle
 * over the same world. Components should branch on this (or read
 * position.mobile vs position.desktop from nav config) rather than relying
 * on CSS scaling alone.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.mobileMax}px)`)
}
