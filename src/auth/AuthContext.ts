import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { BackendKind } from '../lib/supabase'
import type { SyncUiStatus } from '../utils/cloudProgress'

export type AuthContextValue = {
  configured: boolean
  backendKind: BackendKind
  loading: boolean
  session: Session | null
  user: User | null
  syncStatus: SyncUiStatus
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<string | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
