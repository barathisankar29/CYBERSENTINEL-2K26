/**
 * Browser-safe Supabase configuration for the registration backend.
 *
 * Only the project URL and the public anon key belong here — the backend's
 * Edge Functions hold the service-role key server-side. Never add a
 * service-role key or any other secret to a VITE_* variable: everything
 * prefixed VITE_ is bundled into the public JavaScript.
 */
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? ''

export const registrationConfig = {
  supabaseUrl: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
}

export function functionUrl(name: string): string {
  return `${registrationConfig.supabaseUrl}/functions/v1/${name}`
}

export function rpcUrl(name: string): string {
  return `${registrationConfig.supabaseUrl}/rest/v1/rpc/${name}`
}
