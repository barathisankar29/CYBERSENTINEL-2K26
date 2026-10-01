import { useState, useEffect, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { navigationBuildings } from '@/data/navigation'
import { mobileNavigationLayout } from '@/data/navigationMobile'
import { ProfileAccessBadge } from '@/components/ui/ProfileAccessBadge'
import { useMascot } from '@/components/mascot'
import { MASCOT_SPRITES, type MascotExpression } from '@/data/mascot'
import { MOBILE_NAVIGATION_BG } from './useWarmBuildingsImages'
import { RainEffect } from './RainEffect'
import './NavigationCityMobile.css'

const BG_SRC = MOBILE_NAVIGATION_BG

interface MobileMascotDialogue {
  text: string
  pageSlug?: string
  pose: MascotExpression
}

const MOBILE_MASCOT_DIALOGUES: MobileMascotDialogue[] = [
  { text: '✨ TAP ANY BUILDING TO EXPLORE CYBERSENTINEL 2K26!', pose: 'happy' },
  { text: '⚡ EVENTS: CODING, WEBLICA, BGM & TALENT SHOWS!', pageSlug: 'events', pose: 'cheer' },
  { text: '⏳ TIMELINE: DAY 1 & 2 ROUND SCHEDULES & TIMINGS!', pageSlug: 'timeline', pose: 'fly' },
  { text: '🕶️ COORDINATORS: MEET STUDENT LEADS & DEVELOPERS!', pageSlug: 'credentials', pose: 'wave' },
  { text: '🚌 TRANSPORT: COLLEGE BUS ROUTES & PICKUP TIMINGS!', pageSlug: 'transport', pose: 'curious' },
  { text: '📞 CONTACT: CALL OR REACH OUT TO OUR ORGANIZERS!', pageSlug: 'contact', pose: 'happy' },
  { text: '🏛️ ABOUT: DISCOVER VEL TECH HIGH TECH INSTITUTION!', pageSlug: 'about', pose: 'float' },
]

export function NavigationCityMobile() {
  const navigate = useNavigate()
  const { dispatchMascotEvent } = useMascot()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mascotIdx, setMascotIdx] = useState(0)

  const clearActive = (id: string) => setActiveId((current) => (current === id ? null : current))

  const handleNextDialogue = () => {
    setMascotIdx((prev) => (prev + 1) % MOBILE_MASCOT_DIALOGUES.length)
  }

  const handleBubbleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const current = MOBILE_MASCOT_DIALOGUES[mascotIdx]
    if (current?.pageSlug) {
      dispatchMascotEvent('MASCOT_CLICK_BUILDING', { buildingId: current.pageSlug })
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      navigate(`/${current.pageSlug}`)
    } else {
      handleNextDialogue()
    }
  }

  // Smoothly rotate dialogue tips every 4.0s
  useEffect(() => {
    const timer = setInterval(() => {
      setMascotIdx((prev) => (prev + 1) % MOBILE_MASCOT_DIALOGUES.length)
    }, 4000)
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
        <RainEffect zIndex={1} />
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

        {/* Mobile Mascot Companion Stationed in the Open Plaza Courtyard Space */}
        <div
          className="mobile-nav-mascot"
          style={{ left: '68%', top: '70%' }}
          role="region"
          aria-label="Tap mascot companion for navigation hints"
        >
          <div
            className="mobile-nav-mascot__bubble"
            onClick={handleBubbleClick}
            style={{ cursor: currentDialogue.pageSlug ? 'pointer' : 'default' }}
            title={currentDialogue.pageSlug ? `Tap to visit ${currentDialogue.pageSlug}` : 'Tap for next hint'}
          >
            <div className="mobile-nav-mascot__bubble-beak" aria-hidden="true" />
            <span className="mobile-nav-mascot__speech">{currentDialogue.text}</span>
            {currentDialogue.pageSlug && (
              <span className="mobile-nav-mascot__action-hint">TAP TO OPEN ➔</span>
            )}
          </div>

          <div
            className="mobile-nav-mascot__actor"
            onClick={handleNextDialogue}
            role="button"
            tabIndex={0}
            title="Click mascot for next guide hint"
          >
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
