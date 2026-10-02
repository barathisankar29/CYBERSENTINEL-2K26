export type CharacterId = 'nico' | 'ruelle' | 'dacre' | 'cosma'

export interface CharacterTheme {
  /** Primary neon accent — borders, headings, progress fill. */
  primary: string
  /** Secondary accent — used alongside primary for gradients/dual-tone HUD lines. */
  secondary: string
  /** Tertiary accent for small highlights (chips, links within body text). */
  accent: string
  /** Soft glow color used in box-shadows around panels/portrait. */
  glow: string
  /** Muted tinted body-text color (this character's "lavender text" equivalent). */
  textTint: string
  /** Background atmosphere gradient behind the whole dossier. */
  backgroundGradient: string
}

/** One purchasable registration option tied to a character. Dr. Dacre has two
 * independent single-event options rather than one bundled pack — everything
 * else here is a single multi-event pack. */
export interface RegistrationPack {
  id: string
  /** e.g. "DAY 1 PACK", "GROUP DANCE" */
  label: string
  price: number
  /** Real event names included — sourced from the site's actual event list,
   * never invented. */
  events: string[]
}

export interface CharacterConfig {
  id: CharacterId
  /** Display name, e.g. "NICO", "Dr. DACRE". */
  name: string
  /** Dossier-style record code, e.g. "NICO-007". */
  recordId: string
  /** Full-body portrait art — served from public/assets/characters/. */
  image: string
  /** Cropped headshot/bust — served from public/assets/characters/, used
   * in the compact ID panel portrait box (short_*.jpeg). */
  shortImage: string
  theme: CharacterTheme
  /** Quote shown near the ID panel. */
  quote: string
  /** Short vertical HUD lines rendered beside the portrait (2-3 short lines). */
  sideLines: string[]
  /** "Intent of application" flavor text — rewritten around the real pack,
   * not the reference's fictional character lore. */
  /** Display name in mixed case for ID table, e.g. "Nico" */
  displayName?: string
  age?: string
  birthday?: string
  bloodType?: string
  gender?: string
  unlockRequirement?: string
  eventsUnlockRequirement?: string
  intentLoreHtml?: string
  eventsLoreHtml?: string
  intent?:string
  cityImage?: string
  terminalImage?: string
  crestImage?: string
  middleTagline?: string
  bottomTagline?: string
  footerLeft?: string
  footerRight?: string
  cityBadgeText?: string
  terminalBadgeText?: string
  packs: RegistrationPack[]
}

/**
 * - 'test_mode_unverified': legacy local-only mock record (no backend).
 * - 'under_review': submitted to the Supabase backend (public-register);
 *   payment awaits admin verification. The backend's check-registration
 *   is the only source for whether it has since been VERIFIED.
 */
export type PaymentStatus = 'test_mode_unverified' | 'under_review'

export interface RegistrationRecord {
  registrationId: string
  characterId: CharacterId
  packId: string
  events: string[]
  username: string
  email: string
  registeredAt: string
  /** Never claims a payment succeeded — see PaymentStatus. */
  paymentStatus: PaymentStatus
  qrUrl?: string | null
  isVerified?: boolean
  selectedDay?: string
  college?: string
  department?: string
}
