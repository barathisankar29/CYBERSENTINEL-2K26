import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegistrationRulesModal } from '@/components/registration/RegistrationRulesModal'
import './RegisterNowButton.css'

interface RegisterNowButtonProps {
  /**
   * `overlay` (default): absolutely positioned top-right inside the desktop
   * navigation-city composition. `hero`: an in-flow glass/neon CTA for the
   * hero identity stack (see IdentityLayer.tsx).
   */
  variant?: 'overlay' | 'hero'
  onDirectProceed?: () => void
}

/** Grand CTA into the registration portal (/register, backed by the
 * Supabase registration Edge Functions) — opens the official registration
 * and team guidelines modal before proceeding to pack selection. */
export function RegisterNowButton({ variant = 'overlay', onDirectProceed }: RegisterNowButtonProps) {
  const navigate = useNavigate()
  const [showRules, setShowRules] = useState(false)

  const handleOpenRules = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowRules(true)
  }

  const handleProceed = () => {
    setShowRules(false)
    if (onDirectProceed) {
      onDirectProceed()
    } else {
      navigate('/register')
    }
  }

  return (
    <>
      {variant === 'hero' ? (
        <button type="button" className="register-now-hero" onClick={handleOpenRules}>
          <span className="register-now-hero__glow" aria-hidden="true" />
          <span className="register-now-hero__content">
            <span className="register-now-hero__dot" aria-hidden="true" />
            REGISTER NOW
            <span className="register-now-hero__chevron" aria-hidden="true">
              &rsaquo;
            </span>
          </span>
        </button>
      ) : (
        <button type="button" className="register-now-btn" onClick={handleOpenRules}>
          <span className="register-now-btn__dot" aria-hidden="true" />
          REGISTER NOW
        </button>
      )}

      {showRules && (
        <RegistrationRulesModal
          isOpen={showRules}
          onClose={() => setShowRules(false)}
          onProceed={handleProceed}
        />
      )}
    </>
  )
}

