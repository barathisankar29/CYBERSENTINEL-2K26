import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { useSmoothScroll } from '@/animation/useSmoothScroll'
import { hasSeenIntro, markIntroAsSeen } from '@/utils/introSession'
import { scrollToBuildings } from '@/utils/scrollBuildings'
import { clearLeftHome, hasLeftHome, isCityReturnState, markLeftHome } from '@/utils/homeReturn'

type IntroStage = 'intro' | 'transition' | 'completed'

// Landing/main experience: the hero city, then the navigation city (the
// buildings), then the footer. Each building opens its own page (About,
// Credentials, Timeline, Transport, Events, Contact) — those sections are
// never stacked below the buildings on the home page.
//
// The intro runs intro -> transition -> completed on every visit (each
// fresh load or reload); coming back to home from another page within the
// same load skips to the transition (utils/introSession.ts).
//
// Arriving on `/#buildings` skips the intro and lands on the buildings
// (ScrollManager handles the scroll app-wide). Coming BACK with the browser/phone
// Back button (a POP navigation, which carries no hash from our links) —
// or via a link carrying CITY_RETURN_STATE — also skips the intro and
// lands on the buildings rather than the top of the hero
// (utils/homeReturn.ts).
export function HomePage() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isNavigatingToBuildings = location.hash === '#buildings'

  // Decided once per visit (read-only here; the flag is cleared in an effect).
  const [returnToCity] = useState(
    () => !location.hash && (isCityReturnState(location.state) || (navigationType === 'POP' && hasLeftHome())),
  )

  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (isNavigatingToBuildings || returnToCity) {
      return 'completed'
    }
    if (hasSeenIntro()) {
      return 'transition'
    }
    return 'intro'
  })

  useEffect(() => {
    if (location.hash === '#buildings') {
      markIntroAsSeen()
      setIntroStage('completed')
      scrollToBuildings()
    }
  }, [location.hash])

  // Leaving home (to any page) arms the browser-Back return; arriving consumes it.
  useEffect(() => {
    clearLeftHome()
    if (returnToCity) markIntroAsSeen()
    return () => markLeftHome()
  }, [returnToCity])

  // Browser-Back / return-state arrival: jump to the buildings before first
  // paint, so the hero never flashes.
  useLayoutEffect(() => {
    if (returnToCity) scrollToBuildings()
  }, [returnToCity])

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

  return (
    <main data-page="home">
      {introStage === 'intro' && <VideoIntro onFinish={handleVideoFinish} />}
      {introStage === 'transition' && (
        <FuturisticTransition onComplete={handleTransitionComplete} />
      )}
      <CityScene introCompleted={introStage === 'completed'} />
      {introStage !== 'intro' && <NavigationCityScene />}
      {introStage !== 'intro' && <SiteFooter />}
    </main>
  )
}
