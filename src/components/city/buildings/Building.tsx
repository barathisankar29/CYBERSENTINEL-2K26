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

/** How far a building sits before its pop-in (vh) and how small it starts, pre-reveal. */
const RISE_FROM_VH = 2.5
const EMERGE_SCALE_FROM = 0.92

interface BuildingProps {
  building: NavigationBuilding
  /**
   * Whether the navigation section's single shared reveal threshold has
   * been crossed — see NavigationCityScene.tsx. Every building receives
   * the exact same boolean at the exact same time, so all six pop
   * together; there is no per-building timing anywhere in this
   * component.
   */
  revealed: boolean
  isMobile: boolean
}

/**
 * A single navigation building within NavigationCityScene. Ground
 * placement (x/y/z/scale) is static per NavigationBuilding.position — the
 * ONLY thing that changes is a single boolean (`revealed`), and a real
 * CSS transition (~380ms ease-out, see Building.css) animates opacity and
 * the small emerge transform (translateY + scale) in response, the same
 * way for every building at once. This is deliberately NOT scroll-scrubbed
 * per-frame math anymore — the brief wants one fast, snappy, simultaneous
 * pop-in triggered by crossing a single scroll threshold, not a
 * continuous per-building animation tied to scroll distance.
 *
 * IMPORTANT: there is no shared layout for the six buildings anywhere —
 * no flex, no grid, no computed row, no shared baseline/transform/scale.
 * The parent (`.navigation-city-scene__buildings` in
 * NavigationCityScene.css) is a plain `position: absolute; inset: 0`
 * box; each Building reads ONLY its own entry in
 * `src/data/navigation.ts`'s `navigationBuildings` array (keyed by `id`)
 * and positions itself independently via `left`/`bottom`/`transform`
 * derived from that entry alone. Moving one building in the data has zero
 * effect on any other — "they share a depth band" is a property of the
 * VALUES chosen in navigation.ts, never something this component imposes.
 *
 * The card (+ connector tick) sits ABOVE the building, never a label row
 * along the bottom — absolutely positioned within the button at the
 * building's own horizontal anchor point (`anchorXPercent`, see
 * NavigationBuilding.position), NOT simply centered on the button's box.
 * For every ordinary (portrait, centered) asset those are the same thing;
 * they differ for Timeline, whose wide canvas has the tower off-center
 * with a long track extending past it — the card needs to sit over the
 * tower, not the middle of the whole image.
 *
 * Buildings sit at different depths/vertical positions matching the
 * reference composition — `z` follows that same back-to-front ordering
 * so overlapping buildings occlude correctly.
 *
 * The card reveals in lockstep with the building itself (same `revealed`
 * boolean) — everything about a building, including its card, is one
 * simultaneous pop, not staged.
 *
 * No per-building platform/pad/oval here (explicitly not wanted) — the
 * environmental grounding comes primarily from the shared
 * navigation-city-environment.png layer in navigationCityEnvironment
 * .config.ts, plus three small per-building layers stacked at its base:
 * `nav-building__ground-shadow` (a soft dark radial-gradient contact
 * shadow, fully blurred to no edge), `nav-building__contact-glow` (a
 * single soft, heavily-blurred, borderless smear of the building's own
 * neon color), and `nav-building__reflection` (a short, masked, blurred
 * mirror of the building's OWN image, never a separate asset) for a
 * subtle wet-ground reflection. None of the three is a platform: no
 * border, no fill shape, no discernible edge — just enough to keep the
 * base from reading as a hard-edged cutout against the background. All
 * three are skipped for buildings set back into the midground/distance
 * (Timeline), which shouldn't read as standing on the wet foreground
 * ground plane at all.
 */
