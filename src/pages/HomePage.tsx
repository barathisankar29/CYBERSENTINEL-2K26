import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { AboutSection } from '@/components/about/AboutSection'
import { CredentialsSection } from '@/components/credentials/CredentialsSection'
import { TimelineJourney } from '@/components/timeline/TimelineJourney'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { hasSeenIntro, markIntroAsSeen } from '@/utils/introSession'
import { scrollToBuildings } from '@/utils/scrollBuildings'

type IntroStage = 'intro' | 'transition' | 'completed'

export function HomePage() {
  const location = useLocation()
  const isNavigatingToSection = ['#buildings', '#about', '#credentials', '#timeline'].includes(location.hash)

  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (isNavigatingToSection) {
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
    } else if (['#about', '#credentials', '#timeline'].includes(location.hash)) {
      markIntroAsSeen()
      setIntroStage('completed')
      const targetId = location.hash.slice(1)
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
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
      <AboutSection />
      <CredentialsSection />
      <TimelineJourney />
      <SiteFooter />
    </main>
  )
}
