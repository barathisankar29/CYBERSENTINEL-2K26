import type { CSSProperties } from 'react'
import type { CharacterConfig, RegistrationPack } from '@/types/characterProfile'
import './CharacterSelection.css'

interface CharacterCardProps {
  character: CharacterConfig
  onSelectPack: (character: CharacterConfig, pack: RegistrationPack) => void
}

export function CharacterCard({ character, onSelectPack }: CharacterCardProps) {
  const style = {
    '--char-primary': character.theme.primary,
    '--char-secondary': character.theme.secondary,
    '--char-glow': character.theme.glow,
    '--char-text-tint': character.theme.textTint,
    '--char-bg-gradient': character.theme.backgroundGradient,
  } as CSSProperties

  return (
    <article className="character-card" style={style}>
      <div className="character-card__portrait">
        <img src={character.image} alt={character.name} draggable={false} />
      </div>
      <h3 className="character-card__name">{character.name}</h3>
      <p className="character-card__quote">{character.quote}</p>

      <div className="character-card__packs">
        {character.packs.map((pack) => (
          <div key={pack.id} className="character-card__pack">
            <div className="character-card__pack-label">
              <span className="character-card__pack-name">{pack.label}</span>
              <span className="character-card__pack-price">₹{pack.price}</span>
            </div>
            <button
              type="button"
              className="character-card__select-btn"
              onClick={() => onSelectPack(character, pack)}
            >
              SELECT
            </button>
          </div>
        ))}
      </div>
    </article>
  )
}
