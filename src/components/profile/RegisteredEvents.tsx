import { IntentPanel } from './IntentPanel'
import { EventCard } from './EventCard'

interface RegisteredEventsProps {
  events: string[]
}

export function RegisteredEvents({ events }: RegisteredEventsProps) {
  return (
    <IntentPanel title="REGISTERED EVENTS" hint={`${events.length} EVENT${events.length === 1 ? '' : 'S'}`} areaClass="profile-panel--events">
      <div className="profile-events-list">
        {events.map((name) => (
          <EventCard key={name} name={name} />
        ))}
      </div>
    </IntentPanel>
  )
}
