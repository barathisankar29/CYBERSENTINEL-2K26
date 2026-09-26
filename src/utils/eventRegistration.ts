import type { CharacterId, RegistrationPack, RegistrationRecord } from '@/types/characterProfile'

/**
 * Mock/test registration store for the character-profile events system.
 * Backed by localStorage only — there is no real backend, authentication,
 * or payment provider wired up yet. `paymentStatus` is always
 * `'test_mode_unverified'`: this never claims a payment succeeded. When a
 * real payment provider exists, replace `completeMockRegistration` with a
 * real API call and only persist a record after the provider confirms
 * payment server-side.
 */
const STORAGE_KEY = 'cybersentinel_event_registration'

export function getRegistration(): RegistrationRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as RegistrationRecord
  } catch {
    return null
  }
}

function generateRegistrationId(characterId: CharacterId): string {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `REG-${characterId.toUpperCase()}-${suffix}`
}

/**
 * Records a registration AFTER the mock/test payment step completes.
 * `paymentStatus` is hardcoded to `'test_mode_unverified'` — this function
 * must never be called as if it represents a real, provider-confirmed
 * payment.
 */
export function completeMockRegistration(
  characterId: CharacterId,
  pack: RegistrationPack,
  username: string,
  email: string
): RegistrationRecord {
  const record: RegistrationRecord = {
    registrationId: generateRegistrationId(characterId),
    characterId,
    packId: pack.id,
    events: pack.events,
    username,
    email,
    registeredAt: new Date().toISOString(),
    paymentStatus: 'test_mode_unverified',
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Ignore storage errors — the caller still gets the record back for
    // this session even if it can't persist.
  }

  return record
}

export function clearRegistration(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

/**
 * Records the profile/character for a registration that the Supabase
 * backend (public-register) has ACCEPTED. `registrationId` is the backend's
 * own registration_code — nothing here is generated client-side. Payment
 * stays 'under_review' locally; verified status only ever comes from the
 * backend's check-registration.
 */
export function recordBackendRegistration(
  characterId: CharacterId,
  pack: RegistrationPack,
  registrationCode: string,
  username: string,
  email: string
): RegistrationRecord {
  const record: RegistrationRecord = {
    registrationId: registrationCode,
    characterId,
    packId: pack.id,
    events: pack.events,
    username,
    email,
    registeredAt: new Date().toISOString(),
    paymentStatus: 'under_review',
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Storage unavailable — the backend registration itself already succeeded.
  }

  return record
}
