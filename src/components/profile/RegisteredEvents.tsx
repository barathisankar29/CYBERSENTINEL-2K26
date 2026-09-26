import type { CharacterConfig, RegistrationRecord } from '@/types/characterProfile'

interface RegisteredEventsProps {
  character: CharacterConfig
  registration: RegistrationRecord
}

/**
 * Card 3: [ REGISTERED EVENTS ]
 * Exact match to user reference image (Card 3 in media_1790184447502.jpg):
 * - Top-left: [ REGISTERED EVENTS ]
 * - Top-right: TO UNLOCK: Deeper Records + 7 slanted hatch bars
 * - Left column: Security evaluation report with highlighted amber text + registered event badges
 * - Right column: Dual-monitor hacker workstation viewport + "DIFFERENT PEOPLE. SAME CITY. DIFFERENT REALITIES." badge
 */
export function RegisteredEvents({ character, registration }: RegisteredEventsProps) {
  const unlockReq = character?.eventsUnlockRequirement || 'Deeper Records'
  const loreHtml = character?.eventsLoreHtml || (
    'Multiple discrepancies found between submitted documents and external records. Suspected ties to unregistered networks. Capable of operating across jurisdictions without leaving identifiable traces. <span class="char-hl-amber">Level of cooperation: Uncertain.</span> <span class="char-hl-amber">Handle with discretion.</span>'
  )
  const terminalImg = character?.terminalImage || '/assets/characters/dossier-terminal.png'
  const events = registration?.events || []

  return (
    <section className="profile-panel profile-panel--events" aria-label="Registered Events Dossier">
      {/* Sci-Fi Stitched Cyber Frame (Matches Reference Image) */}
      <div className="profile-panel__cyber-frame" aria-hidden="true" />

      {/* Top Header Bar */}
      <div className="profile-panel__header">
        <div className="profile-panel__title-box">
          <span className="profile-panel__title">[ REGISTERED EVENTS ]</span>
        </div>

        <div className="profile-panel__unlock-cluster">
          <div className="profile-panel__unlock-text">
            <span className="profile-panel__unlock-label">TO UNLOCK:</span>
            <span className="profile-panel__unlock-value">{unlockReq}</span>
          </div>

          {/* 7 Slanted Hatch Bars */}
          <div className="profile-panel__hatch-bars" aria-hidden="true">
            {[...Array(7)].map((_, i) => (
              <span key={i} className="hatch-bar" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="profile-panel__split-grid">
        {/* Left Column: Security evaluation log + registered events chips */}
        <div className="profile-panel__text-col">
          <p
            className="profile-panel__narrative"
            dangerouslySetInnerHTML={{ __html: loreHtml }}
          />

          {/* Registered event badges */}
          {events.length > 0 && (
            <div className="profile-events-chip-row">
              <span className="profile-events-chip-label">ACTIVE ACCESS:</span>
              <div className="profile-events-chips">
                {events.map((evt) => (
                  <span key={evt} className="profile-event-tag">
                    {evt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Terminal Workstation Surveillance Window */}
        <div className="profile-panel__viewport-col">
          <div className="profile-viewport-frame">
            <img
              src={terminalImg}
              alt="Hacker Terminal Surveillance"
              loading="lazy"
              decoding="async"
              className="profile-viewport-img"
              draggable={false}
            />
            {/* Viewport scanlines overlay */}
            <div className="profile-viewport-scanline" aria-hidden="true" />

            {/* Bottom-right HUD badge */}
            <div className="profile-viewport-badge">
              <span className="profile-viewport-badge-text">
                {character?.terminalBadgeText ? (
                  character.terminalBadgeText.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < character.terminalBadgeText!.split('\n').length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>DIFFERENT PEOPLE.<br />SAME CITY.<br />DIFFERENT REALITIES.</>
                )}
              </span>
              <div className="profile-viewport-equalizer" aria-hidden="true">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
