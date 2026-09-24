import { CyberBackButton } from '@/components/ui/CyberBackButton'
import { AboutSection } from '@/components/about/AboutSection'

export function AboutPage() {
  return (
    <main data-page="about" className="relative min-h-screen bg-[#05040a] text-white overflow-x-hidden w-full max-w-full">
      {/* Standalone Back Button (No navbar) */}
      <CyberBackButton />

      {/* Main About Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <AboutSection />
      </div>
    </main>
  )
}
