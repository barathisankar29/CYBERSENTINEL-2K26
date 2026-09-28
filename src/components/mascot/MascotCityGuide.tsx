import { useEffect, useRef } from 'react'
import { navigationBuildings } from '@/data/navigation'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { MascotBubblePlacement } from '@/types/mascot'
import { useMascot } from './MascotContext'
import { getMascotDimensions, getSafeScreenBounds } from './MascotPhysics'
import { getProtectedElementRects, type DOMRectLike } from './MascotObstruction'

const STEP_MS = 4200
/** Phones point without a bubble (no room for one beside the packed buildings), so steps are shorter. */
const MOBILE_STEP_MS = 2600
/** Long enough for the page-load welcome line to show before the tour takes over. */
const START_DELAY_MS = 1800
const GAP = 8
// Coarse on purpose: a spot search is a few hundred checks, not thousands.
const GRID_STEP = 32
/** Half-width of a mobile building's painted tower around its glow point. */
const MOBILE_BUILDING_HALF_W = 45
/** How far a mobile building's painted base reaches below its glow point. */
const MOBILE_BUILDING_BASE = 80
/** How far from a building the mascot may sit and still count as pointing at it. */
const NEAR_RADIUS = { desktop: 230, mobile: 150 }
/** A bubble briefly over painted art matters less than over a card or control. */
const SOFT_WEIGHT = 0.25

type Rect = DOMRectLike
type Facing = 'left' | 'right'

interface Target {
  id: string
  label: string
  description?: string
  card: Rect
}

interface Spot {
  x: number
  y: number
  facing: Facing
  bubble: MascotBubblePlacement
  /** How much of the keep-clear area the bubble would cover here (0 = none). */
  bubbleOverlap: number
}

const toRect = (el: Element): Rect => {
  const b = el.getBoundingClientRect()
  return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height }
}

const box = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
  width,
  height,
})

const overlapArea = (a: Rect, rects: Rect[]) =>
  rects.reduce((sum, r) => {
    const x = Math.min(a.right, r.right) - Math.max(a.left, r.left)
    const y = Math.min(a.bottom, r.bottom) - Math.max(a.top, r.top)
    return x > 0 && y > 0 ? sum + x * y : sum
  }, 0)

const fullyVisible = (r: Rect) =>
  r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight && r.right <= window.innerWidth

/** Lexicographic compare: first differing entry decides. */
const lessThan = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i]
  }
  return false
}

/** The building cards currently on the page, in the navigation data's order. */
function readTargets(): Target[] {
  return navigationBuildings.flatMap((b) => {
    const el = document.querySelector(`[data-building-id="${b.id}"]`)
    if (!el) return []
    // Desktop: the button wraps the card + building image; mobile: the button is the card.
    const cardEl = el.querySelector('.nav-building__card') ?? el
    return [{ id: b.id, label: b.label, description: b.description, card: toRect(cardEl) }]
  })
}

/**
 * What the mascot must not cover. `hard`: every building card, desktop
 * building, and the page's own controls. `soft`: the phone layout's
 * buildings, which are painted into the background — the mascot never sits
 * on them either, but its bubble may briefly overlap them.
 */
function readKeepClear(): { hard: Rect[]; soft: Rect[] } {
  const hard = getProtectedElementRects()
  const soft: Rect[] = []
  document.querySelectorAll('[data-building-id]').forEach((el) => {
    hard.push(toRect(el))
    const card = el.querySelector('.nav-building__card')
    if (card) hard.push(toRect(card))
  })
  // Keep clear the painted tower between each card and its glow point
  // (where the connector line runs).
  document.querySelectorAll('[data-building-glow]').forEach((el) => {
    const id = el.getAttribute('data-building-glow')
    const card = id ? document.querySelector(`[data-building-id="${id}"]`) : null
    const g = toRect(el)
    const cx = (g.left + g.right) / 2
    const cy = (g.top + g.bottom) / 2
    const top = card ? Math.min(toRect(card).bottom, cy) : cy - MOBILE_BUILDING_HALF_W
    soft.push(box(cx - MOBILE_BUILDING_HALF_W, top, MOBILE_BUILDING_HALF_W * 2, cy + MOBILE_BUILDING_BASE - top))
  })
  return { hard, soft }
}

