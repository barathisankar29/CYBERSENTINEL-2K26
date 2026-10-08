import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteFallback } from '@/components/ui/RouteFallback'
import { getDevicePerfInfo } from '@/utils/devicePerf'

// Home is the landing experience and ships in the entry bundle; every other
// page is its own chunk so the initial download only carries what Home needs.
const loadSectionPage = () => import('@/pages/SectionPage').then((m) => ({ default: m.SectionPage }))
const loadAboutPage = () => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
const loadTimelinePage = () => import('@/pages/TimelinePage').then((m) => ({ default: m.TimelinePage }))
const loadCredentialsPage = () => import('@/pages/CredentialsPage').then((m) => ({ default: m.CredentialsPage }))
const loadEventsPage = () => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage }))
const loadProfilePage = () => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
const loadTransportationPage = () => import('@/pages/TransportationPage').then((m) => ({ default: m.TransportationPage }))
const loadContactPage = () => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
const loadRegistrationPage = () => import('@/pages/RegistrationPage').then((m) => ({ default: m.RegistrationPage }))
const loadRegistrationStatusPage = () =>
  import('@/pages/RegistrationStatusPage').then((m) => ({ default: m.RegistrationStatusPage }))
const loadCreateTeamPage = () => import('@/pages/CreateTeamPage').then((m) => ({ default: m.CreateTeamPage }))

const SectionPage = lazy(loadSectionPage)
const AboutPage = lazy(loadAboutPage)
const TimelinePage = lazy(loadTimelinePage)
const CredentialsPage = lazy(loadCredentialsPage)
const EventsPage = lazy(loadEventsPage)
const ProfilePage = lazy(loadProfilePage)
const TransportationPage = lazy(loadTransportationPage)
const ContactPage = lazy(loadContactPage)
const RegistrationPage = lazy(loadRegistrationPage)
const RegistrationStatusPage = lazy(loadRegistrationStatusPage)
const CreateTeamPage = lazy(loadCreateTeamPage)

// Light pages first; the heavy ones (events terminal ~140 KB, transport map
// with Leaflet ~145 KB) last, so they can be skipped on weaker devices.
const lightRouteLoaders = [
  loadAboutPage,
  loadTimelinePage,
  loadCredentialsPage,
  loadProfilePage,
  loadContactPage,
  loadRegistrationPage,
  loadSectionPage,
]

/**
 * Warm route chunks (JS/CSS only — no page images) once the browser is idle
 * after the first load, so tapping a navigation building opens its page
 * immediately. One chunk per idle slot (never a burst of downloads and
 * parsing while the hero is animating). Phones skip the Leaflet map page;
 * low-RAM / data-saver devices also skip the events terminal — anything
 * skipped still loads normally when it is opened.
 */
function usePrefetchRoutes() {
  useEffect(() => {
    // If device is low RAM or very low RAM, completely skip prefetching to prevent
    // tab crash / reload on mobile devices.
    const { isLowRam, isVeryLowRam, isMobile } = getDevicePerfInfo()
    if (isLowRam || isVeryLowRam) return

    // Also skip if currently on any status or checking route
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase()
      if (p.includes('status') || p.includes('check')) return
    }

    const queue = [
      ...lightRouteLoaders,
      ...(isLowRam ? [] : [loadEventsPage]),
      ...(isMobile || isLowRam ? [] : [loadTransportationPage]),
    ]
    let cancelled = false
    let handle: number | undefined
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(cb, { timeout: 4000 })
        : window.setTimeout(cb, 600)
    const next = () => {
      const load = queue.shift()
      if (cancelled || !load) return
      void load()
        .catch(() => {})
        .finally(() => {
          if (!cancelled) handle = idle(next)
        })
    }
    handle = window.setTimeout(() => (handle = idle(next)), 1500)
    return () => {
      cancelled = true
      if (handle === undefined) return
      window.clearTimeout(handle)
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(handle)
    }
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/coordinators" element={<CredentialsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/transportation" element={<TransportationPage />} />
        <Route path="/transport" element={<TransportationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/register/status" element={<RegistrationStatusPage />} />
        {/* The college payment gateway returns participants here after paying */}
        <Route path="/checkStatus" element={<RegistrationStatusPage />} />
        <Route path="/checkstatus" element={<RegistrationStatusPage />} />
        <Route path="/check-status" element={<RegistrationStatusPage />} />
        <Route path="/payment-status" element={<RegistrationStatusPage />} />
        <Route path="/register/team" element={<CreateTeamPage />} />
        <Route path="/:slug" element={<SectionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

