import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useMascot } from './MascotContext'
import { MASCOT_DIALOGUE } from './mascotDialogue'

const STORAGE_KEY_INTRO_SCROLL = 'cybersentinel_intro_scroll_seen'
const STORAGE_KEY_CITY_INTRO = 'cybersentinel_city_intro_seen'

/**
 * Watches route navigation and page scroll milestones to provide contextual, non-intrusive mascot hints.
 * Follows Parts 1, 9, 10, and 14 of the CyberSentinel 2K26 Mascot Companion specification.
 */
export function MascotRouteWatcher() {
  const location = useLocation()
  const { setMascotState, saySequence, isTourActive, checkObstructionAndRelocate } = useMascot()
  const prevPathRef = useRef<string | null>(null)
  const hasIntroducedRef = useRef(false)

  // Route change handler
  useEffect(() => {
    if (isTourActive) return

    const pathname = location.pathname

    // Prevent duplicate triggers if path hasn't changed
    if (prevPathRef.current === pathname) {
      return
    }

    const isFirstVisit = prevPathRef.current === null
    prevPathRef.current = pathname

    // Initial landing page entrance (Part 1)
    if (isFirstVisit && (pathname === '/' || pathname === '')) {
      const timer = setTimeout(() => {
        if (!hasIntroducedRef.current) {
          hasIntroducedRef.current = true
          const welcome = MASCOT_DIALOGUE.intro.welcomeInitial
          if (welcome.followUpText) {
            saySequence([
              { text: welcome.text, duration: 4000, state: welcome.state },
              { text: welcome.followUpText, duration: 4000, state: welcome.state },
            ], welcome.priority)
          } else {
            setMascotState(welcome.state, welcome.duration, welcome.text, 'idle', false, welcome.priority)
          }
        }
      }, 1200)
      return () => clearTimeout(timer)
    }

    // Contextual hints per route (Part 14)
    if (pathname === '/events') {
      const timer = setTimeout(() => {
        const item = MASCOT_DIALOGUE.events.terminal
        if (item.followUpText) {
          saySequence([
            { text: item.text, duration: 3500, state: item.state },
            { text: item.followUpText, duration: 3800, state: item.state },
          ], item.priority)
        } else {
          setMascotState(item.state, item.duration, item.text, 'idle', false, item.priority)
        }
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/register') {
      const timer = setTimeout(() => {
        setMascotState('thinking', 3500, 'Ready to register? Choose your pass.', 'idle', false, 'high')
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/register/status') {
      const timer = setTimeout(() => {
        setMascotState('listening', 3500, 'Your registration details are here.', 'idle', false, 'high')
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/about') {
      const timer = setTimeout(() => {
        setMascotState('guide', 3500, 'Learn about Vel Tech and the symposium.', 'idle', false, 'high')
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/timeline') {
      const timer = setTimeout(() => {
        setMascotState('guide', 3500, 'Check out the timeline and metro stops.', 'idle', false, 'high')
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/credentials') {
      const timer = setTimeout(() => {
        setMascotState('happy', 3500, 'Meet the architects behind CyberSentinel.', 'idle', false, 'high')
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/transport' || pathname === '/transportation') {
      const timer = setTimeout(() => {
        setMascotState('guide', 3500, 'Check college bus routes and stops.', 'idle', false, 'high')
        checkObstructionAndRelocate()
      }, 450)
      return () => clearTimeout(timer)
    }

    if (pathname === '/' || pathname === '') {
      // Returning to homepage from another subpage
      if (hasIntroducedRef.current) {
        const timer = setTimeout(() => {
          setMascotState('happy', 3000, 'Welcome back to the city.', 'idle', false, 'high')
          checkObstructionAndRelocate()
        }, 450)
        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, isTourActive, setMascotState, saySequence, checkObstructionAndRelocate])

  // Scroll milestones for initial landing experience (Part 9 & Part 10)
  useEffect(() => {
    if (isTourActive || (location.pathname !== '/' && location.pathname !== '')) return

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop

      // Part 9: When user starts scrolling into the CyberSentinel world
      if (scrollY > 100 && !localStorage.getItem(STORAGE_KEY_INTRO_SCROLL)) {
        try {
          localStorage.setItem(STORAGE_KEY_INTRO_SCROLL, 'true')
        } catch {
          // ignore
        }
        const item = MASCOT_DIALOGUE.intro.scrollDown
        setMascotState(item.state, item.duration, item.text, 'idle', false, item.priority)
      }

      // Part 10: When user finishes entering the city / buildings area
      const buildingsEl = document.getElementById('buildings')
      if (buildingsEl && !localStorage.getItem(STORAGE_KEY_CITY_INTRO)) {
        const rect = buildingsEl.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.7) {
          try {
            localStorage.setItem(STORAGE_KEY_CITY_INTRO, 'true')
          } catch {
            // ignore
          }
          const cityIntro = MASCOT_DIALOGUE.intro.cityWelcome
          saySequence([
            { text: cityIntro.text, duration: 3800, state: cityIntro.state },
            { text: cityIntro.followUpText!, duration: 4200, state: cityIntro.state },
          ], cityIntro.priority)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname, isTourActive, saySequence, setMascotState])

  return null
}
