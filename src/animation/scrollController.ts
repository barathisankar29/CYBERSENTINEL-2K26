import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { PROGRESS_VAR } from './progressCss'

/**
 * Scroll-progress abstraction described in ARCHITECTURE.md §6. Tracks how
 * far the viewport has scrolled through a "tall" element (typically a
 * sticky-scroll section that is several viewport-heights tall) and reports
 * it as a 0-1 value. Consumers should depend on this hook, not on scroll
 * math of their own, so the backing implementation can change later
 * (e.g. swapped for a GSAP ScrollTrigger-driven value) without touching
 * component code.
 */
export interface ScrollProgress {
  /** 0-1 progress through the tracked element's scrollable range. */
  progress: number
}

/**
 * @param ref Element whose height beyond one viewport defines the
 * scrollable range. Progress is 0 while its top edge is at/below the
 * viewport top, and 1 once its bottom edge reaches the viewport bottom.
 * @param enabled When false, no listener is attached and no measuring
 * happens at all — for a consumer that only cares about scroll during part
 * of its lifecycle (e.g. Timeline's automatic journey, which drives
 * progress itself and would otherwise pay for a redundant rAF-scheduled
 * `getBoundingClientRect` read — a forced synchronous layout — on every
 * `scroll` event its OWN `window.scrollTo` calls generate, fighting the
 * animation for the same frame budget). Defaults to true so existing
 * callers are unaffected.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true,
): ScrollProgress {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return
    const element = ref.current
    if (!element) return

    const measure = () => {
      frameRef.current = null
      const rect = element.getBoundingClientRect()
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
      const next = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
      setProgress(next)
    }

    const requestMeasure = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(measure)
      }
    }

    requestMeasure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)

    return () => {
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [ref, enabled])

  return { progress }
}

interface ScrollProgressVarOptions {
  /** Fixed progress to hold instead of tracking scroll (reduced motion). */
  pinned?: number | null
  /** Called with every new progress value — for the few consumers that
   * need a coarse JS-side flag. Keep it to setState on booleans, so React
   * bails out on unchanged values instead of re-rendering every frame. */
  onProgress?: (progress: number) => void
}

/**
 * Same measurement as useScrollProgress, but instead of React state it
 * writes the value to `--scene-progress` on `ref`'s element once per
 * frame, so a scroll-driven scene updates through CSS alone (see
 * progressCss.ts) and React does not re-render it on every scroll tick.
 * Layout effect: the initial value lands before first paint, so there is
 * no single-frame flash at the wrong progress.
 */
export function useScrollProgressVar<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { pinned = null, onProgress }: ScrollProgressVarOptions = {},
): void {
  const onProgressRef = useRef(onProgress)
  useLayoutEffect(() => {
    onProgressRef.current = onProgress
  })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const apply = (value: number) => {
      element.style.setProperty(PROGRESS_VAR, String(value))
      onProgressRef.current?.(value)
    }

    if (pinned !== null) {
      apply(pinned)
      return
    }

    let frame: number | null = null
    const measure = () => {
      frame = null
      const rect = element.getBoundingClientRect()
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
      apply(Math.min(Math.max(-rect.top / scrollableDistance, 0), 1))
    }
    const requestMeasure = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)
    return () => {
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [ref, pinned])
}
