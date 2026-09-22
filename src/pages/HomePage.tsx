import { useCallback, useState } from 'react'
import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'
import { VideoIntro } from '@/components/intro/VideoIntro'
import { FuturisticTransition } from '@/components/intro/FuturisticTransition'

// Landing/main experience: two normal, independent page sections — the
// hero city, then the navigation city — stacked in ordinary document
// flow. Each owns its own scroll mechanics (see CityScene.tsx and
// NavigationCityScene.tsx); there is no shared progress value or
// cross-fade between them, so the handoff is a plain "next section
// scrolls into view" like any normal scrollable page.
//
// CityScene/NavigationCityScene are always mounted underneath the intro.
// The intro itself runs intro -> transition -> completed: VideoIntro plays,
// FuturisticTransition bridges immediately to the already-mounted CityScene
// beneath it, then both overlays unmount leaving CityScene/NavigationCityScene
// normal.
type IntroStage = 'intro' | 'transition' | 'completed'

export function HomePage() {
  const [introStage, setIntroStage] = useState<IntroStage>('intro')

  const handleVideoFinish = useCallback(() => setIntroStage('transition'), [])
  const handleTransitionComplete = useCallback(() => setIntroStage('completed'), [])

  return (
    <main data-page="home">
      {introStage === 'intro' && <VideoIntro onFinish={handleVideoFinish} />}
      {introStage === 'transition' && (
        <FuturisticTransition onComplete={handleTransitionComplete} />
      )}
      <CityScene />
      <NavigationCityScene />
    </main>
  )
}
