import { CyberBackButton } from '@/components/ui/CyberBackButton'
import { TransportationSection } from '@/components/transportation/TransportationSection'

export function TransportationPage() {
  return (
    <main data-page="transportation" className="relative min-h-screen bg-[#05040a] text-white w-full max-w-full overflow-x-hidden">
      {/* Standalone Back Button (No navbar) */}
      <CyberBackButton />

      {/* Main Transportation Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <TransportationSection />
      </div>
    </main>
  )
}
