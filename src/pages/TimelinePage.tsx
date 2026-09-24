import { CyberBackButton } from '@/components/ui/CyberBackButton'
import { TimelineJourney } from '@/components/timeline/TimelineJourney'

export function TimelinePage() {
  return (
    <main data-page="timeline" className="relative min-h-screen bg-[#05040a] text-white w-full max-w-full overflow-x-hidden">
      {/* Standalone Back Button (No navbar) */}
      <CyberBackButton />

      <TimelineJourney />
    </main>
  )
}
