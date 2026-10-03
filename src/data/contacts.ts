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
 * is only ever edited in one place. Coordinators are grouped by office
 * (the part of their role before "//"), each group listing its offices in
 * order: President & Vice President / Secretary & Joint Secretary /
 * Treasurer. Within an office, people keep their credentials.ts order.
 */
const GROUPS: { id: string; tone: ContactGroup['tone']; offices: string[] }[] = [
  { id: 'leadership', tone: 'pink', offices: ['President', 'Vice President'] },
  { id: 'secretariat', tone: 'cyan', offices: ['Secretary', 'Joint Secretary'] },
  { id: 'treasury', tone: 'violet', offices: ['Treasurer'] },
]

const officeOf = (role: string) => role.split('//')[0].trim().toLowerCase()

export const contactGroups: ContactGroup[] = GROUPS.map((group) => ({
  id: group.id,
  tone: group.tone,
  contacts: group.offices.flatMap((office) =>
    studentCoordinatorsData.flatMap((member) => {
      if (!member.phone || officeOf(member.role) !== office.toLowerCase()) return []
      return [{ id: member.id, name: member.name, title: member.role, phone: member.phone }]
    })
  ),
}))

/** `tel:` URI for a display-formatted number ("+91 82709 53504" -> "tel:+918270953504"). */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
