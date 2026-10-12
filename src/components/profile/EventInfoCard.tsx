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
      <div className="flex items-center justify-between gap-2">
        <span className="info-card__tag">{packTag}</span>
        {event.isClosed && (
          <span className="font-mono text-[10px] tracking-wider text-red-400 bg-red-950/70 border border-red-800/80 px-2 py-0.5 rounded">
            REGISTRATION CLOSED
          </span>
        )}
      </div>
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