export function Building({ building, revealed, isMobile }: BuildingProps) {
  const position = isMobile ? building.position.mobile : building.position.desktop
  const scale = position.scale ?? 1
  const aspectRatio = building.assetWidth / building.assetHeight
  // Where in ITS OWN image the building "is", horizontally — 50 (center)
  // for every ordinary portrait asset, overridden for Timeline (see
  // NavigationBuilding.position.anchorXPercent).
  const anchorXPercent = position.anchorXPercent ?? 50

  // Static per-building placement (left/bottom/centering) never changes —
  // only the image's own opacity/transform below do (via CSS transition
  // on `revealed`), so nothing here ever triggers layout recalculation.
  // `translateX` is the DEFAULT -50% (centers the box on `x`) unless this
  // building overrides its horizontal anchor (Timeline only).
  const wrapperStyle: CSSProperties = {
    left: `${position.x}%`,
    bottom: `${position.y}%`,
    zIndex: position.z ?? building.order ?? 0,
    transform: `translateX(-${anchorXPercent}%)`,
  }

  const maxWidthVwDesktop = building.maxWidthVwDesktopOverride ?? MAX_WIDTH_VW_DESKTOP
  const maxHeightVhMobile = building.maxHeightVhMobileOverride ?? MAX_HEIGHT_VH_MOBILE

  const imageStyle: CSSProperties = {
    ...(isMobile
      ? { width: `min(${BASE_WIDTH_VW_MOBILE * scale}vw, calc(${maxHeightVhMobile * scale}vh * ${aspectRatio}))`, height: 'auto' }
      : { height: `min(${BASE_HEIGHT_VH_DESKTOP * scale}vh, calc(${maxWidthVwDesktop * scale}vw / ${aspectRatio}))`, width: 'auto' }),
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0) scale(1)' : `translateY(${RISE_FROM_VH}vh) scale(${EMERGE_SCALE_FROM})`,
    ...(building.accentColor ? ({ '--building-accent': building.accentColor } as CSSProperties) : {}),
  }

  // Buildings set back into the midground/distance (Timeline) shouldn't
  // read as standing on the wet foreground ground plane — skip the
  // foreground-only grounding effects for those. Timeline's canvas is
  // also mostly empty transparent track space, so a glow/reflection of
  // the whole box wouldn't land at the tower's base anyway.
  const showGroundEffects = anchorXPercent === 50
  // The card/marker/glow are positioned at the anchor point WITHIN the
  // button's own box (not the button's horizontal center) — for ordinary
  // buildings that's the same thing (anchor = 50%), but for Timeline the
  // button's box is the full wide canvas while the tower sits at ~25%.
  const anchorStyle: CSSProperties = { left: `${anchorXPercent}%` }

  const cardClassName = building.cardEmphasis
    ? `nav-building__card nav-building__card--${building.cardEmphasis}`
    : 'nav-building__card'

  return (
    <button type="button" className="nav-building" style={wrapperStyle} aria-label={building.label}>
      <div className="nav-building__label-group" style={anchorStyle}>
        <div className={cardClassName} style={{ opacity: revealed ? 1 : 0 }}>
          <span className="nav-building__card-aura" aria-hidden="true" />
          <span className="nav-building__card-glass" aria-hidden="true" />
          <span className="nav-building__card-content">
            <span className="nav-building__card-title">{building.label}</span>
            {building.description && (
              <>
                <span className="nav-building__card-rule" aria-hidden="true" />
                <span className="nav-building__card-desc">{building.description}</span>
              </>
            )}
          </span>
        </div>
        <span className="nav-building__marker" style={{ opacity: revealed ? 1 : 0 }} aria-hidden="true" />
      </div>
      {showGroundEffects && <span className="nav-building__ground-shadow" style={{ opacity: revealed ? 1 : 0 }} aria-hidden="true" />}
      {showGroundEffects && <span className="nav-building__contact-glow" style={{ opacity: revealed ? 1 : 0 }} aria-hidden="true" />}
      <img
        src={building.assetPath}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="nav-building__image"
        style={imageStyle}
      />
      {showGroundEffects && (
        <img
          src={building.assetPath}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="nav-building__reflection"
          style={{ opacity: revealed ? 0.22 : 0 }}
        />
      )}
    </button>
  )
}
