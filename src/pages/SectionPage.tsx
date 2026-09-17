import { useParams } from 'react-router-dom'
import { siteSections } from '@/data/sections'

// Generic, data-driven section route: resolves `slug` against
// src/data/sections.ts instead of each section having its own page
// component + route wired by hand. Not yet implemented.
export function SectionPage() {
  const { slug } = useParams()
  const section = siteSections.find((entry) => entry.slug === slug)

  return <main data-page="section" data-slug={slug} data-found={Boolean(section)} />
}
