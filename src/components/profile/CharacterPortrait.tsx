import type { CharacterConfig } from '@/types/characterProfile'

interface CharacterPortraitProps {
  character: CharacterConfig
}

export function CharacterPortrait({ character }: CharacterPortraitProps) {
  return (
    <div className="profile-portrait">
      <span className="profile-corner profile-corner--tl" aria-hidden="true" />
      <span className="profile-corner profile-corner--tr" aria-hidden="true" />
      <span className="profile-corner profile-corner--bl" aria-hidden="true" />
      <span className="profile-corner profile-corner--br" aria-hidden="true" />

      <div className="profile-portrait__sidebar">
        <span className="profile-portrait__name">{character.name}</span>
        <span className="profile-portrait__lines">
          {character.sideLines.map((line) => (
            <span key={line} style={{ display: 'block' }}>{line}</span>
          ))}
        </span>
      </div>

      <div className="profile-portrait__image-wrap">
        <img
          src={character.image}
          alt={character.name}
          className="profile-portrait__image"
          draggable={false}
        />
      </div>
    </div>
  )
}
