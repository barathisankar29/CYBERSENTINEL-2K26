import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { hasSeenIntro, markIntroAsSeen } from '@/utils/introSession'
import { scrollToBuildings } from '@/utils/scrollBuildings'

type IntroStage = 'intro' | 'transition' | 'completed'

export function HomePage() {
  const location = useLocation()
  const isNavigatingToBuildings = location.hash === '#buildings'

  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (isNavigatingToBuildings) {
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

  const handleVideoFinish = useCallback(() => {
    markIntroAsSeen()
    setIntroStage('transition')
  }, [])

  const handleTransitionComplete = useCallback(() => {
    markIntroAsSeen()
    setIntroStage('completed')
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
    </main>
  )
}
