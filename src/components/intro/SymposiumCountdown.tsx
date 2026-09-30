import { useEffect, useState } from 'react'
import { SYMPOSIUM_SCHEDULE } from '@/config/symposiumSchedule'
import './SymposiumCountdown.css'

const START = new Date(SYMPOSIUM_SCHEDULE.startsAt).getTime()
const END = new Date(SYMPOSIUM_SCHEDULE.endsAt).getTime()

const UNITS = [
  { label: 'DAYS', ms: 86_400_000 },
  { label: 'HRS', ms: 3_600_000 },
  { label: 'MIN', ms: 60_000 },
  { label: 'SEC', ms: 1_000 },
] as const

function split(ms: number): number[] {
  let rest = Math.max(ms, 0)
  return UNITS.map(({ ms: unit }) => {
    const value = Math.floor(rest / unit)
    rest -= value * unit
    return value
  })
}

/**
 * Cyber-HUD countdown terminal to CyberSentinel 2K26 (hero, under Register Now).
 * High-contrast dark armored chassis for crisp visibility over the 3D city scene.
 * Ticks once a second in its own state, so only this card re-renders —
 * never the scroll-driven hero around it. During the two days it switches
 * to "happening now"; after the symposium it removes itself.
 */
export function SymposiumCountdown() {
  const [now, setNow] = useState(() => Date.now())
  const ended = now >= END

  useEffect(() => {
    if (ended) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [ended])

  if (ended) return null
  const live = now >= START
  const parts = split(START - now)

  return (
    <section className="symposium-countdown" aria-label="Countdown to CyberSentinel 2K26">
      {/* Corner HUD Reticles */}
      <span className="symposium-countdown__corner symposium-countdown__corner--tl" aria-hidden="true" />
      <span className="symposium-countdown__corner symposium-countdown__corner--tr" aria-hidden="true" />
      <span className="symposium-countdown__corner symposium-countdown__corner--bl" aria-hidden="true" />
      <span className="symposium-countdown__corner symposium-countdown__corner--br" aria-hidden="true" />

      {/* Top Header Bar */}
      <div className="symposium-countdown__header">
        <span className="symposium-countdown__pulse" aria-hidden="true" />
        <span className="symposium-countdown__eyebrow">
          {live ? 'CYBERSENTINEL 2K26 IS LIVE' : 'T-MINUS // EVENT LAUNCH'}
        </span>
      </div>

      {live ? (
        <p className="symposium-countdown__live">THE JOURNEY HAS BEGUN</p>
      ) : (
        <div className="symposium-countdown__units" role="timer" aria-live="off">
          {UNITS.map(({ label }, i) => (
            <div key={label} className="symposium-countdown__unit">
              <span className="symposium-countdown__value">{String(parts[i]).padStart(2, '0')}</span>
              <span className="symposium-countdown__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Schedule Badge */}
      <div className="symposium-countdown__footer">
        <span className="symposium-countdown__dates">{SYMPOSIUM_SCHEDULE.datesLabel}</span>
      </div>
    </section>
  )
}
