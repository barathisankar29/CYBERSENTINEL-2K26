import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Respects OS-level reduced-motion preference. All cinematic/scroll animation should check this. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
