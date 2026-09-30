import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  getBackendKind,
  getSupabase,
  isSupabaseConfigured,
} from '../lib/supabase'
import { deleteLocalProfile } from './deleteLocalProfile'
import {
  flushCloudPush,
  getCloudSessionGeneration,
  hydrateFromCloud,
  setCloudUserId,
  subscribeSyncStatus,
  type SyncUiStatus,
} from '../utils/cloudProgress'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { sanitizeClientError } from '../utils/sanitizeClientError'
import { loadUiLocale } from '../i18n/locale'
import { translate } from '../i18n/messages'

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [loading, setLoading] = useState(configured)
  const [session, setSession] = useState<Session | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncUiStatus>('local-only')

  useEffect(() => subscribeSyncStatus(setSyncStatus), [])

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    const sb = getSupabase()
    if (!sb) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function applySession(next: Session | null) {
      setSession(next)
      const userId = next?.user?.id ?? null
      setCloudUserId(userId)
      const gen = getCloudSessionGeneration()
      if (userId) {
        const outcome = await hydrateFromCloud(userId, gen)
        if (cancelled || gen !== getCloudSessionGeneration()) return
        if (outcome !== 'error' && outcome !== 'skipped') {
          window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
        }
      }
      if (!cancelled && gen === getCloudSessionGeneration()) setLoading(false)
    }

    void sb.auth.getSession().then(({ data }) => {
      if (!cancelled) void applySession(data.session)
    })

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, next) => {
      void applySession(next)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [configured])

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      backendKind: getBackendKind(),
      loading,
      session,
      user: session?.user ?? null,
      syncStatus,
      async signIn(email, password) {
        const sb = getSupabase()
        if (!sb) return translate(loadUiLocale(), 'auth.missingConfig')
        const { error } = await sb.auth.signInWithPassword({ email, password })
        return error ? sanitizeClientError(error.message, '') || null : null
      },
      async signUp(email, password) {
        const sb = getSupabase()
        if (!sb) return translate(loadUiLocale(), 'auth.missingConfig')
        const { error } = await sb.auth.signUp({ email, password })
        return error ? sanitizeClientError(error.message, '') || null : null
      },
      async signOut() {
        await flushCloudPush()
        setCloudUserId(null)
        const sb = getSupabase()
        if (sb) await sb.auth.signOut()
        setSession(null)
      },
      async deleteAccount() {
        if (getBackendKind() !== 'local') {
          return translate(loadUiLocale(), 'auth.deleteCloudBlocked')
        }
        const userId = session?.user?.id
        if (!userId) return translate(loadUiLocale(), 'auth.deleteNoLocal')
        const deleted = deleteLocalProfile(userId)
        if (!deleted) return translate(loadUiLocale(), 'auth.deleteMissingLocal')
        setCloudUserId(null)
        setSession(null)
        return null
      },
    }),
    [configured, loading, session, syncStatus],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
