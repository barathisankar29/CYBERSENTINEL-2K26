import type { CatalogEvent } from '@/data/eventCatalog'

interface EventInfoCardProps {
  event: CatalogEvent
  packTag: string
}

/** Read-only Day 1 / Day 2 event card — informational only. These events
 * aren't individually purchasable; they're bundled into the day pack named
 * in `packTag`. */
export function EventInfoCard({ event, packTag }: EventInfoCardProps) {
  return (
    <article className="info-card">
      <span className="info-card__tag">{packTag}</span>
      <h3 className="info-card__name">{event.name}</h3>
      <p className="info-card__desc">{event.description}</p>
      <div className="info-card__meta">
        <span>{event.venue}</span>
        <span>{event.time}</span>
        <span>{event.crew}</span>
      </div>
    </article>
  )
}
