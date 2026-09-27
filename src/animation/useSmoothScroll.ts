import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useReducedMotion } from './useReducedMotion'

/**
 * Inertial smooth scrolling (Lenis) for the long scroll-driven pages. Wheel
 * and trackpad input is interpolated toward its target and eases out when
 * the user stops, instead of stepping in hard notches — so pinned/scrubbed
 * scenes (the hero reveal) glide to a stop rather than halting abruptly.
 *
 * - Touch keeps the platform's own momentum scrolling (syncTouch: false):
 *   it is already smooth on phones, and emulating it costs frames.
 * - Disabled entirely for reduced-motion users.
 * - Scrollable overlays opt out with `data-lenis-prevent`.
 *
 * Lenis drives the real window scroll position, so every existing
 * `getBoundingClientRect`/scroll-event based scene keeps working unchanged.
 */
export function useSmoothScroll(enabled = true): void {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!enabled || reducedMotion) return
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.085,
      wheelMultiplier: 0.9,
    })
    return () => lenis.destroy()
  }, [enabled, reducedMotion])
}