const BUBBLE_PLACEMENTS: MascotBubblePlacement[] = [
  { side: 'right', vertical: 'above' },
  { side: 'left', vertical: 'above' },
  { side: 'right', vertical: 'below' },
  { side: 'left', vertical: 'below' },
]

/** Where MascotSpeechBubble draws for a mascot at (x, y) with the given placement (mirrors its CSS offsets). */
function bubbleRect(x: number, y: number, placement: MascotBubblePlacement, isMobile: boolean): Rect {
  const { width: w, height: h } = getMascotDimensions(isMobile)
  // Phones get one-line guide text, so the bubble there is its compact size.
  const bw = isMobile ? 200 : 290
  const bh = isMobile ? 80 : 104
  const left = placement.side === 'left' ? x - 12 - bw : x + w + 12
  const top = placement.vertical === 'below' ? y + w * 0.5 : y + h - w * 0.4 - bh
  return box(left, top, bw, bh)
}

/** Best bubble side for a mascot at (x, y): fully on screen and covering as little as possible. */
function bestBubble(x: number, y: number, keepClear: { hard: Rect[]; soft: Rect[] }, isMobile: boolean) {
  let best = { placement: BUBBLE_PLACEMENTS[0], overlap: Infinity }
  for (const placement of BUBBLE_PLACEMENTS) {
    const r = bubbleRect(x, y, placement, isMobile)
    if (r.left < 4 || r.top < 4 || r.right > window.innerWidth - 4 || r.bottom > window.innerHeight - 4) continue
    const overlap = overlapArea(r, keepClear.hard) + SOFT_WEIGHT * overlapArea(r, keepClear.soft)
    if (overlap < best.overlap) best = { placement, overlap }
  }
  return best
}

/**
 * Picks a spot for pointing at `card`. First choice is on top of the
 * building (just above its card, beside the centre so the pose points at
 * it); if that would cover any building, from its left or right side; and
 * if the buildings are packed too tightly for either (phones), the nearest
 * clear spot around it. The bubble side is chosen to stay off buildings too.
 */
function chooseSpot(
  card: Rect,
  isMobile: boolean,
  { withBubble = true, bubbleFirst = false }: { withBubble?: boolean; bubbleFirst?: boolean } = {}
): Spot | null {
  const { width: w, height: h } = getMascotDimensions(isMobile)
  const keepClear = readKeepClear()
  const blockers = [...keepClear.hard, ...keepClear.soft]
  const radius = isMobile ? NEAR_RADIUS.mobile : NEAR_RADIUS.desktop
  // Stay over the city itself (never over the page content below it).
  const screen = getSafeScreenBounds(isMobile)
  const section = document.getElementById('buildings')?.getBoundingClientRect()
  const bounds = section
    ? {
        minX: screen.minX,
        maxX: screen.maxX,
        // The city has no fixed header, so the guide may use the top edge
        // (page controls up there are kept clear via the protected rects).
        minY: Math.max(8, section.top),
        maxY: Math.min(screen.maxY, section.bottom - h),
      }
    : screen
  const cx = (card.left + card.right) / 2
  const cy = (card.top + card.bottom) / 2
  const above = card.top - h - GAP

  const preferred = [
    { x: cx - w - 4, y: above }, // on top, left of centre
    { x: cx + 4, y: above }, // on top, right of centre
    { x: cx - w / 2, y: above }, // on top, centred
    { x: card.left - w - GAP, y: cy - h / 2 }, // left side
    { x: card.right + GAP, y: cy - h / 2 }, // right side
  ]
  const grid: { x: number; y: number }[] = []
  for (let y = bounds.minY; y <= bounds.maxY; y += GRID_STEP) {
    for (let x = bounds.minX; x <= bounds.maxX; x += GRID_STEP) grid.push({ x, y })
  }

  let best: Spot | null = null
  let bestScore: number[] = []
  const consider = (c: { x: number; y: number }, rank: number) => {
    if (c.x < bounds.minX || c.x > bounds.maxX || c.y < bounds.minY || c.y > bounds.maxY) return
    const body = overlapArea(box(c.x, c.y, w, h), blockers)
    const bubble = withBubble
      ? bestBubble(c.x, c.y, keepClear, isMobile)
      : { placement: BUBBLE_PLACEMENTS[0], overlap: 0 }
    // Nearer is better; being below the card counts double (on top or the sides first).
    const dx = c.x + w / 2 - cx
    const dy = c.y + h / 2 - cy
    const distance = Math.hypot(dx, dy > 0 ? dy * 2 : dy)
    const near = distance <= radius ? 0 : distance <= radius * 2 ? 1 : 2
    // Never on a building > close to it > bubble clear > preferred spots in order > nearest
    // (for a free-standing line: bubble clear before closeness).
    const score = bubbleFirst
      ? [body, bubble.overlap, near, rank, distance]
      : [body, near, bubble.overlap, rank, distance]
    if (!best || lessThan(score, bestScore)) {
      best = {
        x: c.x,
        y: c.y,
        facing: cx < c.x + w / 2 ? 'left' : 'right',
        bubble: bubble.placement,
        bubbleOverlap: bubble.overlap,
      }
      bestScore = score
    }
  }
  preferred.forEach((c, i) => consider(c, i))
  grid.forEach((c) => consider(c, preferred.length))
  return best
}

