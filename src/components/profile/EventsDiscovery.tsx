import { Link } from 'react-router-dom'
import { DAY_1_EVENTS, DAY_2_EVENTS, SPECIAL_EVENTS } from '@/data/eventCatalog'
import { characterProfiles } from '@/data/characterProfiles'
import { EventInfoCard } from './EventInfoCard'
import { RegistrationOptionCard } from './RegistrationOptionCard'
import './EventsDiscovery.css'

interface EventsDiscoveryProps {
  onSelectPack: (packId: string) => void
}

// Special events and packages are both just "packs" in the data model
// (see data/characterProfiles.ts) — single-event packs read as standalone
// special events, multi-event packs read as day passes. Pulled from there
// directly so this page never duplicates pricing/event lists.
const specialPacks = characterProfiles.dacre.packs
const packagePacks = [
  characterProfiles.nico.packs[0],
  characterProfiles.ruelle.packs[0],
  characterProfiles.cosma.packs[0],
]

const specialDescriptions: Record<string, string> = Object.fromEntries(
  SPECIAL_EVENTS.map((event) => [event.name.toUpperCase(), event.description])
)

const packageDescriptions: Record<string, string> = {
  'DAY 1 PACK': 'Full access to every Day 1 event — Paper Presentation, Cypher Coding, Unsaid, Weblica, and X-Coders.',
  'DAY 2 PACK': 'Full access to every Day 2 event — Connections, BGM, Lyrics, Mixed Signal, and Talent Show.',
  'DAY 1 + DAY 2 PACK': 'Full access to every event across both days of CyberSentinel 2K26 — the complete symposium pass.',
}

export function EventsDiscovery({ onSelectPack }: EventsDiscoveryProps) {
  return (
    <div className="discovery-root">
      <header className="discovery-header">
        <Link to="/#buildings" className="discovery-back">← RETURN TO CITY</Link>
      </header>

      <div className="discovery-hero">
        <span className="discovery-hero__eyebrow">CYBERSENTINEL 2K26 // EVENTS</span>
        <h1 className="discovery-hero__title">EVENTS</h1>
        <p className="discovery-hero__subtitle">
          Ten competitive events across two days, plus two standalone showcases. Explore what&apos;s
          happening, then register through a day pack or a standalone entry below.
        </p>
      </div>

      <section className="discovery-section">
        <div className="discovery-section__header">
          <span className="discovery-section__title">Day 1</span>
          <span className="discovery-section__count">{DAY_1_EVENTS.length} Events</span>
        </div>
        <div className="discovery-grid">
          {DAY_1_EVENTS.map((event) => (
            <EventInfoCard key={event.id} event={event} packTag="DAY 1 PACK" />
          ))}
        </div>
      </section>

      <section className="discovery-section">
        <div className="discovery-section__header">
          <span className="discovery-section__title">Day 2</span>
          <span className="discovery-section__count">{DAY_2_EVENTS.length} Events</span>
        </div>
        <div className="discovery-grid">
          {DAY_2_EVENTS.map((event) => (
            <EventInfoCard key={event.id} event={event} packTag="DAY 2 PACK" />
          ))}
        </div>
      </section>

      <section className="discovery-section">
        <div className="discovery-section__header">
          <span className="discovery-section__title">Special Events</span>
          <span className="discovery-section__count">{specialPacks.length} Standalone</span>
        </div>
        <div className="discovery-grid">
          {specialPacks.map((pack) => (
            <RegistrationOptionCard
              key={pack.id}
              name={pack.label}
              description={specialDescriptions[pack.label] ?? ''}
              price={pack.price}
              onSelect={() => onSelectPack(pack.id)}
            />
          ))}
        </div>
      </section>

      <section className="discovery-section">
        <div className="discovery-section__header">
          <span className="discovery-section__title">Packages</span>
          <span className="discovery-section__count">{packagePacks.length} Options</span>
        </div>
        <div className="discovery-grid">
          {packagePacks.map((pack) => (
            <RegistrationOptionCard
              key={pack.id}
              name={pack.label}
              description={packageDescriptions[pack.label] ?? ''}
              price={pack.price}
              onSelect={() => onSelectPack(pack.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
