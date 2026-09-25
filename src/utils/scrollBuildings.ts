/**
 * Scroll position to place the user right in the revealed, active
 * buildings section on desktop or mobile.
 */
export function scrollToBuildings() {
  const perform = () => {
    const el = document.getElementById('buildings')
    if (!el) return false

    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' })
    } else {
      // Desktop: NavigationCityScene is 150vh spacer with 100vh sticky viewport.
      // Reveal threshold is progress >= 0.35. We park at ~0.38 where buildings
      // are completely emerged, settled, and HUD cards are clearly visible.
      const scrollableDistance = Math.max(el.offsetHeight - window.innerHeight, 1)
      const targetTop = el.offsetTop + 0.38 * scrollableDistance
      window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' })
    }
    return true
  }

  // Attempt immediately, then fall back with rAF/timeout to ensure layout is settled
  if (!perform()) {
    requestAnimationFrame(() => {
      if (!perform()) {
        setTimeout(perform, 50)
        setTimeout(perform, 150)
      }
    })
  } else {
    // Re-verify after next frame in case images or layout shifted
    requestAnimationFrame(() => {
      perform()
    })
  }
}
