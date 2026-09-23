import { useNavigate } from 'react-router-dom'
import './RegisterNowButton.css'

/** Grand CTA into the events/registration flow — lives inside the
 * navigation-city composition (top-right), separate from clicking the
 * Events building itself, so registration has its own obvious entry
 * point. Always visible regardless of registration state (unlike the
 * identity terminal, which reflects current state). */
export function RegisterNowButton() {
  const navigate = useNavigate()
  return (
    <button type="button" className="register-now-btn" onClick={() => navigate('/events')}>
      <span className="register-now-btn__dot" aria-hidden="true" />
      REGISTER NOW
    </button>
  )
}
