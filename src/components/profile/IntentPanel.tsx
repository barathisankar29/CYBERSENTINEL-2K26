import type { ReactNode } from 'react'

interface IntentPanelProps {
  title: string
  hint?: string
  areaClass: 'profile-panel--intent' | 'profile-panel--events'
  children: ReactNode
}

/** Generic dossier panel shell — used for both "Intent of Application" and
 * "Registered Events" (same HUD framing, different body content). */
export function IntentPanel({ title, hint, areaClass, children }: IntentPanelProps) {
  return (
    <section className={`profile-panel ${areaClass}`}>
      <span className="profile-corner profile-corner--tl" aria-hidden="true" />
      <span className="profile-corner profile-corner--tr" aria-hidden="true" />
      <span className="profile-corner profile-corner--bl" aria-hidden="true" />
      <span className="profile-corner profile-corner--br" aria-hidden="true" />

      <div className="profile-panel__header">
        <span className="profile-panel__title">[ {title} ]</span>
        {hint && <span className="profile-panel__hint">{hint}</span>}
      </div>

      {children}
    </section>
  )
}
