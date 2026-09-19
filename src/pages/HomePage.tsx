import { CityJourney } from '@/components/city/CityJourney'

// Landing/main experience: one continuous scroll-driven camera move —
// the hero city, then the navigation city — inside a single sticky
// viewport. See src/components/city/CityJourney.tsx.
export function HomePage() {
  return (
    <main data-page="home">
      <CityJourney />
    </main>
  )
}
