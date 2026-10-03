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
/**
 * Viewport height for scroll-progress math that ignores the mobile browser
 * chrome. On phones the address bar collapses/expands mid-scroll, which
 * changes `innerHeight` (and fires `resize`) while the finger is still
 * moving; feeding that into the progress denominator makes every
 * scroll-driven scene jump a few pixels. The height is only re-read when
 * the WIDTH changes (rotation, real window resize), never for the
 * height-only resizes the address bar causes.
 */
function createStableViewport() {
  let width = window.innerWidth
  let height = window.innerHeight
  return {
    get height() {
      return height
    },
    /** Returns true when the change is a real resize worth re-measuring for. */
    update(): boolean {
      if (window.innerWidth === width) return false
      width = window.innerWidth
      height = window.innerHeight
      return true
    },
  }
}

/**
 * The tracked element's page position (document top + height), cached so a
 * scroll frame never has to call getBoundingClientRect(). That call, made
 * right after the previous frame wrote --scene-progress, forced a
 * synchronous style + layout recalculation on every scroll frame — the
 * single biggest source of scroll jank. The cache is refreshed only when
 * layout can actually have moved: the element or the page resizing
 * (images/fonts loading, intro removed, rotation).
 */
function createElementMetrics(element: HTMLElement, onChange: () => void) {
  let top = 0
  let height = 0
  const read = () => {
    const rect = element.getBoundingClientRect()
    top = rect.top + window.scrollY
    height = rect.height
  }
  read()
  const observer = new ResizeObserver(() => {
    read()
    onChange()
  })
  observer.observe(element)
  observer.observe(document.documentElement)
  return {
    /** Same value getBoundingClientRect().top would give, without layout. */
    get viewportTop() {
      return top - window.scrollY
    },
    get height() {
      return height
    },
    refresh: read,
    disconnect: () => observer.disconnect(),
  }
}

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

    const viewport = createStableViewport()
    const measure = () => {
      frameRef.current = null
      const scrollableDistance = Math.max(metrics.height - viewport.height, 1)
      const next = Math.min(Math.max(-metrics.viewportTop / scrollableDistance, 0), 1)
      setProgress(next)
    }

    const requestMeasure = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(measure)
      }
    }
    const metrics = createElementMetrics(element, requestMeasure)

    const handleResize = () => {
      if (viewport.update()) {
        metrics.refresh()
        requestMeasure()
      }
    }

    requestMeasure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      metrics.disconnect()
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', handleResize)
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
  /**
   * Fraction (0-1] of the element's scroll range by which progress reaches
   * 1. Anything below 1 leaves a "hold" at the end: the scene sits fully
   * complete for the remaining scroll before the element un-pins, so a
   * section visibly finishes before the next one arrives. Default 1 (no hold).
   */
  completeAt?: number
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
  { pinned = null, onProgress, completeAt = 1 }: ScrollProgressVarOptions = {},
): void {
  const onProgressRef = useRef(onProgress)
  useLayoutEffect(() => {
    onProgressRef.current = onProgress
  })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    // Only write when the value changes: a scene that is scrolled past (held
    // at 0 or 1) then causes no style invalidation at all.
    let last: number | null = null
    const apply = (value: number) => {
      const rounded = Math.round(value * 10000) / 10000
      if (rounded === last) return
      last = rounded
      element.style.setProperty(PROGRESS_VAR, String(rounded))
      onProgressRef.current?.(rounded)
    }

    if (pinned !== null) {
      apply(pinned)
      return
    }

    let frame: number | null = null
    const viewport = createStableViewport()
    const measure = () => {
      frame = null
      const scrollableDistance = Math.max(metrics.height - viewport.height, 1)
      apply(Math.min(Math.max(-metrics.viewportTop / (scrollableDistance * completeAt), 0), 1))
    }
    const requestMeasure = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }
    const metrics = createElementMetrics(element, requestMeasure)

    const handleResize = () => {
      if (viewport.update()) {
        metrics.refresh()
        requestMeasure()
      }
    }

    measure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      metrics.disconnect()
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', handleResize)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [ref, pinned, completeAt])
}
