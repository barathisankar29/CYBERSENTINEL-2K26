/**
 * CYBERSENTINEL 2K26 - SMART MASCOT OBSTRUCTION DETECTION & SAFE POSITIONING
 * 
 * Inspects DOM geometry dynamically using getBoundingClientRect() to guarantee
 * that the mascot companion never permanently obstructs important interactive
 * or informational content (buttons, forms, cards, headings, buildings, navigation).
 */

import type { MascotPosition } from '@/types/mascot'
import { getMascotDimensions, getSafeScreenBounds } from './MascotPhysics'

export interface DOMRectLike {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

const PROTECTED_SELECTORS = [
  // Navigation buildings & cards
  '.nav-building',
  '.nav-building__card',
  '.mobile-nav-card',
  '.mobile-nav-item',
  '.profile-access-badge',
  '.register-now-button',

  // Site navigation
  'nav',
  '.retro-nav',
  'header',

  // Event terminal components & cards
  '.cft-event-card',
  '.pixel-window-frame',
  '[data-purpose="main-screen-container"]',
  '.firmware-container',
  '.compete-grid',

  // Form controls & inputs
  'form',
  'input',
  'textarea',
  'select',
  '.reg-form',

  // Action buttons & CTAs
  'button:not(.mascot-pet__badge):not(.mascot-quick-menu__btn)',
  'a.btn',
  'a[role="button"]',
  '.btn',

  // Dialogs & Modals
  'dialog',
  '[role="dialog"]',
  '.modal',
  '.cft-modal',

  // Important headings & hero markers
  'h1',
  'h2',
]

/**
 * Gathers bounding rectangles for all currently visible protected elements on screen.
 */
export function getProtectedElementRects(): DOMRectLike[] {
  if (typeof window === 'undefined' || typeof document === 'undefined') return []

  const rects: DOMRectLike[] = []
  const selector = PROTECTED_SELECTORS.join(',')
  const elements = document.querySelectorAll(selector)
  const vw = window.innerWidth
  const vh = window.innerHeight

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i] as HTMLElement
    // Ignore mascot's own DOM nodes
    if (el.closest('.mascot-system-layer') || el.closest('.mascot-pet')) {
      continue
    }

    const rect = el.getBoundingClientRect()

    // Element must have non-zero dimensions and be within current viewport
    if (
      rect.width <= 0 ||
      rect.height <= 0 ||
      rect.bottom <= 0 ||
      rect.top >= vh ||
      rect.right <= 0 ||
      rect.left >= vw
    ) {
      continue
    }

    // Ignore visually hidden or completely transparent elements
    const style = window.getComputedStyle(el)
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      parseFloat(style.opacity || '1') < 0.1
    ) {
      continue
    }

    rects.push({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    })
  }

  return rects
}

/**
 * Checks if a given mascot position overlaps with any protected element.
 */
export function isPositionObstructing(
  pos: MascotPosition,
  isMobile: boolean,
  protectedRects?: DOMRectLike[]
): boolean {
  const { width, height } = getMascotDimensions(isMobile)
  const mascotRect: DOMRectLike = {
    left: pos.x,
    top: pos.y,
    right: pos.x + width,
    bottom: pos.y + height,
    width,
    height,
  }

  const rects = protectedRects ?? getProtectedElementRects()
  const padding = 8 // Small buffer threshold to ignore minimal edge touches

  for (const rect of rects) {
    const hasOverlap = !(
      mascotRect.right <= rect.left + padding ||
      mascotRect.left >= rect.right - padding ||
      mascotRect.bottom <= rect.top + padding ||
      mascotRect.top >= rect.bottom - padding
    )

    if (hasOverlap) {
      return true
    }
  }

  return false
}

/**
 * Calculates the total overlap area between a mascot box and protected rectangles.
 */
function calculateOverlapArea(
  pos: MascotPosition,
  isMobile: boolean,
  protectedRects: DOMRectLike[]
): number {
  const { width, height } = getMascotDimensions(isMobile)
  const mLeft = pos.x
  const mTop = pos.y
  const mRight = pos.x + width
  const mBottom = pos.y + height

  let totalArea = 0

  for (const r of protectedRects) {
    const xOverlap = Math.max(0, Math.min(mRight, r.right) - Math.max(mLeft, r.left))
    const yOverlap = Math.max(0, Math.min(mBottom, r.bottom) - Math.max(mTop, r.top))
    totalArea += xOverlap * yOverlap
  }

  return totalArea
}

export interface CandidateLocation {
  id: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left-middle' | 'right-middle'
  x: number
  y: number
  distance: number
  overlapArea: number
}

/**
 * Finds the nearest safe candidate position that does not overlap any protected elements.
 * Returns null if the current position is already completely safe.
 */
export function findSafeMascotPosition(
  currentPos: MascotPosition,
  isMobile: boolean
): MascotPosition | null {
  const protectedRects = getProtectedElementRects()

  // If current position is not obstructing anything, keep it
  if (!isPositionObstructing(currentPos, isMobile, protectedRects)) {
    return null
  }

  const bounds = getSafeScreenBounds(isMobile)
  const middleY = Math.round((bounds.minY + bounds.maxY) / 2)

  // Candidate anchor points in order of typical ergonomic preference
  const rawCandidates: Array<{ id: CandidateLocation['id']; x: number; y: number }> = [
    { id: 'bottom-left', x: bounds.minX, y: bounds.maxY },
    { id: 'bottom-right', x: bounds.maxX, y: bounds.maxY },
    { id: 'left-middle', x: bounds.minX, y: middleY },
    { id: 'right-middle', x: bounds.maxX, y: middleY },
    { id: 'top-left', x: bounds.minX, y: bounds.minY },
    { id: 'top-right', x: bounds.maxX, y: bounds.minY },
  ]

  const scoredCandidates: CandidateLocation[] = rawCandidates.map((c) => {
    const distance = Math.hypot(c.x - currentPos.x, c.y - currentPos.y)
    const overlapArea = calculateOverlapArea(c, isMobile, protectedRects)
    return {
      ...c,
      distance,
      overlapArea,
    }
  })

  // 1. Pick among candidates with ZERO obstruction (strictly safe)
  const zeroOverlap = scoredCandidates.filter((c) => c.overlapArea === 0)
  if (zeroOverlap.length > 0) {
    // Select the candidate closest to current mascot position
    zeroOverlap.sort((a, b) => a.distance - b.distance)
    return { x: zeroOverlap[0].x, y: zeroOverlap[0].y }
  }

  // 2. If no candidate has 0 overlap, choose the candidate with minimal overlap area
  scoredCandidates.sort((a, b) => {
    if (a.overlapArea !== b.overlapArea) return a.overlapArea - b.overlapArea
    return a.distance - b.distance
  })

  const best = scoredCandidates[0]
  // Only relocate if the best candidate is significantly better than current
  const currentArea = calculateOverlapArea(currentPos, isMobile, protectedRects)
  if (best.overlapArea < currentArea * 0.5) {
    return { x: best.x, y: best.y }
  }

  return null
}
