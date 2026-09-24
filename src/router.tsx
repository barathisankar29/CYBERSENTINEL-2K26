import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteFallback } from '@/components/ui/RouteFallback'

// Home is the landing experience and ships in the entry bundle; every other
// page is its own chunk so the initial download only carries what Home needs.
const loadSectionPage = () => import('@/pages/SectionPage').then((m) => ({ default: m.SectionPage }))
const loadAboutSection = () => import('@/components/about/AboutSection').then((m) => ({ default: m.AboutSection }))
const loadTimelinePage = () => import('@/pages/TimelinePage').then((m) => ({ default: m.TimelinePage }))
const loadCredentialsPage = () => import('@/pages/CredentialsPage').then((m) => ({ default: m.CredentialsPage }))
const loadEventsPage = () => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage }))
const loadProfilePage = () => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))

const SectionPage = lazy(loadSectionPage)
const AboutSection = lazy(loadAboutSection)
const TimelinePage = lazy(loadTimelinePage)
const CredentialsPage = lazy(loadCredentialsPage)
const EventsPage = lazy(loadEventsPage)
const ProfilePage = lazy(loadProfilePage)

const routeLoaders = [
  loadAboutSection,
  loadTimelinePage,
  loadCredentialsPage,
  loadEventsPage,
  loadProfilePage,
  loadSectionPage,
]

/**
 * Warm every route chunk (JS/CSS only — no page images) once the browser is
 * idle after the first load, so tapping a navigation building opens its page
 * immediately instead of waiting on a network round-trip. Idle-scheduled so
 * it never competes with the hero's own critical assets.
 */
function usePrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => routeLoaders.forEach((load) => void load().catch(() => {}))
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const timeoutId = setTimeout(prefetch, 2500)
    return () => clearTimeout(timeoutId)
  }, [])
}

/**
 * Route shape is intentionally data-driven at the section level:
 * SectionPage resolves `slug` against src/data/sections.ts rather than
 * each section getting its own hardcoded route, so sections can be
 * added/renamed/removed from one place.
 */
export function AppRoutes() {
  usePrefetchRoutes()

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:slug" element={<SectionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
