interface RegistrationOptionCardProps {
  name: string
  description: string
  price: number
  onSelect: () => void
}

/** A purchasable option — a special standalone event (Group Dance,
 * Thiruvizha Corner) or a package (Day 1 / Day 2 / Day 1+2). Deliberately
 * shows no character branding: character assignment is a result of
 * registration, not something chosen up front. */
export function RegistrationOptionCard({ name, description, price, onSelect }: RegistrationOptionCardProps) {
  return (
    <article className="option-card">
      <h3 className="option-card__name">{name}</h3>
      <p className="option-card__desc">{description}</p>
      <div className="option-card__footer">
        <span className="option-card__price">₹{price}</span>
        <button type="button" className="option-card__select" onClick={onSelect}>
          SELECT
        </button>
      </div>
    </article>
  )
}
