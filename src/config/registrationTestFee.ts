/**
 * TEMPORARY test price.
 *
 * While this is a number, every registration hands the payment process this
 * amount as `registration_fee` (instead of the backend's base fee) and every
 * price on the site is shown from it — so the registration / payment / status
 * flow can be tested end to end for a token amount.
 *
 * Set back to `null` and redeploy to restore the real backend fees.
 * The backend itself is not changed; its records keep the real base fee.
 */
export const TEST_REGISTRATION_FEE: number | null = null
