import { useState, useCallback } from 'react'
import { CityScene } from '@/components/city/CityScene'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'
import { AboutSection } from '@/components/about/AboutSection'
import { CredentialsSection } from '@/components/credentials/CredentialsSection'
import { ReplayIntroButton } from '@/components/ui/ReplayIntroButton'
import { hasSeenIntro, markIntroAsSeen, resetIntroSeen } from '@/utils/introSession'

export function HomePage() {
  // If user has already visited in this session / cookie stored, skip the video clip but keep the initializing transition
  const [introStage, setIntroStage] = useState<'intro' | 'transition' | 'completed'>(() => {
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

  const handleReplayIntro = useCallback(() => {
    resetIntroSeen()
    setIntroStage('intro')
  }, [])

  return (
    <main data-page="home" className="relative">
      {/* 2K Video Intro Entry Screen - only for new users or when replaying */}
      {introStage === 'intro' && (
        <VideoIntro onFinish={handleVideoFinish} />
      )}

      {/* Futuristic Blank-to-Aperture Opening Transition */}
      {introStage === 'transition' && (
        <FuturisticTransition onComplete={handleTransitionComplete} />
      )}

      {/* Main City Scene & Experience */}
      <CityScene introCompleted={introStage === 'completed'} />

      {/* Floating Replay Intro Button when in City Scene */}
      <ReplayIntroButton onReplay={handleReplayIntro} visible={introStage === 'completed'} />

      {/* About Section */}
      <AboutSection />

      {/* Credentials & Committee Section */}
      <CredentialsSection />
    </main>
  )
}


