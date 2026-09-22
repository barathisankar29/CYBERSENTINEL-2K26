import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { SectionPage } from '@/pages/SectionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AboutSection } from '@/components/about/AboutSection'
import { TimelinePage } from '@/pages/TimelinePage'

/**
 * Route shape is intentionally data-driven at the section level:
 * SectionPage resolves `slug` against src/data/sections.ts rather than
 * each section getting its own hardcoded route, so sections can be
 * added/renamed/removed from one place.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/:slug" element={<SectionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}