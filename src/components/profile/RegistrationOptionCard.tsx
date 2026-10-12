interface RegistrationOptionCardProps {
  name: string
  description: string
  price: number
  isClosed?: boolean
  onSelect: () => void
}

/** A purchasable option — a special standalone event (Group Dance,
 * Thiruvizha Corner) or a package (Day 1 / Day 2 / Day 1+2). Deliberately
 * shows no character branding: character assignment is a result of
 * registration, not something chosen up front. */
export function RegistrationOptionCard({ name, description, price, isClosed, onSelect }: RegistrationOptionCardProps) {
  return (
    <article className={`option-card ${isClosed ? 'option-card--closed' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="option-card__name">{name}</h3>
        {isClosed && (
          <span className="font-mono text-[10px] tracking-wider text-red-400 bg-red-950/70 border border-red-800/80 px-2 py-0.5 rounded">
            REGISTRATION CLOSED
          </span>
        )}
      </div>
      <p className="option-card__desc">{description}</p>
      <div className="option-card__footer">
        <span className={`option-card__price ${isClosed ? 'opacity-50 line-through' : ''}`}>₹{price}</span>
        {isClosed ? (
          <button type="button" className="option-card__select option-card__select--closed" disabled>
            CLOSED
          </button>
        ) : (
          <button type="button" className="option-card__select" onClick={onSelect}>
            SELECT
          </button>
        )}
      </div>
    </article>
  )
}
