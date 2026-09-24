import type { CharacterConfig, RegistrationRecord } from '@/types/characterProfile'
import { ThemeProvider } from './ThemeProvider'
import { ProfileHeader } from './ProfileHeader'
import { CharacterPortrait } from './CharacterPortrait'
import { CharacterInfo } from './CharacterInfo'
import { IntentPanel } from './IntentPanel'
import { RegisteredEvents } from './RegisteredEvents'

interface CharacterProfileProps {
  character: CharacterConfig
  registration: RegistrationRecord
}

/**
 * Full-screen cyberpunk dossier — exact match to reference images.
 *
 * Structure:
 *   [TOP HEADER]      ← BACK   UNLOCKED ══════════════ RECORDS 100%
 *   [MAIN DOSSIER]    [LEFT: Big Vertically Centered Portrait + Vertical Name Bar]
 *                     [RIGHT: Stacked Cards]
 *                       - Card 1: ID Bio Card + Color Ramp + Crest + Quote
 *                       - Card 2: [ INTENT OF APPLICATION ] + 7 Hatch Bars + City Window
 *                       - Card 3: [ REGISTERED EVENTS ] + 7 Hatch Bars + Terminal Window
 *   [FOOTER]          CYBERSENTINEL CITY // PUBLIC SECURITY BUREAU
 */
export function CharacterProfile({ character, registration }: CharacterProfileProps) {
  return (
    <ThemeProvider theme={character.theme} charId={character.id}>
      <div className="profile-frame">
        {/* ── Top header bar ── */}
        <ProfileHeader progress={100} label="RECORDS" />

        {/* ── Main dossier body ── */}
        <div className="profile-dossier">
          {/* LEFT: Full-body art (big, vertically centered) with vertical name bar */}
          <CharacterPortrait character={character} />

          {/* RIGHT: Stacked 3 cyber cards */}
          <div className="profile-right-col">
            {/* Card 1: Personnel Dossier Identification */}
            <CharacterInfo character={character} registration={registration} />

            {/* Card 2: Intent of Application */}
            <IntentPanel character={character} />

            {/* Card 3: Registered Events / Security Evaluation */}
            <RegisteredEvents character={character} registration={registration} />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="profile-footer">
          <div className="profile-footer__left">
            <img
              src={character?.crestImage || '/assets/characters/cyber-crest.png'}
              alt="Bureau Crest"
              className="profile-footer__crest"
              aria-hidden="true"
            />
            <span>{character?.footerLeft || 'CYBERSENTINEL CITY // PUBLIC SECURITY BUREAU'}</span>
          </div>
          <div className="profile-footer__right">
            <span>{character?.footerRight || 'A SAFER CITY. A MORE HONEST TOMORROW.'}</span>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
