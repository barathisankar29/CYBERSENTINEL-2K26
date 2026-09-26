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
 * two — reorder the ids here to change who appears where.
 */
const GROUPS: { id: string; tone: ContactGroup['tone']; memberIds: string[] }[] = [
  { id: 'leadership', tone: 'pink', memberIds: ['hirikaran-m', 'bhagya-b'] },
  { id: 'coordination', tone: 'cyan', memberIds: ['dharsani-g', 'abishek-d'] },
  { id: 'operations', tone: 'violet', memberIds: ['sharath-a-r-coord', 'prathish-m'] },
]

export const contactGroups: ContactGroup[] = GROUPS.map((group) => ({
  id: group.id,
  tone: group.tone,
  contacts: group.memberIds.flatMap((memberId) => {
    const member = studentCoordinatorsData.find((entry) => entry.id === memberId)
    if (!member?.phone) return []
    return [{ id: member.id, name: member.name, title: member.role, phone: member.phone }]
  }),
}))

/** `tel:` URI for a display-formatted number ("+91 82709 53504" -> "tel:+918270953504"). */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
