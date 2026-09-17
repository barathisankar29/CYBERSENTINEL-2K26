import { useEffect, useState } from 'react'
import { introTimeline } from './timingConfig'
import { useReducedMotion } from './useReducedMotion'

export interface IntroState {
  skyVisible: boolean
  cityVisible: boolean
  logoVisible: boolean
  nameVisible: boolean
  symposiumVisible: boolean
  infoVisible: boolean
  /** True once the whole boot sequence has finished and scroll should unlock. */
  settled: boolean
  reducedMotion: boolean
}

const RESOLVED_STATE: Omit<IntroState, 'reducedMotion'> = {
  skyVisible: true,
  cityVisible: true,
  logoVisible: true,
  nameVisible: true,
  symposiumVisible: true,
  infoVisible: true,
  settled: true,
}

const INITIAL_STATE: Omit<IntroState, 'reducedMotion'> = {
  skyVisible: false,
  cityVisible: false,
  logoVisible: false,
  nameVisible: false,
  symposiumVisible: false,
  infoVisible: false,
  settled: false,
}

/**
 * Drives the boot/establish sequence (see introTimeline in timingConfig.ts):
 * black screen -> sky -> city -> college identity -> symposium identity ->
 * settled. Consumers read the flags to trigger their own CSS transitions
 * rather than this hook owning any visual behavior directly.
 *
 * Under prefers-reduced-motion, the resolved (fully-settled) state is
 * derived directly at render time — no boot animation, no scroll lock —
 * rather than scheduled, so the effect below only ever does the one thing
 * an effect should: schedule the boot timers against the external clock.
 */
export function useIntroSequence(): IntroState {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState(INITIAL_STATE)

  useEffect(() => {
    if (reducedMotion) return

    const timers = introTimeline.map(({ key, at }) =>
      setTimeout(() => setState((current) => ({ ...current, [key]: true })), at * 1000),
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return { ...RESOLVED_STATE, reducedMotion }
  }

  return { ...state, reducedMotion }
}
