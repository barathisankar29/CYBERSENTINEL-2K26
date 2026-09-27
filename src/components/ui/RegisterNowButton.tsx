import { useNavigate } from 'react-router-dom'
import './RegisterNowButton.css'

interface RegisterNowButtonProps {
  /**
   * `overlay` (default): absolutely positioned top-right inside the desktop
   * navigation-city composition. `hero`: an in-flow glass/neon CTA for the
   * hero identity stack (see IdentityLayer.tsx).
   */
  variant?: 'overlay' | 'hero'
}

/** Grand CTA into the registration portal (/register, backed by the
 * Supabase registration Edge Functions) — separate from clicking the
 * Events building itself, so registration has its own obvious entry
 * point. Always visible regardless of registration state (unlike the
 * identity terminal, which reflects current state). */
export function RegisterNowButton({ variant = 'overlay' }: RegisterNowButtonProps) {
  const navigate = useNavigate()

  if (variant === 'hero') {
    return (
      <button type="button" className="register-now-hero" onClick={() => navigate('/register')}>
        <span className="register-now-hero__glow" aria-hidden="true" />
        <span className="register-now-hero__content">
          <span className="register-now-hero__dot" aria-hidden="true" />
          REGISTER NOW
          <span className="register-now-hero__chevron" aria-hidden="true">
            &rsaquo;
          </span>
        </span>
      </button>
    )
  }

  return (
    <button type="button" className="register-now-btn" onClick={() => navigate('/register')}>
      <span className="register-now-btn__dot" aria-hidden="true" />
      REGISTER NOW
    </button>
  )
}
