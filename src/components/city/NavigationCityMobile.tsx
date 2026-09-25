import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { navigationBuildings } from '@/data/navigation'
import { mobileNavigationLayout } from '@/data/navigationMobile'
import { ProfileAccessBadge } from '@/components/ui/ProfileAccessBadge'
import './NavigationCityMobile.css'

const BG_SRC = '/assets/city/navigation/navigation-mobile.webp'

/**
 * The MOBILE-ONLY navigation presentation — a completely separate camera
 * composition from desktop (see navigation-mobile.png), not a scaled-down
 * copy of it. Rendered by NavigationCityScene.tsx only when isMobile is
 * true, as a normal in-flow page section — NOT inside desktop's pinned
 * 100vh sticky viewport.
 *
 * The image is sized naturally (`width: 100%; height: auto`, see
 * NavigationCityMobile.css's `.mobile-nav-scene__bg`) — it is a normal,
 * in-flow block element, so it alone determines `.mobile-nav-scene`'s
 * height. Every other layer (connector SVG, cards) is `position: absolute;
 * inset: 0` inside that SAME element, which is why they stay correctly
 * anchored to the picture's actual content at any viewport width: no
 * JS-computed rect, no letterboxing, no cropping — the full composition is
 * always shown at its own aspect ratio, and the section is simply as tall
 * as the image renders.
 *
 * Six liquid-glass cards, each independently positioned near its own
 * landmark (see navigationMobile.ts), with a thin glowing connector line
 * running DOWN to the building and a synchronized glow/brighten at the
 * building's own anchor point on hover/touch. The identity terminal sits
 * at the bottom of the composition, below the cards; the Register Now CTA
 * lives in the hero (see IdentityLayer.tsx).
 */
export function NavigationCityMobile() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)

  const clearActive = (id: string) => setActiveId((current) => (current === id ? null : current))

  return (
    <section className="mobile-nav-section" id="buildings">
      <div className="mobile-nav-scene">
        <img
          src={BG_SRC}
          alt=""
          width={941}
          height={1672}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="mobile-nav-scene__bg"
        />

        {/* Same atmospheric handoff treatment as desktop (see
            NavigationCityScene.css) so the hero -> navigation transition
            reads as one continuous environment on mobile too. */}
        <div className="mobile-nav-scene__atmosphere-blend" aria-hidden="true" />
        <ProfileAccessBadge placement="bottom" />

        <svg
          className="mobile-nav-scene__connectors"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {navigationBuildings.map((building) => {
            const layout = mobileNavigationLayout[building.id]
            if (!layout) return null
            const isActive = activeId === building.id
            return (
              <line
                key={building.id}
                x1={layout.anchor.x}
                y1={layout.anchor.y}
                x2={layout.target.x}
                y2={layout.target.y}
                vectorEffect="non-scaling-stroke"
                className={`mobile-nav-scene__connector-line${isActive ? ' mobile-nav-scene__connector-line--active' : ''}`}
                style={{ '--connector-accent': building.accentColor } as CSSProperties}
              />
            )
          })}
        </svg>

        {navigationBuildings.map((building) => {
          const layout = mobileNavigationLayout[building.id]
          if (!layout) return null

          const cardTranslateX = layout.align === 'left' ? '0%' : layout.align === 'right' ? '-100%' : '-50%'
          const cardClassName = building.cardEmphasis
            ? `mobile-nav-card mobile-nav-card--${building.cardEmphasis}`
            : 'mobile-nav-card'

          return (
            <div key={building.id} className="mobile-nav-item">
              <span
                className="mobile-nav-item__glow"
                aria-hidden="true"
                style={
                  {
                    left: `${layout.target.x}%`,
                    top: `${layout.target.y}%`,
                    '--building-accent': building.accentColor,
                  } as CSSProperties
                }
              />
              <button
                type="button"
                className={cardClassName}
                style={
                  {
                    left: `${layout.anchor.x}%`,
                    top: `${layout.anchor.y}%`,
                    transform: `translate(${cardTranslateX}, -100%)`,
                    '--building-accent': building.accentColor,
                  } as CSSProperties
                }
                onClick={() => {
                  const targetElement = document.getElementById(building.sectionSlug)
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' })
                    return
                  }
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
                  navigate(`/${building.sectionSlug}`)
                }}
                onPointerEnter={() => setActiveId(building.id)}
                onPointerLeave={() => clearActive(building.id)}
                onFocus={() => setActiveId(building.id)}
                onBlur={() => clearActive(building.id)}
                aria-label={building.label}
              >
                <span className="mobile-nav-card__aura" aria-hidden="true" />
                <span className="mobile-nav-card__glass" aria-hidden="true" />
                <span className="mobile-nav-card__content">
                  <span className="mobile-nav-card__title">{building.label}</span>
                  {building.description && (
                    <>
                      <span className="mobile-nav-card__rule" aria-hidden="true" />
                      <span className="mobile-nav-card__desc">{building.description}</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
