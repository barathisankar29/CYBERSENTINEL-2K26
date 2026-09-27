import { useNavigate } from 'react-router-dom'
import { EventsTerminalApp } from '@/components/events-terminal/EventsTerminalApp'

/**
 * /register (the Register Now CTAs) — opens the events terminal's
 * "Choose your player" pack screen, the exact same page the Events REGISTER
 * buttons open, which continues into the registration portal (Supabase
 * `public-register`). Dismissing it lands on the event terminal.
 */
export function RegistrationPage() {
  const navigate = useNavigate()
  return <EventsTerminalApp startWithRegistration onStartRegistrationClose={() => navigate('/events', { replace: true })} />
}
