import { useEffect } from 'react'
import { useIntroSequence } from '@/animation/useIntroSequence'
import { CityScene } from '@/components/city/CityScene'
import { BootOverlay } from './BootOverlay'

/**
 * Top-level orchestrator for the cinematic boot sequence: black screen ->
 * sky -> city -> college identity -> symposium identity -> settled -> user
 * scrolls. Owns the single useIntroSequence timeline and hands the derived
 * flags down to BootOverlay and CityScene (which forwards the relevant
 * pieces to CityLayer/ParticleField/IdentityLayer). Scroll is locked for
 * the duration of the boot sequence so a stray scroll can't desync the
 * sticky city viewport from the boot animation.
 */
export function IntroSequence() {
  const intro = useIntroSequence()

  useEffect(() => {
    document.body.classList.toggle('scroll-locked', !intro.settled)
    return () => {
      document.body.classList.remove('scroll-locked')
    }
  }, [intro.settled])

  return (
    <>
      <BootOverlay active={!intro.skyVisible} reducedMotion={intro.reducedMotion} />
      <CityScene intro={intro} />
    </>
  )
}
