import { useState, type CSSProperties, type FormEvent } from 'react'
import './CharacterSelection.css'

interface MockPaymentGateProps {
  packLabel: string
  price: number
  onCancel: () => void
  onComplete: (username: string, email: string) => void
}

/**
 * Collects a username/email, then requires an explicit, clearly-labeled
 * "test payment" step before completing registration. There is no real
 * payment provider wired up — this never claims money changed hands. When
 * a real gateway is connected, replace the button's onClick with an actual
 * payment-provider call and only invoke onComplete after it confirms
 * success server-side.
 *
 * Deliberately theme-neutral (site cyan/violet, not any character's
 * colors) — the user hasn't been assigned a character yet at this stage;
 * see RegistrationRevealTransition for where that's actually revealed.
 */
export function MockPaymentGate({ packLabel, price, onCancel, onComplete }: MockPaymentGateProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [showTestPayment, setShowTestPayment] = useState(false)

  const canProceed = username.trim().length > 0 && email.trim().length > 0

  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canProceed) return
    setShowTestPayment(true)
  }

  return (
    <div
      className="selection-root"
      style={{
        '--char-primary': '#22d3ee',
        '--char-glow': 'rgba(34, 211, 238, 0.5)',
        '--char-text-tint': '#a5f3fc',
      } as CSSProperties}
    >
      <div className="payment-gate">
        <div className="payment-gate__summary">
          <div>
            <div className="payment-gate__character">REGISTRATION</div>
            <div className="payment-gate__pack">{packLabel}</div>
          </div>
          <div className="payment-gate__price">₹{price}</div>
        </div>

        {!showTestPayment ? (
          <form onSubmit={handleDetailsSubmit}>
            <div className="payment-gate__field">
              <label htmlFor="pg-username">Username</label>
              <input
                id="pg-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your name"
              />
            </div>
            <div className="payment-gate__field">
              <label htmlFor="pg-email">Email</label>
              <input
                id="pg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="payment-gate__actions">
              <button type="button" className="payment-gate__cancel" onClick={onCancel}>
                CANCEL
              </button>
              <button type="submit" className="payment-gate__submit" disabled={!canProceed}>
                CONTINUE TO PAYMENT
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="payment-gate__notice">
              ⚠ TEST MODE — no payment provider is connected yet. Clicking below will
              NOT charge you or process a real payment; it only simulates a
              successful test transaction so the registration/profile flow can be
              reviewed. Replace this step with a real gateway before launch.
            </p>

            <div className="payment-gate__actions">
              <button type="button" className="payment-gate__cancel" onClick={() => setShowTestPayment(false)}>
                BACK
              </button>
              <button
                type="button"
                className="payment-gate__submit"
                onClick={() => onComplete(username.trim(), email.trim())}
              >
                SIMULATE TEST PAYMENT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
