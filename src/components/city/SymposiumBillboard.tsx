import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './Airship.css'
import './SymposiumBillboard.css'

/**
 * The CyberSentinel 2K26 billboard standing on the street between the EVENTS
 * tower and the TRANSPORT building (desktop buildings page only). Clicking
 * it opens the full official poster in the same popup style the airship
 * uses (airship-modal-* classes from Airship.css).
 *
 * It appears together with the buildings (`revealed`), see
 * NavigationCityScene.tsx.
 */

const BILLBOARD_IMAGE = '/assets/city/navigation/symposium-billboard.webp'
const POSTER_IMAGE = '/assets/city/notice_board/Main_Poster.jpeg'

export function SymposiumBillboard({ revealed, className }: { revealed: boolean; className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ESC closes the poster.
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
      <button
        type="button"
        className={`symposium-billboard ${revealed ? 'is-revealed' : ''} ${className ?? ''}`}
        onClick={() => setIsModalOpen(true)}
        title="Click to view the official poster"
        aria-label="View the official CyberSentinel 2K26 poster"
        tabIndex={revealed ? 0 : -1}
      >
        <img
          src={BILLBOARD_IMAGE}
          alt=""
          className="symposium-billboard__img"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
        <span className="symposium-billboard__hint" aria-hidden="true">
          VIEW POSTER
        </span>
      </button>

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
              aria-label="CyberSentinel 2K26 official poster"
              className="airship-modal-content"
            >
              <div className="airship-modal-header">
                <div className="airship-modal-title">
                  <span className="airship-modal-tag">[OFFICIAL POSTER]</span>
                  <span className="airship-modal-heading">CYBERSENTINEL 2K26</span>
                </div>
                <button
                  type="button"
                  className="airship-modal-close"
                  onClick={() => setIsModalOpen(false)}
                  title="Close [ESC]"
                  aria-label="Close poster view"
                >
                  [✕]
                </button>
              </div>

              <div className="airship-modal-img-wrap">
                <img src={POSTER_IMAGE} alt="CyberSentinel 2K26 official poster" className="airship-modal-img" />
                <div className="airship-modal-scanline" aria-hidden="true" />
              </div>

              <div className="airship-modal-footer">
                <span className="airship-modal-footer-text">14TH &amp; 15TH OCTOBER 2026 // NATIONAL LEVEL SYMPOSIUM</span>
                <span className="airship-modal-footer-action">PRESS ESC OR CLICK OUTSIDE TO CLOSE</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
