import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { NAVIGATION_REVEAL_PROGRESS } from '@/components/city/navigationCityEnvironment.config'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSmoothScroll } from '@/animation/useSmoothScroll'
import { hasSeenIntro, markIntroAsSeen } from '@/utils/introSession'
import { clearLeftHome, hasLeftHome, isCityReturnState, markLeftHome } from '@/utils/homeReturn'

// Landing/main experience: two normal, independent page sections — the
// hero city, then the navigation city — stacked in ordinary document
// flow, followed by the site footer. Each owns its own scroll mechanics
// (see CityScene.tsx and NavigationCityScene.tsx); there is no shared
// progress value or cross-fade between them, so the handoff is a plain
// "next section scrolls into view" like any normal scrollable page.
//
// CityScene/NavigationCityScene are always mounted underneath the intro.
// The intro itself runs intro -> transition -> completed: VideoIntro plays,
// FuturisticTransition bridges immediately to the already-mounted CityScene
// beneath it, then both overlays unmount leaving CityScene/NavigationCityScene
// normal. Repeat visits within the same browser tab (see
// utils/introSession.ts) skip straight to the transition stage instead of
// replaying the full video; a new tab plays the full intro again.
//
// Coming BACK from any other page (a back/exit link, or the browser's own
// Back button — see utils/homeReturn.ts) skips the intro and the hero
// entirely and lands directly on the navigation city's buildings.
//
// The identity/profile access terminal and Register Now CTA live inside
// NavigationCityScene/NavigationCityMobile themselves (not here) so they
// only ever appear on the buildings page, not site-wide.
type IntroStage = 'intro' | 'transition' | 'completed'

export function HomePage() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isMobile = useIsMobile()
  const cityRef = useRef<HTMLDivElement>(null)

  // Decided once per visit (read-only here; the flag is cleared in an effect).
  const [returnToCity] = useState(
    () => isCityReturnState(location.state) || (navigationType === 'POP' && hasLeftHome()),
  )

  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (returnToCity) return 'completed'
    return hasSeenIntro() ? 'transition' : 'intro'
  })

  const handleVideoFinish = useCallback(() => {
    markIntroAsSeen()
    setIntroStage('transition')
  }, [])

  const handleTransitionComplete = useCallback(() => {
    markIntroAsSeen()
    setIntroStage('completed')
  }, [])

  // Smooth, eased wheel scrolling once the intro overlays are gone (they
  // own the screen and don't scroll).
  useSmoothScroll(introStage === 'completed')

  // Leaving home (to any page) arms the browser-Back return; arriving consumes it.
  useEffect(() => {
    clearLeftHome()
    if (returnToCity) markIntroAsSeen()
    return () => markLeftHome()
  }, [returnToCity])

  // Jump straight to the buildings, before first paint. On desktop the
  // buildings pop in once scroll crosses NAVIGATION_REVEAL_PROGRESS of the
  // navigation section's own pinned range, so land just past it.
  useLayoutEffect(() => {
    if (!returnToCity) return
    const city = cityRef.current
    if (!city) return
    const top = city.getBoundingClientRect().top + window.scrollY
    const pinnedRange = Math.max(city.offsetHeight - window.innerHeight, 0)
    const target = isMobile ? top : top + pinnedRange * Math.min(NAVIGATION_REVEAL_PROGRESS + 0.05, 1)
    window.scrollTo({ top: target, left: 0, behavior: 'instant' })
    // Only on arrival — later viewport changes must not yank the user back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnToCity])

  return (
    <main data-page="home">
      {introStage === 'intro' && <VideoIntro onFinish={handleVideoFinish} />}
      {introStage === 'transition' && (
        <FuturisticTransition onComplete={handleTransitionComplete} />
      )}
      <CityScene introCompleted={introStage === 'completed'} />
      <div id="city" ref={cityRef}>
        <NavigationCityScene />
      </div>
      <SiteFooter />
    </main>
  )
}
