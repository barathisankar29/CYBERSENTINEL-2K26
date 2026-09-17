import { symposium } from '@/data/symposium'
import './SymposiumIdentity.css'

interface SymposiumIdentityProps {
  symposiumVisible: boolean
  infoVisible: boolean
}

/**
 * Symposium identity: the futuristic sub-brand, styled with the city's neon
 * palette (never gold — see CollegeIdentity.tsx for the gold-scoped block).
 * Tagline/supporting info render only when data/symposium.ts actually
 * provides them; nothing here is invented copy.
 */
export function SymposiumIdentity({ symposiumVisible, infoVisible }: SymposiumIdentityProps) {
  const supportingInfo = symposium.supportingInfo ?? []

  return (
    <div className="symposium-identity">
      <h1 className={`symposium-identity__name identity-fade-up ${symposiumVisible ? 'is-visible' : ''}`}>
        {symposium.name} <span className="symposium-identity__edition">{symposium.edition}</span>
      </h1>
      {symposium.tagline && (
        <p className={`symposium-identity__tagline identity-fade-up ${symposiumVisible ? 'is-visible' : ''}`}>
          {symposium.tagline}
        </p>
      )}
      {supportingInfo.length > 0 && (
        <ul className={`symposium-identity__info identity-fade-up ${infoVisible ? 'is-visible' : ''}`}>
          {supportingInfo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
