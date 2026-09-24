import { useParams } from 'react-router-dom'
import { siteSections } from '@/data/sections'
import { AboutSection } from '@/components/about/AboutSection'
import { CredentialsPage } from '@/pages/CredentialsPage'
import { TransportationPage } from '@/pages/TransportationPage'
import { CyberBackButton } from '@/components/ui/CyberBackButton'

export function SectionPage() {
  const { slug: rawSlug } = useParams()
  const slug = rawSlug || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\//, '') : 'about')
  const section = siteSections.find((entry) => entry.slug === slug)

  if (slug === 'about') {
    return (
      <main data-page="section" data-slug="about" data-found="true" className="relative min-h-screen bg-[#05040a] text-white overflow-x-hidden w-full max-w-full">
        {/* Standalone Back Button (No navbar) */}
        <CyberBackButton />

        <AboutSection />
      </main>
    )
  }

  if (slug === 'credentials') {
    return <CredentialsPage />
  }

  if (slug === 'transportation' || slug === 'transport') {
    return <TransportationPage />
  }

  return (
    <main data-page="section" data-slug={slug} data-found={Boolean(section)}>
      <CyberBackButton />
    </main>
  )
}
