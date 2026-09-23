import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CharacterConfig, RegistrationPack } from '@/types/characterProfile'
import { completeMockRegistration } from '@/utils/eventRegistration'
import { getCharacterForPack } from '@/utils/characterAssignment'
import { EventsDiscovery } from '@/components/profile/EventsDiscovery'
import { MockPaymentGate } from '@/components/profile/MockPaymentGate'
import { RegistrationRevealTransition } from '@/components/profile/RegistrationRevealTransition'

type FlowState =
  | { stage: 'discovery' }
  | { stage: 'paying'; character: CharacterConfig; pack: RegistrationPack }
  | { stage: 'revealing'; character: CharacterConfig }

/**
 * CyberSentinel 2K26's /events experience. The FIRST thing a visitor sees
 * is the normal event listing (EventsDiscovery) — Day 1, Day 2, special
 * events, and packages, with no character branding anywhere. Only after a
 * pack is selected and the mock payment completes does the system resolve
 * which character that pack maps to (see utils/characterAssignment.ts),
 * play the reveal transition, and hand off to /profile — the dossier
 * itself is never shown here.
 */
export function EventsProfilePage() {
  const navigate = useNavigate()
  const [flow, setFlow] = useState<FlowState>({ stage: 'discovery' })

  const handleSelectPack = useCallback((packId: string) => {
    const resolved = getCharacterForPack(packId)
    if (!resolved) return
    setFlow({ stage: 'paying', character: resolved.character, pack: resolved.pack })
  }, [])

  const handleCancelPayment = useCallback(() => {
    setFlow({ stage: 'discovery' })
  }, [])

  const handlePaymentComplete = useCallback(
    (character: CharacterConfig, pack: RegistrationPack, username: string, email: string) => {
      completeMockRegistration(character.id, pack, username, email)
      setFlow({ stage: 'revealing', character })
    },
    []
  )

  const handleRevealComplete = useCallback(() => {
    navigate('/profile')
  }, [navigate])

  if (flow.stage === 'paying') {
    return (
      <MockPaymentGate
        packLabel={flow.pack.label}
        price={flow.pack.price}
        onCancel={handleCancelPayment}
        onComplete={(username, email) => handlePaymentComplete(flow.character, flow.pack, username, email)}
      />
    )
  }

  if (flow.stage === 'revealing') {
    return <RegistrationRevealTransition character={flow.character} onComplete={handleRevealComplete} />
  }

  return <EventsDiscovery onSelectPack={handleSelectPack} />
}
