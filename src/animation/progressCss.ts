/**
 * Scroll-progress as CSS, not React state. A scroll-driven scene writes its
 * 0-1 progress ONCE per frame to the `--scene-progress` custom property on
 * its root element (see useScrollProgressVar in scrollController.ts); every
 * layer inside derives its own opacity/transform from that single value
 * through the calc()/clamp() expressions built here. The browser then only
 * recomputes styles — React never re-renders the scene while scrolling.
 *
 * These are exact CSS translations of the linear windows/lerps the configs
 * already describe (cityLayers.config.ts, identityReveal.config.ts), so the
 * motion is identical to the previous per-frame React computation.
 */
export const PROGRESS_VAR = '--scene-progress'

const P = `var(${PROGRESS_VAR}, 0)`

/** 0-1 fraction of the way through [start, end], clamped. */
export function windowT(start: number, end: number): string {
  const span = end - start
  // Degenerate window: a hard step at `end`.
  if (span <= 0) return `clamp(0, (${P} - ${end}) * 100000 + 1, 1)`
  return `clamp(0, (${P} - ${start}) / ${span}, 1)`
}

/** from -> to by `t` (a CSS number expression). */
export function lerpExpr(from: number, to: number, t: string): string {
  const delta = to - from
  if (delta === 0) return `${from}`
  return `(${from} + ${delta} * ${t})`
}

/** Fade in over [inStart, inEnd], hold, fade out over [outStart, outEnd]. */
export function stageT(inStart: number, inEnd: number, outStart: number, outEnd: number): string {
  return `min(clamp(0, (${P} - ${inStart}) / ${inEnd - inStart}, 1), clamp(0, (${outEnd} - ${P}) / ${outEnd - outStart}, 1))`
}

/** Linear drift of `perUnit` px across the full 0-1 progress range. */
export function driftPx(perUnit: number): string {
  return `calc(${P} * ${perUnit} * 1px)`
}