/**
 * City tour for the site mascot (Jeevadharani's companion), which appears
 * only on the buildings section: it shows while the buildings are on screen
 * (and hides when they leave), flies from building to building pointing at
 * each one, and stops touring for good the moment the visitor drags it.
 */
export function MascotCityGuide() {
  const mascot = useMascot()
  const isMobile = useIsMobile()
  const mascotRef = useRef(mascot)
  mascotRef.current = mascot
  const isMobileRef = useRef(isMobile)
  isMobileRef.current = isMobile
  const userTookOverRef = useRef(false)

  // Dragging the mascot means the visitor wants it somewhere else — respect that.
  useEffect(() => {
    if (mascot.isDragging) {
      userTookOverRef.current = true
      mascot.setGuideActive(false)
    }
  }, [mascot.isDragging, mascot])

  useEffect(() => {
    let touring = false
    let order: string[] = []
    let step = 0
    let active = false
    let stepTimer: number | null = null
    let settleTimer: number | null = null
    let hovering = false
    let introDone = false

    const clearTimers = () => {
      if (stepTimer !== null) window.clearTimeout(stepTimer)
      if (settleTimer !== null) window.clearTimeout(settleTimer)
      stepTimer = settleTimer = null
    }

    const inView = () => {
      const targets = readTargets()
      const visible = targets.filter((t) => fullyVisible(t.card)).length
      return targets.length > 0 && visible >= Math.min(3, targets.length)
    }

    const stepMs = () => (isMobileRef.current ? MOBILE_STEP_MS : STEP_MS)
    let introSpoken = false

    // Light up the building being pointed at, like a hovered one.
    let highlighted: Element | null = null
    const highlight = (id: string | null) => {
      highlighted?.removeAttribute('data-mascot-pointing')
      highlighted = id ? document.querySelector(`[data-building-id="${id}"]`) : null
      highlighted?.setAttribute('data-mascot-pointing', '')
    }

    const moveTo = (spot: Spot | null) => {
      if (!spot) return false
      const m = mascotRef.current
      m.setFacing(spot.facing)
      m.setBubblePlacement(spot.bubble)
      m.guideTo({ x: spot.x, y: spot.y })
      return true
    }

    /** Where to point at `target` from while speaking — only if the bubble fits clear of every building (never on phones). */
    const speakingSpot = (target: Target) => {
      if (isMobileRef.current) return null
      const spot = chooseSpot(target.card, false)
      return spot && spot.bubbleOverlap === 0 ? spot : null
    }

    /** Pointing spot without a bubble (the lit-up card says what the building is). */
    const silentSpot = (target: Target) => chooseSpot(target.card, isMobileRef.current, { withBubble: false })

    const aim = (target: Target) => moveTo(speakingSpot(target) ?? silentSpot(target))

    /** A free-standing line (intro/outro) from an open spot over the city, bubble kept clear. */
    const speakFromOpenSpot = (text: string, state: 'wave' | 'happy', ms: number) => {
      const section = document.getElementById('buildings')
      if (!section) return
      const r = section.getBoundingClientRect()
      const cy = (Math.max(r.top, 0) + Math.min(r.bottom, window.innerHeight)) / 2
      const centre = box(r.left + r.width / 2 - 1, cy - 1, 2, 2)
      moveTo(chooseSpot(centre, isMobileRef.current, { bubbleFirst: true }))
      const m = mascotRef.current
      m.setMascotState(state, ms, undefined, 'idle', true, 'high')
      m.say(text, ms, undefined, 'high')
    }

    const point = (target: Target, first: boolean) => {
      const spoken = speakingSpot(target)
      if (!moveTo(spoken ?? silentSpot(target))) return false
      highlight(target.id)
      const m = mascotRef.current
      m.setMascotState('guide', stepMs() - 300, undefined, 'idle', true, 'high')
      if (!spoken) {
        m.dismissSpeech()
        return true
      }
      const name = target.label.toUpperCase()
      const what = target.description ? ` — ${target.description}` : ''
      const text = first
        ? `Explore the buildings! This is ${name}${what}. Tap it to enter.`
        : `This is ${name}${what}. Tap it to explore.`
      m.say(text, STEP_MS - 200, undefined, 'high')
      return true
    }

    const finish = () => {
      touring = false
      highlight(null)
      speakFromOpenSpot('Tap any building to explore it!', 'happy', 3200)
      // Hand control back once the last line has been read.
      stepTimer = window.setTimeout(() => {
        stepTimer = null
        mascotRef.current.setGuideActive(false)
      }, 3800)
    }

    const runStep = () => {
      stepTimer = null
      if (!touring || userTookOverRef.current) return
      // Let the visitor read a building's own hover message before moving on.
      if (hovering) {
        stepTimer = window.setTimeout(runStep, stepMs())
        return
      }
      const targets = readTargets()
      // Open with "explore the buildings" from an open spot when the first
      // building has no room for a bubble beside it (always on phones).
      if (step === 0 && !introDone) {
        introDone = true
        const firstTarget = targets.find((t) => t.id === order[0])
        if (!firstTarget || !speakingSpot(firstTarget)) {
          introSpoken = true
          speakFromOpenSpot("Explore the buildings! I'll show you each one.", 'wave', 3000)
          stepTimer = window.setTimeout(runStep, 3200)
          return
        }
      }
      while (step < order.length) {
        const target = targets.find((t) => t.id === order[step])
        const first = step === 0 && !introSpoken
        step += 1
        if (target && fullyVisible(target.card) && point(target, first)) {
          stepTimer = window.setTimeout(runStep, stepMs())
          return
        }
      }
      finish()
    }

    const start = () => {
      active = true
      mascotRef.current.setCityVisible(true)
      if (userTookOverRef.current) return
      const targets = readTargets().filter((t) => fullyVisible(t.card))
      if (targets.length === 0) return
      // Visit in reading order: left to right on desktop, top to bottom on the phone's stacked layout.
      targets.sort((a, b) => (isMobileRef.current ? a.card.top - b.card.top : a.card.left - b.card.left))
      order = targets.map((t) => t.id)
      step = 0
      introDone = false
      introSpoken = false
      touring = true
      mascotRef.current.setGuideActive(true)
      stepTimer = window.setTimeout(runStep, START_DELAY_MS)
    }

    const stop = () => {
      touring = false
      clearTimers()
      highlight(null)
      if (!active) return
      active = false
      const m = mascotRef.current
      m.setGuideActive(false)
      m.dismissSpeech()
      m.setCityVisible(false)
    }

    // Re-check after scrolling settles: show + start when the buildings are on
    // screen, hide when they leave, and re-aim if the page moved under it.
    const onScroll = () => {
      if (settleTimer !== null) window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        settleTimer = null
        if (!inView()) {
          stop()
        } else if (!active) {
          start()
        } else if (touring && step > 0) {
          const target = readTargets().find((t) => t.id === order[step - 1])
          if (target && fullyVisible(target.card)) aim(target)
        }
      }, 250)
    }

    const onPointerOver = (e: PointerEvent) => {
      hovering = !!(e.target as Element | null)?.closest?.('[data-building-id]')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('pointerover', onPointerOver)
      stop()
    }
  }, [])

  return null
}
