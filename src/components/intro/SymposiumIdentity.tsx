import type { CSSProperties } from 'react'
import { symposium } from '@/data/symposium'
import { CyberSentinelWordmark } from './CyberSentinelWordmark'
import './SymposiumIdentity.css'

interface SymposiumIdentityProps {
  nameStyle: CSSProperties
  /** The wordmark's own reveal fraction 0-1 — see CyberSentinelWordmark.tsx. */
  nameT: number
  /** Master scroll progress 0-1, for the wordmark's glitch offset. */
  progress: number
  taglineStyle: CSSProperties
  infoStyle: CSSProperties
}

/**
 * Symposium identity: the CYBERSENTINEL wordmark (see
 * CyberSentinelWordmark.tsx) plus tagline/supporting info, styled with the
 * city's neon palette (never gold — see CollegeIdentity.tsx for the
 * gold-scoped block). Tagline/supporting info render only when
 * data/symposium.ts actually provides them; nothing here is invented copy.
 */
export function SymposiumIdentity({ nameStyle, nameT, progress, taglineStyle, infoStyle }: SymposiumIdentityProps) {
  const supportingInfo = symposium.supportingInfo ?? []

  return (
    <div className="symposium-identity">
      <CyberSentinelWordmark edition={symposium.edition} t={nameT} progress={progress} style={nameStyle} />
      {symposium.tagline && (
        <p className="symposium-identity__tagline" style={taglineStyle}>
          {symposium.tagline}
        </p>
      )}
      {supportingInfo.length > 0 && (
        <ul className="symposium-identity__info" style={infoStyle}>
          {supportingInfo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
