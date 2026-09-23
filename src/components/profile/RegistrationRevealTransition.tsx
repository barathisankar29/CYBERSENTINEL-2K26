import { useEffect, useState, type CSSProperties } from 'react'
import type { CharacterConfig } from '@/types/characterProfile'
import './RegistrationRevealTransition.css'

interface RegistrationRevealTransitionProps {
  character: CharacterConfig
  onComplete: () => void
}

type Stage = 'verified' | 'assigned' | 'unlocked' | 'record'

const STAGE_ORDER: Stage[] = ['verified', 'assigned', 'unlocked', 'record']
const STAGE_MS = 900

/**
 * The reveal moment between a completed (mock) payment and the character
 * dossier — this is deliberately where character identity first becomes
 * visible to the user, not before. Fully data-driven: the character name
 * and theme color come from whichever character the purchased pack
 * resolved to (see utils/characterAssignment.ts), never hardcoded.
 */
export function RegistrationRevealTransition({ character, onComplete }: RegistrationRevealTransitionProps) {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const timers = STAGE_ORDER.map((_, i) =>
      setTimeout(() => setStageIndex(i + 1), STAGE_MS * (i + 1))
    )
    const finalTimer = setTimeout(onComplete, STAGE_MS * (STAGE_ORDER.length + 1))
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finalTimer)
    }
  }, [onComplete])

  const stage = STAGE_ORDER[Math.min(stageIndex, STAGE_ORDER.length - 1)]
  const showCharacter = stageIndex >= 2

  const style = {
    '--reveal-color': showCharacter ? character.theme.primary : '#22d3ee',
    '--reveal-glow': showCharacter ? character.theme.glow : 'rgba(34, 211, 238, 0.5)',
  } as CSSProperties

  return (
    <div className="reveal-transition" style={style}>
      <span className="reveal-transition__glow" aria-hidden="true" />

      <div className={`reveal-transition__stage ${stage === 'verified' ? 'reveal-transition__stage--active' : ''}`}>
        <span className="reveal-transition__label">
          <span className="reveal-transition__dot" />
          REGISTRATION VERIFIED
        </span>
      </div>

      <div className={`reveal-transition__stage ${stage === 'assigned' ? 'reveal-transition__stage--active' : ''}`}>
        <span className="reveal-transition__label">IDENTITY ASSIGNED</span>
      </div>

      <div className={`reveal-transition__stage ${stage === 'unlocked' ? 'reveal-transition__stage--active' : ''}`}>
        <div className="reveal-transition__character">{character.name}</div>
        <span className="reveal-transition__label">CHARACTER UNLOCKED</span>
      </div>

      <div className={`reveal-transition__stage ${stage === 'record' ? 'reveal-transition__stage--active' : ''}`}>
        <span className="reveal-transition__label">CLASSIFIED RECORD UNLOCKED</span>
      </div>
    </div>
  )
}
