import type { CharacterConfig } from '@/types/characterProfile'

interface IntentPanelProps {
  character: CharacterConfig
}

/**
 * Card 2: [ INTENT OF APPLICATION ]
 * Exact match to user reference image (media_1790184447537.png):
 * - Top-left: [ INTENT OF APPLICATION ]
 * - Top-right: TO UNLOCK: Project Access + 7 slanted hatch bars
 * - Left column: Lore narrative with glowing cyan highlighted keywords
 * - Right column: Cyber city surveillance viewport + "SAME CITY. DIFFERENT LOGIC." badge with 6 stacked bars
 */
export function IntentPanel({ character }: IntentPanelProps) {
  const unlockReq = character?.unlockRequirement || 'Project Access'
  const loreHtml = character?.intentLoreHtml || (
    'Intent of application is <span class="char-hl">unknown</span>. Will remain under careful observation, but was recruited due to exceptional <span class="char-hl">analytical ability</span>, <span class="char-hl">systems manipulation</span>, and information retrieval skills. His true objectives remain <span class="char-hl">unverified</span>. Continued monitoring is <span class="char-hl">recommended</span>.'
  )
  const cityImg = character?.cityImage || '/assets/characters/dossier-city.png'

  return (
    <section className="profile-panel profile-panel--intent" aria-label="Intent of Application">
      {/* Sci-Fi Stitched Cyber Frame (Matches Reference Image) */}
      <div className="profile-panel__cyber-frame" aria-hidden="true" />

      {/* Top Header Bar */}
      <div className="profile-panel__header">
        <div className="profile-panel__title-box">
          <span className="profile-panel__title">[ INTENT OF APPLICATION ]</span>
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
        {/* Left Column: Lore narrative with illuminated keywords */}
        <div className="profile-panel__text-col">
          <p
            className="profile-panel__narrative"
            dangerouslySetInnerHTML={{ __html: loreHtml }}
          />
        </div>

        {/* Right Column: Nocturnal City Skyline Surveillance Window */}
        <div className="profile-panel__viewport-col">
          <div className="profile-viewport-frame">
            <img
              src={cityImg}
              alt="Sector City Surveillance"
              className="profile-viewport-img"
              draggable={false}
            />
            {/* Viewport scanlines overlay */}
            <div className="profile-viewport-scanline" aria-hidden="true" />

            {/* Bottom-right HUD badge */}
            <div className="profile-viewport-badge">
              <span className="profile-viewport-badge-text">
                {character?.cityBadgeText ? (
                  character.cityBadgeText.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < character.cityBadgeText!.split('\n').length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>SAME CITY.<br />DIFFERENT LOGIC.</>
                )}
              </span>
              <div className="profile-viewport-equalizer" aria-hidden="true">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
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
