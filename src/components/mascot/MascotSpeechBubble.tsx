import type { CSSProperties } from 'react'
import type { MascotSpeech, MascotPosition, MascotBubblePlacement } from '@/types/mascot'
import { getMascotDimensions } from './MascotPhysics'
import './MascotSpeechBubble.css'

interface MascotSpeechBubbleProps {
  speech: MascotSpeech | null
  position: MascotPosition
  isMobile: boolean
  onClose: () => void
  isTourActive?: boolean
  onSkipTour?: () => void
  /** Explicit side chosen by a guide; otherwise decided from the mascot's position. */
  placement?: MascotBubblePlacement | null
}

export function MascotSpeechBubble({
  speech,
  position,
  isMobile,
  onClose,
  isTourActive,
  onSkipTour,
  placement,
}: MascotSpeechBubbleProps) {
  if (!speech) return null

  const { width: mascotW } = getMascotDimensions(isMobile)

  // Smart repositioning so bubble never goes off screen
  const isRightHalf = placement
    ? placement.side === 'left'
    : typeof window !== 'undefined' && position.x > window.innerWidth / 2
  const isNearTop = placement ? placement.vertical === 'below' : position.y < 180

  const style: CSSProperties = {}

  if (isRightHalf) {
    // Bubble to the left of mascot
    style.right = `${mascotW + 12}px`
    style.left = 'auto'
  } else {
    // Bubble to the right of mascot
    style.left = `${mascotW + 12}px`
    style.right = 'auto'
  }

  if (isNearTop) {
    // Show below mascot
    style.top = `${mascotW * 0.5}px`
    style.bottom = 'auto'
  } else {
    // Show above mascot
    style.bottom = `${mascotW * 0.4}px`
    style.top = 'auto'
  }

  const cloudClasses = [
    'mascot-speech-bubble',
    'mascot-speech-cloud',
    isRightHalf ? 'mascot-speech-cloud--left' : 'mascot-speech-cloud--right',
    isNearTop ? 'mascot-speech-cloud--below' : 'mascot-speech-cloud--above',
  ].join(' ')

  return (
    <div className={cloudClasses} style={style} role="status" aria-live="polite">
      {/* Liquid glass cloud pointer droplets */}
      <div className="mascot-speech-cloud__tail" aria-hidden="true">
        <span className="mascot-speech-cloud__droplet mascot-speech-cloud__droplet--large" />
        <span className="mascot-speech-cloud__droplet mascot-speech-cloud__droplet--small" />
      </div>

      <div className="mascot-speech-bubble__header">
        <span className="mascot-speech-bubble__tag">SENTINEL PET // v2.6</span>
        <button
          type="button"
          onClick={onClose}
          className="mascot-speech-bubble__close"
          aria-label="Dismiss speech"
        >
          ✕
        </button>
      </div>

      <p className="mascot-speech-bubble__text">{speech.text}</p>

      {(speech.action || isTourActive) && (
        <div className="mascot-speech-bubble__actions">
          {isTourActive && onSkipTour && (
            <button
              type="button"
              onClick={onSkipTour}
              className="mascot-speech-bubble__btn-secondary"
            >
              SKIP
            </button>
          )}
          {speech.action && (
            <button
              type="button"
              onClick={speech.action.onClick}
              className="mascot-speech-bubble__btn"
            >
              {speech.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
