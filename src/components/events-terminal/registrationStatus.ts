import type { CheckRegistrationResponse } from '@/services/registration';

/**
 * What a participant's registration means for them, derived ONLY from the
 * values register2's backend actually returns from `check-registration`:
 *   registration.status  PAYMENT_PENDING (created) -> CONFIRMED
 *   payment.status       UNDER_REVIEW (created)    -> VERIFIED | REJECTED
 *
 * - success: payment VERIFIED and registration CONFIRMED — the same rule the
 *   backend uses before it issues the entry QR.
 * - failed:  payment REJECTED (register2's checking.js styles it as the
 *   failure state; its Pay Payment action stays available to pay again).
 * - pending: everything else. The gateway's own result is stored server-side
 *   (payment-response) but not returned by check-registration, so a payment
 *   that did not go through stays UNDER_REVIEW and reads as pending here.
 *
 * A record returned by check-registration always means the registration
 * itself exists, so registration is never shown as failed.
 */
export type RegistrationOutcome = 'success' | 'pending' | 'failed';

export function registrationOutcome(record: CheckRegistrationResponse): RegistrationOutcome {
  const payment = record.payment?.status;
  if (payment === 'VERIFIED' && record.registration.status === 'CONFIRMED') return 'success';
  if (payment === 'REJECTED') return 'failed';
  return 'pending';
}

export interface OutcomeCopy {
  /** Popup heading */
  title: string;
  registrationLabel: string;
  paymentLabel: string;
  message: string;
}

export const OUTCOME_COPY: Record<RegistrationOutcome, OutcomeCopy> = {
  success: {
    title: 'REGISTRATION COMPLETED',
    registrationLabel: 'COMPLETED',
    paymentLabel: 'SUCCESSFUL',
    message: 'Your CyberSentinel 2K26 registration has been completed successfully.'
  },
  pending: {
    title: 'REGISTRATION FOUND',
    registrationLabel: 'CREATED',
    paymentLabel: 'PENDING',
    message:
      'Your registration is saved, but your payment is still pending. Complete the payment to confirm your registration.'
  },
  failed: {
    title: 'PAYMENT FAILED',
    registrationLabel: 'SUCCESSFUL',
    paymentLabel: 'FAILED',
    message:
      'Your registration was created successfully, but the payment was not completed successfully. Please complete the payment again to confirm your registration.'
  }
};
