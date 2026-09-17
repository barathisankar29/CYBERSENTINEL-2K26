import { CityScene } from '@/components/city/CityScene'

// Landing/main experience: the scroll-driven cinematic city reveal
// (src/components/city) carries both the environment and the college/
// symposium identity. Navigation buildings/camera-to-aerial transition
// land in a later pass.
export function HomePage() {
  return (
    <main data-page="home">
      <CityScene />
    </main>
  )
}
