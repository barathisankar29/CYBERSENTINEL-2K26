import { useParams } from 'react-router-dom'
import { siteSections } from '@/data/sections'
import { AboutSection } from '@/components/about/AboutSection'

export function SectionPage() {
  const { slug } = useParams()
  const section = siteSections.find((entry) => entry.slug === slug)

  if (slug === 'about') {
    return (
      <main data-page="section" data-slug="about" data-found="true">
        <AboutSection />
      </main>
    )
  }

  return <main data-page="section" data-slug={slug} data-found={Boolean(section)} />
}
