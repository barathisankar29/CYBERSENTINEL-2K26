import { CityScene } from '@/components/city/CityScene'

// Landing/main experience: intro sequence (src/components/intro) followed
// by the city navigation (src/components/city). Intro sequence not yet
// built — CityScene is the first piece, the cinematic parallax prototype.
export function HomePage() {
  return (
    <main data-page="home">
      <CityScene />
    </main>
  )
}
