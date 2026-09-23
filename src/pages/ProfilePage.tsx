import { Link } from 'react-router-dom'
import { getRegistration } from '@/utils/eventRegistration'
import { characterProfiles } from '@/data/characterProfiles'
import { CharacterProfile } from '@/components/profile/CharacterProfile'
import './ProfileEmptyState.css'

const CHARACTER_COLORS = ['#38bdf8', '#a855f7', '#2dd4bf', '#d4af37']

/**
 * /profile — dynamically loads whichever character the user's stored
 * registration resolved to (see utils/eventRegistration.ts). There is no
 * per-character route: the character is derived from registration data,
 * never hardcoded or chosen directly. Before registration, this shows a
 * "grand" all-four-colors prompt to register instead of any fake/empty
 * character dossier.
 */
export function ProfilePage() {
  const registration = getRegistration()

  if (!registration) {
    return (
      <div className="profile-empty">
        <div className="profile-empty__card">
          <div className="profile-empty__glyphs" aria-hidden="true">
            {CHARACTER_COLORS.map((color) => (
              <span key={color} className="profile-empty__glyph" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
            ))}
          </div>
          <span className="profile-empty__eyebrow">CYBERSENTINEL CITY // IDENTITY REGISTRY</span>
          <h1 className="profile-empty__title">IDENTITY NOT ASSIGNED</h1>
          <p className="profile-empty__desc">
            No active record found. Register for an event or package to have a character
            assigned and unlock your classified dossier — NICO, RUELLE, Dr. DACRE, or COSMA.
          </p>
          <Link to="/events" className="profile-empty__cta">
            REGISTER TO UNLOCK YOUR CHARACTER
          </Link>
          <Link to="/" className="profile-empty__back">← Return to City</Link>
        </div>
      </div>
    )
  }

  const character = characterProfiles[registration.characterId]
  return <CharacterProfile character={character} registration={registration} />
}
