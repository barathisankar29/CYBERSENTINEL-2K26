import type { CSSProperties } from 'react'
import { college } from '@/data/college'
import './CollegeIdentity.css'

function monogramOf(text: string): string {
  return text
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

interface CollegeIdentityProps {
  logoStyle: CSSProperties
  nameStyle: CSSProperties
}

/**
 * College identity: the ONLY place gold is allowed to appear (see the
 * color-scoping rule in src/styles/tokens.css). Renders the real college
 * name already populated in src/data/college.ts. The mark below is a
 * placeholder monogram — swap it for the real logo once an image lands at
 * `college.logoPath` (currently unpopulated, see the TODO in that file).
 * `logoStyle`/`nameStyle` come from IdentityLayer, computed straight from
 * scroll progress — no animation state lives in this component.
 */
export function CollegeIdentity({ logoStyle, nameStyle }: CollegeIdentityProps) {
  return (
    <div className="college-identity">
      <div className="college-identity__mark" style={logoStyle}>
        <span>{monogramOf(college.shortName ?? college.name)}</span>
      </div>
      <p className="college-identity__name" style={nameStyle}>
        {college.shortName ?? college.name}
      </p>
    </div>
  )
}
