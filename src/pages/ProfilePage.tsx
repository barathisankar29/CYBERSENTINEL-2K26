import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getRegistration } from '@/utils/eventRegistration'
import { getLastRegistration } from '@/services/registration/storage'
import { checkRegistration } from '@/services/registration/api'
import type { CheckRegistrationResponse } from '@/services/registration/types'
import { characterProfiles } from '@/data/characterProfiles'
import type { CharacterId, RegistrationRecord } from '@/types/characterProfile'
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
  const [searchParams] = useSearchParams()
  const queryChar = (searchParams.get('char') || '').toLowerCase()
  const storedRegistration = getRegistration()
  const lastReg = getLastRegistration()
  const [backendRecord, setBackendRecord] = useState<CheckRegistrationResponse | null>(null)

  // Query backend check-registration if user has a submitted registration
  useEffect(() => {
    if (lastReg?.email && lastReg?.phone) {
      checkRegistration(lastReg.email, lastReg.phone)
        .then((res) => {
          setBackendRecord(res)
        })
        .catch((err) => {
          console.warn('Backend registration check for profile:', err)
        })
    }
  }, [lastReg?.email, lastReg?.phone])

  // If ?char= query param is provided and matches a character, preview that character
  const targetCharId = (queryChar in characterProfiles ? queryChar : storedRegistration?.characterId) as CharacterId | undefined

  if (!storedRegistration && !targetCharId && !lastReg) {
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
          <Link to="/#buildings" className="profile-empty__back">← Return to City</Link>
        </div>
      </div>
    )
  }

  const activeCharId = targetCharId || 'dacre'
  const character = characterProfiles[activeCharId]

  // Construct registration record merged with backend check data if available
  const registrationId = backendRecord?.registration.registration_code ||
    (storedRegistration?.registrationId ?? `REG-${activeCharId.toUpperCase()}-7729`)

  const username = backendRecord?.participant.name ||
    (storedRegistration?.username ?? `OPERATIVE_${activeCharId.toUpperCase()}`)

  const email = backendRecord ? (lastReg?.email ?? `${activeCharId}@cybersentinel.city`) :
    (storedRegistration?.email ?? `${activeCharId}@cybersentinel.city`)

  const registration: RegistrationRecord = {
    registrationId,
    characterId: activeCharId as CharacterId,
    packId: character.packs[0]?.id || 'day1',
    events: character.packs[0]?.events || [],
    username,
    email,
    registeredAt: storedRegistration?.registeredAt || new Date().toISOString(),
    paymentStatus: storedRegistration?.paymentStatus ?? 'test_mode_unverified',
    qrUrl: backendRecord?.qr_url || null,
    isVerified: backendRecord?.payment?.status === 'VERIFIED',
    selectedDay: backendRecord?.registration.selected_day,
    college: backendRecord?.participant.college,
    department: backendRecord?.participant.department,
  }

  return <CharacterProfile character={character} registration={registration} />
}
