import { useState, useCallback } from 'react'
import { CityScene } from '@/components/city/CityScene'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { AboutSection } from '@/components/about/AboutSection'

export function HomePage() {
  const [introStage, setIntroStage] = useState<'intro' | 'transition' | 'completed'>('intro')

  const handleVideoFinish = useCallback(() => {
    setIntroStage('transition')
  }, [])

  const handleTransitionComplete = useCallback(() => {
    setIntroStage('completed')
  }, [])

  return (
    <main data-page="home" className="relative">
      {/* 2K Video Intro Entry Screen */}
      {introStage === 'intro' && (
        <VideoIntro onFinish={handleVideoFinish} />
      )}

      {/* Futuristic Blank-to-Aperture Opening Transition */}
      {introStage === 'transition' && (
        <FuturisticTransition onComplete={handleTransitionComplete} />
      )}

      {/* Main City Scene & Experience */}
      <CityScene introCompleted={introStage === 'completed'} />

      {/* About Section */}
      <AboutSection />
    </main>
  )
}


