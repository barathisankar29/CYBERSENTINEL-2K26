import { functionUrl, registrationConfig, rpcUrl } from './config'
import type {
  CheckRegistrationResponse,
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

/** POST functions/v1/public-register (multipart/form-data) */
export async function submitRegistration(input: PublicRegisterInput): Promise<PublicRegisterResponse> {
  const form = new FormData()
  form.append('name', input.name.trim())
  form.append('email', input.email.trim())
  form.append('phone', input.phone.trim())
  form.append('college', input.college.trim())
  form.append('department', input.department.trim())
  form.append('year', input.year.trim())
  form.append('utr', input.utr.trim())
  form.append('selected_day', input.selectedDay)
  form.append('special_event_codes', JSON.stringify(input.specialEventCodes))
  form.append('payment_screenshot', input.paymentScreenshot)
  return send<PublicRegisterResponse>(
    functionUrl('public-register'),
    { method: 'POST', body: form },
    'Registration failed.',
  )
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
    team_name: input.teamName,
  })
}
