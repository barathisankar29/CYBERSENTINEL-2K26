import { Link } from 'react-router-dom'
import type { CharacterConfig, RegistrationPack } from '@/types/characterProfile'
import { characterList } from '@/data/characterProfiles'
import { CharacterCard } from './CharacterCard'
import './CharacterSelection.css'

interface CharacterSelectionProps {
  onSelectPack: (character: CharacterConfig, pack: RegistrationPack) => void
}

/** Pre-registration state — no character assigned yet (`character === null`
 * in the parent's state), so this uses the site's own neutral cyan/violet
 * tokens rather than any one character's theme. */
export function CharacterSelection({ onSelectPack }: CharacterSelectionProps) {
  return (
    <div className="selection-root">
      <header className="profile-header" style={{ maxWidth: 1300, margin: '0 auto 1.5rem' }}>
        <Link to="/" className="profile-back-btn" style={{ color: '#22d3ee', borderColor: 'rgba(34,211,238,0.45)', background: 'rgba(34,211,238,0.1)' }}>
          ← BACK
        </Link>
      </header>

      <div className="selection-status">
        <span className="selection-status__title">YOU HAVE NOT REGISTERED ANY EVENTS</span>
        <span className="selection-status__subtitle">YOU HAVE NOT BEEN ASSIGNED A CHARACTER</span>
      </div>

      <div className="selection-grid">
        {characterList.map((character) => (
          <CharacterCard key={character.id} character={character} onSelectPack={onSelectPack} />
        ))}
      </div>
    </div>
  )
}
