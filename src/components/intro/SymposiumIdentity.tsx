import type { CSSProperties } from 'react'
import { symposium } from '@/data/symposium'
import './SymposiumIdentity.css'

interface SymposiumIdentityProps {
  nameStyle: CSSProperties
  taglineStyle: CSSProperties
  infoStyle: CSSProperties
}

/**
 * Symposium identity: the futuristic sub-brand, styled with the city's neon
 * palette (never gold — see CollegeIdentity.tsx for the gold-scoped block).
 * Tagline/supporting info render only when data/symposium.ts actually
 * provides them; nothing here is invented copy. Styles come from
 * IdentityLayer, computed straight from scroll progress.
 */
export function SymposiumIdentity({ nameStyle, taglineStyle, infoStyle }: SymposiumIdentityProps) {
  const supportingInfo = symposium.supportingInfo ?? []

  return (
    <div className="symposium-identity">
      <h1 className="symposium-identity__name" style={nameStyle}>
        {symposium.name} <span className="symposium-identity__edition">{symposium.edition}</span>
      </h1>
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
