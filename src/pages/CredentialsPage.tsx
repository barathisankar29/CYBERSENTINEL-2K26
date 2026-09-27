import { CyberBackButton } from '@/components/ui/CyberBackButton'
import { CredentialsSection } from '@/components/credentials/CredentialsSection'

export function CredentialsPage() {
  return (
    <main data-page="credentials" className="relative min-h-screen bg-[#05040a] text-white overflow-x-hidden w-full max-w-full">
      {/* Standalone Back Button (No navbar) */}
      <CyberBackButton />

      {/* Main Credentials Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <CredentialsSection />
      </div>
    </main>
  )
}
