import { TEST_REGISTRATION_FEE } from '@/config/registrationTestFee'
import { functionUrl, registrationConfig, rpcUrl } from './config'
import type {
  ActiveEvent,
  CheckRegistrationResponse,
  PaymentProcessInput,
  PublicRegisterInput,
  PublicRegisterResponse,
  RegistrationFees,
  SpecialEvent,
  TeamCreateInput,
  TeamCreateResponse,
  TeamVerifyResponse,
} from './types'

/**
 * Thin client for the backend team's Supabase Edge Functions. Requests,
 * payload field names and error handling match their reference client
 * (register2/js/registration.js, checking.js, team.js) exactly — the Edge
 * Functions remain the source of truth for validation and business rules.
 */

export class RegistrationApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'RegistrationApiError'
    this.status = status
  }
}

function assertConfigured() {
  if (!registrationConfig.isConfigured) {
    throw new RegistrationApiError(
      'Registration is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      0,
    )
  }
}

async function send<T>(url: string, init: RequestInit, fallbackError: string): Promise<T> {
  assertConfigured()
  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${registrationConfig.anonKey}`, ...init.headers },
    })
  } catch {
    throw new RegistrationApiError('Network error. Check your connection and try again.', 0)
  }
  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    // Non-JSON body (e.g. gateway error) — fall through to the generic message.
  }
  if (!response.ok) {
    const message = (data as { error?: string } | null)?.error || fallbackError
    throw new RegistrationApiError(message, response.status)
  }
  return data as T
}

/** GET functions/v1/get-registration-fees */
export async function getRegistrationFees(): Promise<RegistrationFees> {
  const data = await send<Partial<RegistrationFees>>(
    functionUrl('get-registration-fees'),
    { method: 'GET' },
    'Unable to load registration fees.',
  )
  return { DAY_1: Number(data.DAY_1 || 0), DAY_2: Number(data.DAY_2 || 0) }
}

/** POST rest/v1/rpc/get_special_events */
export async function getSpecialEvents(): Promise<SpecialEvent[]> {
  const data = await send<unknown>(
    rpcUrl('get_special_events'),
    { method: 'POST', headers: { apikey: registrationConfig.anonKey } },
    'Unable to load special events.',
  )
  return Array.isArray(data) ? (data as SpecialEvent[]) : []
}

/**
 * GET rest/v1/events — ACTIVE events, the same query register2's
 * registration.js runs to build the per-day event checklist.
 */
export async function getActiveEvents(): Promise<ActiveEvent[]> {
  let response: Response
  assertConfigured()
  try {
    response = await fetch(
      `${registrationConfig.supabaseUrl}/rest/v1/events?select=id,code,name,day,event_type,status&status=eq.ACTIVE&order=day,code`,
      { headers: { apikey: registrationConfig.anonKey, Authorization: `Bearer ${registrationConfig.anonKey}` } },
    )
  } catch {
    throw new RegistrationApiError('Events are temporarily unavailable. Please try again later.', 0)
  }
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = (data as { message?: string } | null)?.message || 'Unable to load events.'
    throw new RegistrationApiError(message, response.status)
  }
  return Array.isArray(data) ? (data as ActiveEvent[]) : []
}

/**
 * POST functions/v1/public-register (multipart/form-data). Field names,
 * trimming and JSON-encoded arrays are exactly register2's registration.js.
 */
export async function submitRegistration(input: PublicRegisterInput): Promise<PublicRegisterResponse> {
  const form = new FormData()
  form.append('name', input.name.trim())
  form.append('email', input.email.trim())
  form.append('phone', input.phone.trim())
  form.append('college', input.college.trim())
  form.append('department', input.department.trim())
  form.append('year', input.year.trim())
  form.append('selected_day', input.selectedDay)
  form.append('selected_event_ids', JSON.stringify(input.selectedEventIds))
  form.append('special_event_codes', JSON.stringify(input.specialEventCodes))
  return send<PublicRegisterResponse>(
    functionUrl('public-register'),
    { method: 'POST', body: form },
    'Registration failed.',
  )
}

/** The college's payment process that register2 hands every registration to. */
export const PAYMENT_PROCESS_URL = 'https://apps.veltech.edu.in/clique/CybersentinelProcess'

/**
 * Leaves the site for the payment process exactly as register2 does: a
 * top-level multipart POST form with email, day and registration_fee.
 */
export function submitToPaymentProcess({ email, day, registrationFee }: PaymentProcessInput): void {
  const fields: [string, string][] = [
    ['email', email],
    ['day', day],
    // TEMPORARY test price (src/config/registrationTestFee.ts) while it is set.
    ['registration_fee', String(TEST_REGISTRATION_FEE ?? registrationFee)],
  ]
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = PAYMENT_PROCESS_URL
  form.enctype = 'multipart/form-data'
  for (const [name, value] of fields) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.append(input)
  }
  document.body.append(form)
  form.submit()
}

/**
 * Amount for the "Pay Payment" button on a found registration — register2's
 * checking.js logic: the recorded payment amount, else the special events'
 * fees (SPECIAL), else the configured day fee(s).
 */
export async function resolvePaymentAmount(record: CheckRegistrationResponse): Promise<number> {
  let amount = record.payment?.amount == null ? Number.NaN : Number(record.payment.amount)
  if (!Number.isFinite(amount)) {
    const day = record.registration.selected_day
    if (day === 'SPECIAL') {
      if (!record.special_events.length) throw new RegistrationApiError('Unable to determine the special-event payment amount.', 0)
      amount = record.special_events.reduce((total, event) => total + Number(event.fee || 0), 0)
    } else {
      const fees = await getRegistrationFees()
      amount = day === 'BOTH' ? fees.DAY_1 + fees.DAY_2 : fees[day]
    }
  }
  if (!Number.isFinite(amount)) throw new RegistrationApiError('Unable to determine the payment amount.', 0)
  return amount
}

/** POST functions/v1/check-registration */
export async function checkRegistration(email: string, phone: string): Promise<CheckRegistrationResponse> {
  return send<CheckRegistrationResponse>(
    functionUrl('check-registration'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    },
    'Unable to check registration.',
  )
}

async function teamRequest<T>(body: Record<string, unknown>): Promise<T> {
  return send<T>(
    functionUrl('team-management'),
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    'Team request failed.',
  )
}

/** team-management { action: 'verify' } — fails unless payment VERIFIED + registration CONFIRMED. */
export function verifyTeamMember(identity: string): Promise<TeamVerifyResponse> {
  return teamRequest<TeamVerifyResponse>({ action: 'verify', identity })
}

/** team-management { action: 'create' } */
export function createTeam(input: TeamCreateInput): Promise<TeamCreateResponse> {
  return teamRequest<TeamCreateResponse>({
    action: 'create',
    identity: input.identity,
    members: input.members,
    day: input.day,
    package_id: input.packageId,
    team_size: input.teamSize,
    team_name: input.teamName,
  })
}
