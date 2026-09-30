import type { CredentialMember } from '@/data/credentials'
import { CoverflowCarousel } from './CoverflowCarousel'
import { StudentCircuitCard } from './StudentCircuitCard'

interface StudentInfiniteCarouselProps {
  items: CredentialMember[]
}

/** Student coordinators: the shared cover-flow carousel with circuit cards. */
export function StudentInfiniteCarousel({ items }: StudentInfiniteCarouselProps) {
  return (
    <CoverflowCarousel
      items={items}
      getKey={(member) => member.id}
      getLabel={(member) => member.name}
      renderItem={(member, { isActive, index }) => (
        <StudentCircuitCard member={member} isActive={isActive} index={index} />
      )}
      labels={{
        prev: 'Previous Student Coordinator',
        next: 'Next Student Coordinator',
        dots: 'Student coordinators navigation',
        dot: (name) => `Go to coordinator ${name}`,
      }}
    />
  )
}
