import type { CSSProperties } from 'react'
import { symposium } from '@/data/symposium'
import { CyberSentinelLogo } from './CyberSentinelLogo'
import './SymposiumIdentity.css'

interface SymposiumIdentityProps {
  nameStyle: CSSProperties
  taglineStyle: CSSProperties
  infoStyle: CSSProperties
}

/**
 * Symposium identity: the CyberSentinel logo image (see
 * CyberSentinelLogo.tsx) plus tagline/supporting info, styled with the
 * city's neon palette (never gold — see CollegeIdentity.tsx for the
 * gold-scoped block). Tagline/supporting info render only when
 * data/symposium.ts actually provides them; nothing here is invented copy.
 */
export function SymposiumIdentity({ nameStyle, taglineStyle, infoStyle }: SymposiumIdentityProps) {
  const supportingInfo = symposium.supportingInfo ?? []

  return (
    <div className="symposium-identity">
      <CyberSentinelLogo style={nameStyle} />
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
