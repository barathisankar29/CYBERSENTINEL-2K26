/**
 * College identity content. This is the ONLY part of the site where the
 * gold accent (from the college's black + gold logo) is permitted — see
 * src/styles/tokens.css for the enforced color scoping.
 */
export interface CollegeIdentity {
  name: string
  shortName?: string
  logoPath: string
  details?: string[]
}

export interface SymposiumIdentity {
  name: string
  edition: string
  logoPath?: string
  /** e.g. "Department of Computer Science and Engineering" — rendered above the symposium name. */
  department?: string
  /** e.g. "In Association with Hackathon Club" — rendered below `department`, above "Presents". */
  presentedBy?: string
  tagline?: string
  supportingInfo?: string[]
}
