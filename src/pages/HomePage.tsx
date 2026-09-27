import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { AboutSection } from '@/components/about/AboutSection'
import { CredentialsSection } from '@/components/credentials/CredentialsSection'
import { TimelineJourney } from '@/components/timeline/TimelineJourney'
import { TransportationSection } from '@/components/transportation/TransportationSection'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { useSmoothScroll } from '@/animation/useSmoothScroll'
import { hasSeenIntro, markIntroAsSeen } from '@/utils/introSession'
import { scrollToBuildings } from '@/utils/scrollBuildings'
import { clearLeftHome, hasLeftHome, isCityReturnState, markLeftHome } from '@/utils/homeReturn'

type IntroStage = 'intro' | 'transition' | 'completed'

const SECTION_HASHES = ['#buildings', '#about', '#credentials', '#timeline', '#transport', '#transportation']

// Landing/main experience: the hero city, the navigation city (buildings),
// then the embedded About / Credentials / Timeline / Transportation
// sections and the footer, in ordinary document flow.
//
// The intro runs intro -> transition -> completed; repeat visits in the
// same tab skip to the transition (utils/introSession.ts).
//
// Arriving on a section: `/#buildings` and the other section hashes skip
// the intro and scroll there (ScrollManager handles #buildings app-wide;
// the effect below handles the rest). Coming BACK with the browser/phone
// Back button (a POP navigation, which carries no hash from our links) —
// or via a link carrying CITY_RETURN_STATE — also skips the intro and
// lands on the buildings rather than the top of the hero
// (utils/homeReturn.ts).
export function HomePage() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isNavigatingToSection = SECTION_HASHES.includes(location.hash)

  // Decided once per visit (read-only here; the flag is cleared in an effect).
  const [returnToCity] = useState(
    () => !location.hash && (isCityReturnState(location.state) || (navigationType === 'POP' && hasLeftHome())),
  )

  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (isNavigatingToSection || returnToCity) {
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
    } else if (['#about', '#credentials', '#timeline', '#transport', '#transportation'].includes(location.hash)) {
      markIntroAsSeen()
      setIntroStage('completed')
      const targetId = location.hash === '#transportation' ? 'transport' : location.hash.slice(1)
      const el = document.getElementById(targetId) || (targetId === 'transport' ? document.getElementById('transportation') : null)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
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
      <NavigationCityScene />
      <AboutSection />
      <CredentialsSection />
      <TimelineJourney />
      <TransportationSection />
      <SiteFooter />
    </main>
  )
}
