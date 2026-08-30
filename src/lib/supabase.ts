import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createLocalBackend } from './localBackend'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const rawAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
)?.trim()

/** Only accept a real https project URL (rejects empty / path-joined mistakes). */
function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false
  try {
    const parsed = new URL(value)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname.endsWith('.supabase.co') &&
      !parsed.hostname.includes('\\')
    )
  } catch {
    return false
  }
}

const url = isValidSupabaseUrl(rawUrl) ? rawUrl : undefined
const anonKey = rawAnonKey && rawAnonKey.length > 20 ? rawAnonKey : undefined

export type BackendKind = 'cloud' | 'local'

/** True only when real hosted Supabase env vars are present and valid. */
export function isSupabaseCloudConfigured(): boolean {
  return Boolean(url && anonKey)
}

/** Which backend `getSupabase()` returns: hosted cloud or the local shim. */
export function getBackendKind(): BackendKind {
  return isSupabaseCloudConfigured() ? 'cloud' : 'local'
}

/**
 * An auth + progress backend is always available now: hosted Supabase when
 * configured, otherwise a fully local (offline) shim. Kept for backwards
 * compatibility with existing call sites that gated auth/sync features.
 */
export function isSupabaseConfigured(): boolean {
  return true
}

let cloudClient: SupabaseClient | null = null
let localClient: SupabaseClient | null = null

/**
 * Returns the active backend. Uses hosted Supabase when configured; otherwise
 * a localStorage-backed shim so login + progress sync work fully offline.
 */
export function getSupabase(): SupabaseClient | null {
  if (isSupabaseCloudConfigured()) {
    if (!cloudClient) {
      cloudClient = createClient(url!, anonKey!, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    }
    return cloudClient
  }

  if (!localClient) {
    localClient = createLocalBackend() as unknown as SupabaseClient
  }
  return localClient
}
