import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { navigationBuildings } from '@/data/navigation'
import { mobileNavigationLayout } from '@/data/navigationMobile'
import { ProfileAccessBadge } from '@/components/ui/ProfileAccessBadge'
import { useMascot } from '@/components/mascot'
import './NavigationCityMobile.css'

const BG_SRC = '/assets/city/navigation/navigation-mobile.webp'

export function NavigationCityMobile() {
  const navigate = useNavigate()
  const { dispatchMascotEvent } = useMascot()
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

        {/* Futuristic Laser Seam & Portal Mist between Hero and Buildings */}
        <div className="navigation-city-scene__horizon-line" aria-hidden="true" />
        <div className="navigation-city-scene__portal-mist" aria-hidden="true" />
        <div className="navigation-city-scene__grid-pattern" aria-hidden="true" />

        {/* Same atmospheric handoff treatment as desktop */}
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
                data-building-id={building.id}
                style={
                  {
                    left: `${layout.anchor.x}%`,
                    top: `${layout.anchor.y}%`,
                    transform: `translate(${cardTranslateX}, -100%)`,
                    '--building-accent': building.accentColor,
                  } as CSSProperties
                }
                onClick={() => {
                  dispatchMascotEvent('MASCOT_CLICK_BUILDING', { buildingId: building.id })
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
                  navigate(`/${building.sectionSlug}`)
                }}
                onPointerEnter={() => {
                  setActiveId(building.id)
                  dispatchMascotEvent('MASCOT_HOVER_BUILDING', { buildingId: building.id })
                }}
                onPointerLeave={() => clearActive(building.id)}
                onFocus={() => {
                  setActiveId(building.id)
                  dispatchMascotEvent('MASCOT_HOVER_BUILDING', { buildingId: building.id })
                }}
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
