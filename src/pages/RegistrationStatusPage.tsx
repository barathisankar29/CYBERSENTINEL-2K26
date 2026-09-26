import { EventsTerminalApp } from '@/components/events-terminal/EventsTerminalApp'

/** /register/status — events-terminal "My Registrations" (backend check-registration). */
export function RegistrationStatusPage() {
  return <EventsTerminalApp initialModule="favorites" />
}
