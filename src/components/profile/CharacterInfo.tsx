import type { CharacterConfig, RegistrationRecord } from '@/types/characterProfile'

interface CharacterInfoProps {
  character: CharacterConfig
  registration: RegistrationRecord
}

const PAYMENT_STATUS_LABEL: Record<RegistrationRecord['paymentStatus'], string> = {
  test_mode_unverified: 'TEST MODE — UNVERIFIED',
}

export function CharacterInfo({ character, registration }: CharacterInfoProps) {
  const registeredDate = new Date(registration.registeredAt)
  const formattedDate = Number.isNaN(registeredDate.getTime())
    ? registration.registeredAt
    : registeredDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <section className="profile-panel profile-panel--info" aria-label="Registration record">
      <span className="profile-corner profile-corner--tl" aria-hidden="true" />
      <span className="profile-corner profile-corner--tr" aria-hidden="true" />
      <span className="profile-corner profile-corner--bl" aria-hidden="true" />
      <span className="profile-corner profile-corner--br" aria-hidden="true" />

      <div className="profile-id-layout">
        <div className="profile-id-portrait">
          <img src={character.shortImage} alt={character.name} draggable={false} />
        </div>

        <div className="profile-id-table">
          <div className="profile-panel__header">
            <span className="profile-panel__title">{character.recordId}</span>
            <span className="profile-panel__hint" style={{ color: 'var(--char-text-tint)', fontStyle: 'italic' }}>
              {character.quote}
            </span>
          </div>

          <dl>
            <div className="profile-id-row">
              <dt>Character</dt>
              <dd className="tint">{character.name}</dd>
            </div>
            <div className="profile-id-row">
              <dt>Registration ID</dt>
              <dd>{registration.registrationId}</dd>
            </div>
            <div className="profile-id-row">
              <dt>Payment Status</dt>
              <dd className="tint">{PAYMENT_STATUS_LABEL[registration.paymentStatus]}</dd>
            </div>
            <div className="profile-id-row">
              <dt>Registration Date</dt>
              <dd>{formattedDate}</dd>
            </div>
            <div className="profile-id-row">
              <dt>Username</dt>
              <dd>{registration.username}</dd>
            </div>
            <div className="profile-id-row">
              <dt>Email</dt>
              <dd>{registration.email}</dd>
            </div>
            <div className="profile-id-row">
              <dt>Events Registered</dt>
              <dd>{registration.events.length}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
