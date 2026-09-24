import type { CharacterConfig, RegistrationRecord } from '@/types/characterProfile'

interface CharacterInfoProps {
  character: CharacterConfig
  registration: RegistrationRecord
}

/**
 * Card 1: Personnel Dossier Identification (ID Card)
 * Exact match to user reference image (media_1790184447532.png):
 * - Left: Avatar headshot in cyan double border frame
 * - Center: Metadata table (ID, NAME, AGE, BIRTHDAY, BLOOD TYPE, GENDER) + vertical chromatic ramp
 * - Right: Micro telemetry dots, [ 2 ] badge, cyber winged crest, and quote
 */
export function CharacterInfo({ character, registration }: CharacterInfoProps) {
  const displayName = character?.displayName || character?.name || 'Nico'
  const recordId = character?.recordId || 'NICO-007'
  const age = character?.age || '?? (Early 20s)'
  const birthday = character?.birthday || 'Nov 11'
  const bloodType = character?.bloodType || 'O'
  const gender = character?.gender || 'MALE'
  const quote = character?.quote || '"PEOPLE BREAK SYSTEMS. I FIX BOTH."____'
  const shortImage = character?.shortImage || '/assets/characters/short_nico.jpeg'

  return (
    <section className="profile-panel profile-panel--id-card" aria-label="Personnel Identification">
      {/* Sci-Fi Stitched Cyber Frame (Matches Reference Image) */}
      <div className="profile-panel__cyber-frame" aria-hidden="true" />

      <div className="profile-id-layout">
        {/* Section 1: Inset Headshot Avatar */}
        <div className="profile-id-portrait-box">
          <div className="profile-id-portrait-inner">
            <img
              src={shortImage}
              alt={`${displayName} avatar`}
              className="profile-id-portrait-img"
              draggable={false}
            />
            <div className="profile-id-portrait-scanline" aria-hidden="true" />
          </div>
        </div>

        {/* Section 2: Data Matrix Table & Chromatic Ramp */}
        <div className="profile-id-table-container">
          <div className="profile-id-table">
            <div className="profile-id-row">
              <span className="profile-id-label">ID</span>
              <span className="profile-id-value">{recordId}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">NAME</span>
              <span className="profile-id-value">{displayName}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">AGE</span>
              <span className="profile-id-value">{age}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">BIRTHDAY</span>
              <span className="profile-id-value">{birthday}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">BLOOD TYPE</span>
              <span className="profile-id-value">{bloodType}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">GENDER</span>
              <span className="profile-id-value">{gender}</span>
            </div>
          </div>

          {/* Vertical Chromatic Ramp Bar */}
          <div className="profile-id-color-ramp" aria-hidden="true" title="Spectral Frequency">
            <span className="ramp-step ramp-step-1" />
            <span className="ramp-step ramp-step-2" />
            <span className="ramp-step ramp-step-3" />
            <span className="ramp-step ramp-step-4" />
            <span className="ramp-step ramp-step-5" />
          </div>
        </div>

        {/* Section 3: Telemetry, Cyber Crest & Signature Quote */}
        <div className="profile-id-telemetry-col">
          {/* Micro telemetry blocks */}
          <div className="profile-id-micro-tech" aria-hidden="true">
            <div className="micro-dots">
              <span className="micro-dot" />
              <span className="micro-dot" />
              <span className="micro-dot" />
            </div>
            <div className="micro-box-num">2</div>
            <div className="micro-corner-tick">▰</div>
          </div>

          {/* Cyber Winged Crest Sigil */}
          <div className="profile-id-crest-wrap">
            <img
              src={character?.crestImage || '/assets/characters/cyber-crest.png'}
              alt={`${displayName} Sigil`}
              className="profile-id-crest-img"
              draggable={false}
            />
          </div>

          {/* Quote */}
          <div className="profile-id-quote-wrap">
            <p className="profile-id-quote">
              {quote}
            </p>
          </div>

          {/* Small status metadata stamp */}
          {registration?.registrationId && (
            <div className="profile-id-reg-stamp">
              <span>{registration.registrationId}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
