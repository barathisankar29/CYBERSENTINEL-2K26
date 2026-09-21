import { CityScene } from '@/components/city/CityScene'
import { NavigationCityScene } from '@/components/city/NavigationCityScene'

// Landing/main experience: two normal, independent page sections — the
// hero city, then the navigation city — stacked in ordinary document
// flow. Each owns its own scroll mechanics (see CityScene.tsx and
// NavigationCityScene.tsx); there is no shared progress value or
// cross-fade between them, so the handoff is a plain "next section
// scrolls into view" like any normal scrollable page.
export function HomePage() {
  return (
    <main data-page="home">
      <CityScene />
      <NavigationCityScene />
    </main>
  )
}
