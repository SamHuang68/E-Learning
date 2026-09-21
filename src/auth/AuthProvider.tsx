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
        if (!sb) return '尚未設定 Supabase（缺少環境變數）。'
        const { error } = await sb.auth.signInWithPassword({ email, password })
        return error ? sanitizeClientError(error.message, '') || null : null
      },
      async signUp(email, password) {
        const sb = getSupabase()
        if (!sb) return '尚未設定 Supabase（缺少環境變數）。'
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
          return '雲端帳號刪除需由 Supabase 帳號管理流程處理。'
        }
        const userId = session?.user?.id
        if (!userId) return '目前沒有已登入的本機帳號。'
        const deleted = deleteLocalProfile(userId)
        if (!deleted) return '找不到可刪除的本機帳號。'
        setCloudUserId(null)
        setSession(null)
        return null
      },
    }),
    [configured, loading, session, syncStatus],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
