import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  getBackendKind,
  getSupabase,
  isSupabaseConfigured,
  type BackendKind,
} from '../lib/supabase'
import {
  flushCloudPush,
  hydrateFromCloud,
  setCloudUserId,
  subscribeSyncStatus,
  type SyncUiStatus,
} from '../utils/cloudProgress'

type AuthContextValue = {
  configured: boolean
  backendKind: BackendKind
  loading: boolean
  session: Session | null
  user: User | null
  syncStatus: SyncUiStatus
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [loading, setLoading] = useState(configured)
  const [session, setSession] = useState<Session | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncUiStatus>('local-only')
  const hydrateGen = useRef(0)

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
      const gen = ++hydrateGen.current
      setCloudUserId(userId)
      if (userId) {
        await hydrateFromCloud(userId)
        if (cancelled || gen !== hydrateGen.current) return
        window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
      }
      if (!cancelled && gen === hydrateGen.current) setLoading(false)
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
        return error?.message ?? null
      },
      async signUp(email, password) {
        const sb = getSupabase()
        if (!sb) return '尚未設定 Supabase（缺少環境變數）。'
        const { error } = await sb.auth.signUp({ email, password })
        return error?.message ?? null
      },
      async signOut() {
        await flushCloudPush()
        setCloudUserId(null)
        const sb = getSupabase()
        if (sb) await sb.auth.signOut()
        setSession(null)
      },
    }),
    [configured, loading, session, syncStatus],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
