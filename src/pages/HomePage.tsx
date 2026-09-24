import { useCallback, useState } from 'react'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { ReplayIntroButton } from '@/components/ui/ReplayIntroButton'
import { hasSeenIntro, markIntroAsSeen, resetIntroSeen } from '@/utils/introSession'

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
// The identity/profile access terminal and Register Now CTA live inside
// NavigationCityScene/NavigationCityMobile themselves (not here) so they
// only ever appear on the buildings page, not site-wide.
type IntroStage = 'intro' | 'transition' | 'completed'

export function HomePage() {
  const [introStage, setIntroStage] = useState<IntroStage>(() =>
    hasSeenIntro() ? 'transition' : 'intro',
  )

  const handleVideoFinish = useCallback(() => {
    markIntroAsSeen()
    setIntroStage('transition')
  }, [])

  const handleTransitionComplete = useCallback(() => {
    markIntroAsSeen()
    setIntroStage('completed')
  }, [])

  const handleReplayIntro = useCallback(() => {
    resetIntroSeen()
    setIntroStage('intro')
  }, [])

  return (
    <main data-page="home">
      {introStage === 'intro' && <VideoIntro onFinish={handleVideoFinish} />}
      {introStage === 'transition' && (
        <FuturisticTransition onComplete={handleTransitionComplete} />
      )}
      <CityScene introCompleted={introStage === 'completed'} />
      <NavigationCityScene />
      <SiteFooter />

      {/* Floating Replay Intro Button when city scene is active */}
      <ReplayIntroButton onReplay={handleReplayIntro} visible={introStage === 'completed'} />
    </main>
  )
}
