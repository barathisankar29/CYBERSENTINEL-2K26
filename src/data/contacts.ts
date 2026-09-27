import { studentCoordinatorsData } from '@/data/credentials'

export interface ContactEntry {
  id: string
  name: string
  title: string
  /** Display format, e.g. "+91 8270953504" */
  phone: string
}

export interface ContactGroup {
  id: string
  tone: 'pink' | 'cyan' | 'violet'
  contacts: ContactEntry[]
}

/**
 * Contact directory for the /contact payphone terminal. People and numbers
 * come from the Student Coordinators in credentials.ts, so a phone number
 * is only ever edited in one place. The design shows three color groups of
 * two, filled in the coordinators' list order (1-2, 3-4, 5-6) — reorder
 * `studentCoordinatorsData` to change who appears where.
 */
const GROUPS: { id: string; tone: ContactGroup['tone'] }[] = [
  { id: 'leadership', tone: 'pink' },
  { id: 'coordination', tone: 'cyan' },
  { id: 'operations', tone: 'violet' },
]

export const contactGroups: ContactGroup[] = GROUPS.map((group, index) => ({
  id: group.id,
  tone: group.tone,
  contacts: studentCoordinatorsData.slice(index * 2, index * 2 + 2).flatMap((member) => {
    if (!member.phone) return []
    return [{ id: member.id, name: member.name, title: member.role, phone: member.phone }]
  }),
}))

/** `tel:` URI for a display-formatted number ("+91 82709 53504" -> "tel:+918270953504"). */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
