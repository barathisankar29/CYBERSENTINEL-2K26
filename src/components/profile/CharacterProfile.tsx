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

/** The unlocked dossier view — shown after a mock registration completes.
 * Every color comes from `character.theme` via ThemeProvider; nothing here
 * is hardcoded to any one character. */
export function CharacterProfile({ character, registration }: CharacterProfileProps) {
  return (
    <ThemeProvider theme={character.theme}>
      <ProfileHeader progress={100} label="UNLOCKED" />

      <div className="profile-dossier">
        <CharacterPortrait character={character} />
        <CharacterInfo character={character} registration={registration} />

        <IntentPanel title="INTENT OF APPLICATION" hint="PROJECT ACCESS" areaClass="profile-panel--intent">
          <p className="profile-panel__body">{character.intent}</p>
        </IntentPanel>

        <RegisteredEvents events={registration.events} />
      </div>

      <footer className="profile-footer">
        <span>CYBERSENTINEL CITY // EVENTS REGISTRY</span>
        <span>A SAFER CITY. A MORE HONEST TOMORROW.</span>
      </footer>
    </ThemeProvider>
  )
}
