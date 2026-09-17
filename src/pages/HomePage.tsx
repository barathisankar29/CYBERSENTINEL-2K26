import { IntroSequence } from '@/components/intro/IntroSequence'

// Landing/main experience: cinematic boot sequence (src/components/intro)
// establishing into the persistent city (src/components/city). Navigation
// buildings/camera-to-aerial transition land in a later pass.
export function HomePage() {
  return (
    <main data-page="home">
      <IntroSequence />
    </main>
  )
}
