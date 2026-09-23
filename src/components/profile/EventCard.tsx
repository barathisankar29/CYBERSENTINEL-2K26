interface EventCardProps {
  name: string
}

export function EventCard({ name }: EventCardProps) {
  return (
    <div className="profile-event-row">
      <span className="profile-event-row__name">{name}</span>
      <span className="profile-event-row__badge">INCLUDED</span>
    </div>
  )
}
