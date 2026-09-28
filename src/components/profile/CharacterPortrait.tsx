import type { CharacterConfig } from '@/types/characterProfile'

interface CharacterPortraitProps {
  character: CharacterConfig
}

/**
 * Left column: Full-height character portrait vertically centered with glowing
 * vertical name bar, sidelines telemetry, and public security bureau insignia.
 * Matches the reference image layout.
 */
export function CharacterPortrait({ character }: CharacterPortraitProps) {
  const id = character?.id || 'nico'
  const name = character?.name || 'NICO'
  const sideLines = character?.sideLines || ['SYSTEMS', 'PEOPLE', 'PATTERNS', 'SAME THING.']
  const image = character?.image || '/assets/characters/Nico.webp'

  const bottomTag = character?.bottomTagline
  const crestImg = character?.crestImage || '/assets/characters/cyber-crest.webp'
  const bureauTag = character?.footerLeft || 'CYBERSENTINEL CITY // PUBLIC SECURITY BUREAU'

  return (
    <aside className={`profile-portrait profile-portrait--${id}`} aria-label={`${name} operative portrait`}>
      {/* Sci-Fi Cyber HUD Frame from reference design */}
      <img
        src={`/assets/characters/card-frame-${id}.webp`}
        alt=""
        className="profile-portrait__hud-frame"
        aria-hidden="true"
      />

      {/* Cyber City & Holo Scanlines Ambient Background */}
      <div className="profile-portrait__backdrop" aria-hidden="true">
        <div className="profile-portrait__holo-grid" />
        <div className="profile-portrait__scanlines" />
        <div className="profile-portrait__vertical-beams" />
      </div>

      {/* Main Character Showcase: Big, full-height, grounded */}
      <div className="profile-portrait__stage">
        <div className="profile-portrait__img-container">
          {/* Standing Holographic Round Floor Glow Pedestal (Contained cleanly within card) */}
          <div className="profile-portrait__ground-glow" aria-hidden="true">
            <span className="ground-glow-ambient" />
            <span className="ground-glow-outer-disc" />
            <span className="ground-glow-ring" />
            <span className="ground-glow-core" />
          </div>

          <img
            src={image}
            alt={name}
            className="profile-portrait__image"
            draggable={false}
          />

          {/* Foreground Holographic Arc (Reflects across boots soles for 3D grounding) */}
          <div className="profile-portrait__ground-glow-front" aria-hidden="true" />
        </div>
      </div>

      {/* Left HUD Telemetry Overlay (Matches Image 3) */}
      <div className="profile-portrait__hud-overlay">
        <div className="profile-portrait__name-bracket">
          <span className="profile-portrait__name-prefix">:::</span>
          <span className="profile-portrait__name">{name}</span>
        </div>

        <div className="profile-portrait__sidelines-box">
          <span className="profile-portrait__sidelines">
            {sideLines.join(' ')}
          </span>
        </div>

        {bottomTag && (
          <div className="profile-portrait__bottom-tag">
            <span>{bottomTag}</span>
          </div>
        )}
      </div>

      {/* Bottom security bureau footer badge */}
      <div className="profile-portrait__badge">
        <img
          src={crestImg}
          alt="Bureau emblem"
          className="profile-portrait__badge-icon"
          aria-hidden="true"
        />
        <span className="profile-portrait__badge-text">
          {bureauTag}
        </span>
      </div>
    </aside>
  )
}
