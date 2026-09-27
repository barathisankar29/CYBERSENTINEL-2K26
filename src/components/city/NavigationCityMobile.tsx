import { useState, useEffect, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { navigationBuildings } from '@/data/navigation'
import { mobileNavigationLayout } from '@/data/navigationMobile'
import { ProfileAccessBadge } from '@/components/ui/ProfileAccessBadge'
import { MASCOT_SPRITES, type MascotExpression } from '@/data/mascot'
import './NavigationCityMobile.css'

const BG_SRC = '/assets/city/navigation/navigation-mobile.webp'

const MOBILE_MASCOT_DIALOGUES: { text: string; pose: MascotExpression }[] = [
  { text: '⚡ TAP ANY BUILDING TO ENTER!', pose: 'happy' },
  { text: '🎮 15+ HACKS & ESPORTS ARENA!', pose: 'cheer' },
  { text: '⏳ SKYRAIL HAS ALL ROUND TIMINGS!', pose: 'fly' },
  { text: '🕶️ MEET OUR TEAM IN CREDENTIALS!', pose: 'wave' },
  { text: '🚀 BUS ROUTES IN TRANSPORT HUB!', pose: 'curious' },
  { text: '🏛️ EXPLORE DEPT ARCHIVES IN ABOUT!', pose: 'float' },
]

export function NavigationCityMobile() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mascotIdx, setMascotIdx] = useState(0)

  const clearActive = (id: string) => setActiveId((current) => (current === id ? null : current))

  const handleNextDialogue = () => {
    setMascotIdx((prev) => (prev + 1) % MOBILE_MASCOT_DIALOGUES.length)
  }

  // Smoothly rotate dialogue tips every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setMascotIdx((prev) => (prev + 1) % MOBILE_MASCOT_DIALOGUES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const currentDialogue = MOBILE_MASCOT_DIALOGUES[mascotIdx]
  const currentSprite = MASCOT_SPRITES[currentDialogue.pose] || MASCOT_SPRITES.float

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
                style={
                  {
                    left: `${layout.anchor.x}%`,
                    top: `${layout.anchor.y}%`,
                    transform: `translate(${cardTranslateX}, -100%)`,
                    '--building-accent': building.accentColor,
                  } as CSSProperties
                }
                onClick={() => {
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

        {/* Mobile Mascot Companion Stationed in the Open Plaza Courtyard Space (Circled by user) */}
        <div
          className="mobile-nav-mascot"
          style={{ left: '68%', top: '70%' }}
          onClick={handleNextDialogue}
          role="button"
          tabIndex={0}
          aria-label="Tap mascot companion for navigation hints"
        >
          <div className="mobile-nav-mascot__bubble">
            <div className="mobile-nav-mascot__bubble-beak" aria-hidden="true" />
            <span className="mobile-nav-mascot__speech">{currentDialogue.text}</span>
          </div>

          <div className="mobile-nav-mascot__actor">
            <div className="mobile-nav-mascot__glow" aria-hidden="true" />
            <img
              src={currentSprite.src}
              alt="CyberSentinel Mobile Guide"
              className="mobile-nav-mascot__img"
              draggable={false}
            />
            <div className="mobile-nav-mascot__badge">GUIDE</div>
          </div>
        </div>
      </div>
    </section>
  )
}
