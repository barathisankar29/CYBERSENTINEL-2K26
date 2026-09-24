import type { CSSProperties, ReactNode } from 'react'
import type { CharacterTheme } from '@/types/characterProfile'
import './CharacterProfile.css'

interface ThemeProviderProps {
  theme: CharacterTheme
  children: ReactNode
  className?: string
  charId?: string
}

/**
 * Applies one character's theme as CSS custom properties on a wrapper div.
 * Every color in CharacterProfile.css reads from `--char-*` rather than a
 * hardcoded value, so swapping `theme` here re-themes the whole dossier —
 * no character's styling is hardcoded into any component.
 */
export function ThemeProvider({ theme, children, className = '', charId = 'nico' }: ThemeProviderProps) {
  const style = {
    '--char-primary': theme.primary,
    '--char-secondary': theme.secondary,
    '--char-accent': theme.accent,
    '--char-glow': theme.glow,
    '--char-text-tint': theme.textTint,
    '--char-bg-gradient': theme.backgroundGradient,
    '--char-panel-frame': `url('/assets/characters/card-panel-frame-${charId}.png')`,
  } as CSSProperties

  return (
    <div className={`profile-root ${className}`} style={style}>
      {children}
    </div>
  )
}
