import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

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
 */
export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>): ScrollProgress {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
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
  }, [ref])

  return { progress }
}
