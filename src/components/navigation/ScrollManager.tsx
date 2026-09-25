import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToBuildings } from '@/utils/scrollBuildings'

/**
 * Global scroll manager for CyberSentinel:
 * 1. Disables browser's automatic scroll restoration to prevent jumping to bottom on route transitions.
 * 2. When navigating to any subpage (about, credentials, timeline, transport, events, profile):
 *    Ensures page always starts cleanly at the top (top: 0).
 * 3. When navigating to /#buildings:
 *    Instantly scrolls to the buildings section (desktop or mobile) so users don't have to scroll down from the top.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    // Disable browser default scroll restoration so it never restores old scroll offset
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (pathname === '/' && hash === '#buildings') {
      scrollToBuildings()
    } else if (hash !== '#buildings') {
      // Any other page starts from the very beginning of the page
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  useEffect(() => {
    if (pathname === '/' && hash === '#buildings') {
      const timer = setTimeout(() => {
        scrollToBuildings()
      }, 60)
      return () => clearTimeout(timer)
    }
  }, [pathname, hash])

  return null
}
