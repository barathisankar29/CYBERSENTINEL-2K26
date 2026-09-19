import type { CSSProperties } from 'react'
import type { NavigationBuilding } from '@/types/navigation'
import './Building.css'

/**
 * Desktop sizes buildings by HEIGHT (vh) — the sticky viewport's vertical
 * space is the binding constraint there. Mobile sizes by WIDTH (vw)
 * instead — on a narrow viewport, horizontal room across 6 buildings is
 * the binding constraint, and height-driven sizing let a square/wide
 * asset (e.g. credentials) end up wider than a wide narrow tower at the
 * same height, overflowing the row. Both are `position.scale === 1` at
 * the primary anchor (`events`)'s authored size.
 */
const BASE_HEIGHT_VH_DESKTOP = 66
const BASE_WIDTH_VW_MOBILE = 19

/**
 * Safety caps for the OTHER axis, expressed in the other unit — vh is
 * relative to viewport height only, so a height-driven desktop size can
 * still overflow horizontally on a narrower-but-still-"desktop" width
 * (e.g. 768px); a width-driven mobile size could in principle overflow
 * vertically on a short viewport. `min()` picks whichever is smaller,
 * with the aspect ratio applied so the image never distorts. Buildings are
 * meant to be the dominant visual element, so these are generous — they
 * exist to stop true overflow, not to keep buildings small.
 */
const MAX_WIDTH_VW_DESKTOP = 42
const MAX_HEIGHT_VH_MOBILE = 34

/** How far a building rises (vh) and grows from as it emerges, at reveal progress 0. */
const RISE_FROM_VH = 6
const EMERGE_SCALE_FROM = 0.86

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

function localProgress(progress: number, start: number, end: number): number {
  const span = end - start
  if (span <= 0) return progress >= end ? 1 : 0
  return Math.min(Math.max((progress - start) / span, 0), 1)
}

interface BuildingProps {
  building: NavigationBuilding
  /** Master progress (0-1) of the navigation-city transition this building belongs to. */
  progress: number
  isMobile: boolean
}

/**
 * A single navigation building within NavigationCityScene. Purely a
 * function of the transition's scroll progress — no timers, no CSS
 * transitions. Ground placement (x/y/z/scale) is static per
 * NavigationBuilding.position; only opacity and the emerge transform
 * (translateY + scale) change per frame, both GPU-friendly and computed
 * from `progress` alone so nothing recalculates layout on scroll.
 *
 * Render order (top to bottom, per the brief: a compact card ABOVE the
 * building, never a label row along the bottom): the info card, a tiny
 * connector tick, then the building image — flex-column stacks them in
 * that visual order while the wrapper's own `bottom: y%` anchor still
 * lands on the image's base (the card/tick are the ones pushed upward
 * above it, not the other way around).
 *
 * All six buildings sit at the same foreground level now (no back/front
 * depth bands, no per-building atmospheric dimming) — `z` only breaks
 * ties in paint order for buildings whose footprints happen to overlap,
 * it no longer implies distance.
 *
 * The card's own reveal is a SEPARATE, later window than the building's
 * (see `cardT` below) — the brief wants cards to "appear only after the
 * buildings have mostly reached their final positions", not rise in
 * lockstep with them.
 *
 * No per-building platform/pad/oval here (explicitly not wanted) — the
 * environmental grounding comes primarily from the shared
 * navigation-city-environment.png layer in navigationCityEnvironment
 * .config.ts. `nav-building__contact-glow` is NOT a platform: it's a
 * single soft, heavily-blurred, borderless smear of light at the
 * building's base (no edge, no discernible shape) — just enough to keep
 * the base from reading as a hard-edged cutout against the background,
 * not a drawn floor.
 */
export function Building({ building, progress, isMobile }: BuildingProps) {
  const position = isMobile ? building.position.mobile : building.position.desktop
  const scale = position.scale ?? 1
  const aspectRatio = building.assetWidth / building.assetHeight

  const { start, end } = building.revealWindow
  const t = localProgress(progress, start, end)
  const riseVh = lerp(RISE_FROM_VH, 0, t)
  const emergeScale = lerp(EMERGE_SCALE_FROM, 1, t)

  // Cards start appearing once the building is ~65% risen, finishing a
  // little after the building's own window ends — "after buildings have
  // mostly settled", not simultaneously with their rise.
  const cardT = localProgress(progress, lerp(start, end, 0.65), Math.min(end + 0.12, 1))

  // Static per-building placement (left/bottom/centering) never changes with
  // `progress` — only the image's own opacity/transform below do, so scroll
  // never triggers layout recalculation, just cheap GPU compositing.
  const wrapperStyle: CSSProperties = {
    left: `${position.x}%`,
    bottom: `${position.y}%`,
    zIndex: position.z ?? building.order ?? 0,
  }

  const imageStyle: CSSProperties = {
    ...(isMobile
      ? { width: `min(${BASE_WIDTH_VW_MOBILE * scale}vw, calc(${MAX_HEIGHT_VH_MOBILE * scale}vh * ${aspectRatio}))`, height: 'auto' }
      : { height: `min(${BASE_HEIGHT_VH_DESKTOP * scale}vh, calc(${MAX_WIDTH_VW_DESKTOP * scale}vw / ${aspectRatio}))`, width: 'auto' }),
    opacity: t,
    transform: `translateY(${riseVh}vh) scale(${emergeScale})`,
    ...(building.accentColor ? ({ '--building-accent': building.accentColor } as CSSProperties) : {}),
  }

  return (
    <button type="button" className="nav-building" style={wrapperStyle} aria-label={building.label}>
      <div className="nav-building__card" style={{ opacity: cardT }}>
        <span className="nav-building__card-title">{building.label}</span>
        {building.description && <span className="nav-building__card-desc">{building.description}</span>}
      </div>
      <span className="nav-building__marker" style={{ opacity: cardT }} aria-hidden="true" />
      <span className="nav-building__contact-glow" style={{ opacity: t }} aria-hidden="true" />
      <img
        src={building.assetPath}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="nav-building__image"
        style={imageStyle}
      />
    </button>
  )
}
