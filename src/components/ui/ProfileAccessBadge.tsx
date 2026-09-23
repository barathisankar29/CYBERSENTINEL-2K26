import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRegistration } from '@/utils/eventRegistration'
import { characterProfiles } from '@/data/characterProfiles'
import './ProfileAccessBadge.css'

/**
 * "Grand" identity-access HUD terminal — lives inside the navigation-city
 * composition itself (see NavigationCityScene.tsx / NavigationCityMobile.tsx),
 * so it only ever appears on the buildings page, never site-wide. Before a
 * character is assigned it shows an unresolved, all-four-colors mythic
 * shimmer (nobody knows their identity yet); after registration it locks
 * to that character's own color and name — both states are derived from
 * the actual stored registration, never hardcoded.
 */
export function ProfileAccessBadge() {
  const navigate = useNavigate()
  const [characterName, setCharacterName] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [glow, setGlow] = useState<string | null>(null)

  useEffect(() => {
    const registration = getRegistration()
    if (registration) {
      const character = characterProfiles[registration.characterId]
      if (character) {
        setCharacterName(character.name)
        setColor(character.theme.primary)
        setGlow(character.theme.glow)
      }
    }
  }, [])

  const isAssigned = Boolean(characterName)
  const style = isAssigned
    ? ({ '--identity-color': color, '--identity-glow': glow } as CSSProperties)
    : undefined

  return (
    <button
      type="button"
      className={`identity-terminal ${isAssigned ? 'identity-terminal--assigned' : 'identity-terminal--unassigned'}`}
      style={style}
      onClick={() => navigate('/profile')}
      title={isAssigned ? `Open ${characterName} dossier` : 'No active identity record'}
    >
      <span className="identity-terminal__glyph" aria-hidden="true">
        {isAssigned ? characterName!.charAt(0) : '?'}
      </span>
      <span className="identity-terminal__text">
        <span className="identity-terminal__label">{isAssigned ? 'IDENTITY' : 'NO RECORD'}</span>
        <span className="identity-terminal__value">{isAssigned ? characterName : 'NOT ASSIGNED'}</span>
      </span>
    </button>
  )
}
