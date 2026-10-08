import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './Airship.css'

/**
 * A cyberpunk airship that floats in the sky of the gate section, carrying
 * two side-by-side hanging poster cards under its hull.
 *
 * When either card is clicked, a full-size cyberpunk modal popup displays the poster,
 * with tab controls to switch between the two cards.
 */

export interface AirshipCard {
  id: string
  title: string
  label: string
  tag: string
  image: string
  subtitle?: string
}

export const CHIEF_GUEST_CARDS: AirshipCard[] = [
  {
    id: 'guest-01',
    title: 'CHIEF GUEST 01',
    label: 'CHIEF GUEST 01',
    tag: '[GUEST 01]',
    image: '/assets/city/navigation/chief-guest-poster.jpg',
    subtitle: 'DAY 01 // INAUGURATION CEREMONY'
  },
  {
    id: 'guest-02',
    title: 'CHIEF GUEST 02',
    label: 'CHIEF GUEST 02',
    tag: '[GUEST 02]',
    image: '/assets/city/navigation/chief-guest-poster.jpg',
    subtitle: 'DAY 02 // VALEDICTORY CEREMONY'
  }
]

export function Airship({
  className,
  cards = CHIEF_GUEST_CARDS
}: {
  className?: string
  cards?: AirshipCard[]
} = {}) {
  const [selectedCard, setSelectedCard] = useState<AirshipCard | null>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    if (!selectedCard) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCard(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCard])

  return (
    <>
      <div className={className ? `airship ${className}` : 'airship'}>
        {/* The blimp hull */}
        <div className="airship__hull">
          <img
            src="/assets/city/navigation/airship-new.png"
            alt="CyberSentinel Airship"
            className="airship__blimp"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Dual-card hanging payload assembly */}
        <div className="airship__payload">
          {/* Dual rigging cables connecting hull directly to both cards */}
          <div className="airship__rigging">
            <svg
              className="airship__wires"
              viewBox="0 0 200 28"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Top anchor rail flush inside the blimp belly */}
              <line x1="8" y1="2" x2="192" y2="2" stroke="rgba(168, 85, 247, 0.95)" strokeWidth="1.8" />
              <line x1="16" y1="3.5" x2="184" y2="3.5" stroke="rgba(34, 211, 238, 0.65)" strokeWidth="0.8" />

              {/* Top anchor rivets */}
              <circle cx="16" cy="2" r="1.5" fill="#22d3ee" />
              <circle cx="38" cy="2" r="1.5" fill="#a855f7" />
              <circle cx="62" cy="2" r="1.5" fill="#22d3ee" />
              <circle cx="86" cy="2" r="1.5" fill="#a855f7" />
              <circle cx="100" cy="2" r="1.8" fill="#22d3ee" />
              <circle cx="114" cy="2" r="1.5" fill="#a855f7" />
              <circle cx="138" cy="2" r="1.5" fill="#22d3ee" />
              <circle cx="162" cy="2" r="1.5" fill="#a855f7" />
              <circle cx="184" cy="2" r="1.5" fill="#22d3ee" />

              {/* Card 1 (Left): Vertical cables */}
              <line x1="16" y1="2" x2="16" y2="25" stroke="rgba(34, 211, 238, 0.9)" strokeWidth="1.3" />
              <line x1="38" y1="2" x2="38" y2="25" stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2" />
              <line x1="62" y1="2" x2="62" y2="25" stroke="rgba(34, 211, 238, 0.9)" strokeWidth="1.3" />
              <line x1="86" y1="2" x2="86" y2="25" stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2" />
              {/* Card 1 cross braces */}
              <line x1="16" y1="2" x2="50" y2="25" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.8" strokeDasharray="3 2" />
              <line x1="86" y1="2" x2="50" y2="25" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.8" strokeDasharray="3 2" />

              {/* Card 1 spreader rail */}
              <line x1="10" y1="25" x2="92" y2="25" stroke="rgba(34, 211, 238, 0.95)" strokeWidth="2" />
              <circle cx="16" cy="25" r="1.3" fill="#22d3ee" />
              <circle cx="38" cy="25" r="1.3" fill="#a855f7" />
              <circle cx="62" cy="25" r="1.3" fill="#22d3ee" />
              <circle cx="86" cy="25" r="1.3" fill="#a855f7" />

              {/* Center connector link truss */}
              <line x1="92" y1="25" x2="108" y2="25" stroke="rgba(168, 85, 247, 0.9)" strokeWidth="2.2" />
              <line x1="100" y1="2" x2="100" y2="25" stroke="rgba(34, 211, 238, 0.9)" strokeWidth="1.4" />
              <circle cx="100" cy="25" r="1.8" fill="#22d3ee" />

              {/* Card 2 (Right): Vertical cables */}
              <line x1="114" y1="2" x2="114" y2="25" stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2" />
              <line x1="138" y1="2" x2="138" y2="25" stroke="rgba(34, 211, 238, 0.9)" strokeWidth="1.3" />
              <line x1="162" y1="2" x2="162" y2="25" stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2" />
              <line x1="184" y1="2" x2="184" y2="25" stroke="rgba(34, 211, 238, 0.9)" strokeWidth="1.3" />
              {/* Card 2 cross braces */}
              <line x1="114" y1="2" x2="150" y2="25" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.8" strokeDasharray="3 2" />
              <line x1="184" y1="2" x2="150" y2="25" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.8" strokeDasharray="3 2" />

              {/* Card 2 spreader rail */}
              <line x1="108" y1="25" x2="190" y2="25" stroke="rgba(34, 211, 238, 0.95)" strokeWidth="2" />
              <circle cx="114" cy="25" r="1.3" fill="#a855f7" />
              <circle cx="138" cy="25" r="1.3" fill="#22d3ee" />
              <circle cx="162" cy="25" r="1.3" fill="#a855f7" />
              <circle cx="184" cy="25" r="1.3" fill="#22d3ee" />
            </svg>
          </div>

          {/* Cards row: side-by-side hanging cards */}
          <div className="airship__cards-row">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                className={`airship__card airship__card--${idx === 0 ? 'left' : 'right'}`}
                onClick={() => setSelectedCard(card)}
                title={`Click to view ${card.title} poster`}
                aria-label={`View ${card.title} poster in full size`}
              >
                <div className="airship__card-frame">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="airship__card-img"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="airship__card-label">{card.label}</span>
                  <span className="airship__card-badge">VIEW</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full-size Popup Modal (Rendered to document.body via Portal) */}
      {selectedCard &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="presentation"
            className="airship-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCard(null)
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedCard.title} Poster`}
              className="airship-modal-content"
            >
              {/* Modal Header */}
              <div className="airship-modal-header">
                <div className="airship-modal-title">
                  <span className="airship-modal-tag">[AERIAL RECON]</span>
                  <span className="airship-modal-heading">{selectedCard.title} // CYBERSENTINEL 2K26</span>
                </div>

                {/* Switcher tabs between the two cards */}
                <div className="airship-modal-tabs">
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      className={`airship-modal-tab ${
                        card.id === selectedCard.id ? 'airship-modal-tab--active' : ''
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      {card.tag}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="airship-modal-close"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCard(null)
                  }}
                  title="Close [ESC]"
                  aria-label="Close poster view"
                >
                  [✕]
                </button>
              </div>

              {/* Modal Image Frame */}
              <div className="airship-modal-img-wrap">
                <img
                  src={selectedCard.image}
                  alt={`${selectedCard.title} Full Poster`}
                  className="airship-modal-img"
                />
                <div className="airship-modal-scanline" aria-hidden="true" />
              </div>

              {/* Modal Footer */}
              <div className="airship-modal-footer">
                <span className="airship-modal-footer-text">
                  {selectedCard.subtitle ?? 'PUBLIC SECURITY ARCHIVE // CLASSIFIED DISPATCH'}
                </span>
                <span className="airship-modal-footer-action">
                  PRESS ESC OR CLICK OUTSIDE TO CLOSE
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
