import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './Airship.css'

/**
 * A cyberpunk airship that floats in the upper-left sky of the buildings page
 * (desktop only), carrying a hanging banner with a poster image.
 *
 * When the banner is clicked, a full-size cyberpunk modal popup displays the image.
 *
 * Rendered in NavigationCityScene (desktop) and, repositioned via `className`,
 * in MobileGateSection (phones).
 */

const BANNER_IMAGE = '/assets/city/navigation/chief-guest-poster.jpg'
const BANNER_LABEL = 'CHIEF GUEST'

export function Airship({ className }: { className?: string } = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

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

        {/* Rigging cables connecting directly from blimp hull to banner */}
        <div className="airship__rigging">
          <svg
            className="airship__wires"
            viewBox="0 0 80 26"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Top anchor rail flush inside the blimp belly */}
            <line x1="8" y1="2" x2="72" y2="2" stroke="rgba(168, 85, 247, 0.9)" strokeWidth="1.5" />

            {/* Parallel vertical cables dropping straight from ship hull to banner rail */}
            <line x1="12" y1="2" x2="12" y2="24" stroke="rgba(34, 211, 238, 0.85)" strokeWidth="1.2" />
            <line x1="26" y1="2" x2="26" y2="24" stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2" />
            <line x1="40" y1="2" x2="40" y2="24" stroke="rgba(34, 211, 238, 0.95)" strokeWidth="1.4" />
            <line x1="54" y1="2" x2="54" y2="24" stroke="rgba(168, 85, 247, 0.85)" strokeWidth="1.2" />
            <line x1="68" y1="2" x2="68" y2="24" stroke="rgba(34, 211, 238, 0.85)" strokeWidth="1.2" />

            {/* Top anchor rivets */}
            <circle cx="12" cy="2" r="1.4" fill="#22d3ee" />
            <circle cx="26" cy="2" r="1.4" fill="#a855f7" />
            <circle cx="40" cy="2" r="1.4" fill="#22d3ee" />
            <circle cx="54" cy="2" r="1.4" fill="#a855f7" />
            <circle cx="68" cy="2" r="1.4" fill="#22d3ee" />

            {/* Bottom spreader rail holding top of banner */}
            <line x1="6" y1="24" x2="74" y2="24" stroke="rgba(34, 211, 238, 0.95)" strokeWidth="2" />
          </svg>
        </div>

        {/* Hanging banner button - clickable */}
        <button
          type="button"
          className="airship__banner"
          onClick={() => setIsModalOpen(true)}
          title="Click to view full poster"
          aria-label="View CyberSentinel poster in full size"
        >
          <div className="airship__banner-frame">
            <img
              src={BANNER_IMAGE}
              alt="CyberSentinel Poster"
              className="airship__banner-img"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
            <span className="airship__banner-label">{BANNER_LABEL}</span>
            <span className="airship__banner-badge">VIEW</span>
          </div>
        </button>
      </div>

      {/* Full-size Popup Modal (Rendered to document.body via Portal) */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          // Clicking the dimmed backdrop (not the poster) closes the popup.
          <div
            role="presentation"
            className="airship-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="CyberSentinel Airship Poster"
              className="airship-modal-content"
            >
              {/* Modal Header */}
              <div className="airship-modal-header">
                <div className="airship-modal-title">
                  <span className="airship-modal-tag">[AERIAL RECON]</span>
                  <span className="airship-modal-heading">CYBERSENTINEL 2K26</span>
                </div>
                <button
                  type="button"
                  className="airship-modal-close"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsModalOpen(false)
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
                  src={BANNER_IMAGE}
                  alt="CyberSentinel Full Poster"
                  className="airship-modal-img"
                />
                <div className="airship-modal-scanline" aria-hidden="true" />
              </div>

              {/* Modal Footer */}
              <div className="airship-modal-footer">
                <span className="airship-modal-footer-text">
                  PUBLIC SECURITY ARCHIVE // CLASSIFIED DISPATCH
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
