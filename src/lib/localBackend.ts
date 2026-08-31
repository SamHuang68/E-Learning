// A fully local, offline Supabase-compatible backend.
//
// It implements the small slice of the supabase-js surface this app uses
// (email/password auth + a single `user_progress` table) on top of
// `localStorage`, so login and progress "sync" work without any cloud
// project. This runs purely in the browser, so it is fully compatible with
// static hosting such as GitHub Pages. Data is per-browser (not shared
// across devices) — that is the trade-off versus a real Supabase cloud.

const USERS_KEY = 'local-backend:users'
const SESSION_KEY = 'local-backend:session'
const ROW_PREFIX = 'local-backend:user_progress:'

type StoredUser = { id: string; email: string; passwordHash: string }

export type LocalSessionUser = { id: string; email: string }
export type LocalSession = {
  access_token: string
  token_type: 'bearer'
  user: LocalSessionUser
}

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT'
type AuthListener = (event: AuthEvent, session: LocalSession | null) => void

type AuthResult = {
  data: { user: LocalSessionUser | null; session: LocalSession | null }
  error: { message: string } | null
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function readUsers(): StoredUser[] {
  const value = readJson<StoredUser[]>(USERS_KEY, [])
  return Array.isArray(value) ? value : []
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession(): LocalSession | null {
  return readJson<LocalSession | null>(SESSION_KEY, null)
}

/** SHA-256 when available (secure contexts: localhost + https), else a
 *  non-cryptographic fallback. This is a local demo store, not a security
 *  boundary — never reuse a real password here. */
async function hashPassword(password: string): Promise<string> {
  try {
    const subtle = globalThis.crypto?.subtle
    if (subtle) {
      const bytes = new TextEncoder().encode(password)
      const digest = await subtle.digest('SHA-256', bytes)
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    }
  } catch {
    /* fall through */
  }
  let hash = 5381
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash * 33) ^ password.charCodeAt(i)
  }
  return `djb2:${(hash >>> 0).toString(16)}`
}

function newId(): string {
  const cryptoObj = globalThis.crypto
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID()
  }
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`
}

function makeSession(user: StoredUser): LocalSession {
  return {
    access_token: `local-${user.id}`,
    token_type: 'bearer',
    user: { id: user.id, email: user.email },
  }
}

const listeners = new Set<AuthListener>()

function emit(event: AuthEvent, session: LocalSession | null): void {
  // Match supabase-js: notify listeners asynchronously.
  Promise.resolve().then(() => {
    listeners.forEach((fn) => fn(event, session))
  })
}

function setSession(session: LocalSession | null, event: AuthEvent): void {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
  emit(event, session)
}

/** Permanently remove one browser-local profile and its progress row. */
export function deleteLocalAccount(userId: string): boolean {
  const users = readUsers()
  if (!users.some((user) => user.id === userId)) return false
  writeUsers(users.filter((user) => user.id !== userId))
  localStorage.removeItem(ROW_PREFIX + userId)
  if (readSession()?.user.id === userId) setSession(null, 'SIGNED_OUT')
  return true
}

const auth = {
  async getSession(): Promise<{
    data: { session: LocalSession | null }
    error: null
  }> {
    return { data: { session: readSession() }, error: null }
  },

  async signUp({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase()
    const users = readUsers()
    if (users.some((u) => u.email === normalized)) {
      return {
        data: { user: null, session: null },
        error: { message: '此 Email 已註冊，請直接登入。' },
      }
    }
    const user: StoredUser = {
      id: newId(),
      email: normalized,
      passwordHash: await hashPassword(password),
    }
    users.push(user)
    writeUsers(users)
    const session = makeSession(user)
    setSession(session, 'SIGNED_IN')
    return { data: { user: session.user, session }, error: null }
  },

  async signInWithPassword({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase()
    const user = readUsers().find((u) => u.email === normalized)
    const passwordHash = await hashPassword(password)
    if (!user || user.passwordHash !== passwordHash) {
      return {
        data: { user: null, session: null },
        error: { message: 'Email 或密碼不正確。' },
      }
    }
    const session = makeSession(user)
    setSession(session, 'SIGNED_IN')
    return { data: { user: session.user, session }, error: null }
  },

  async signOut(): Promise<{ error: null }> {
    setSession(null, 'SIGNED_OUT')
    return { error: null }
  },

  onAuthStateChange(callback: AuthListener): {
    data: { subscription: { unsubscribe: () => void } }
  } {
    listeners.add(callback)
    return {
      data: {
        subscription: {
          unsubscribe() {
            listeners.delete(callback)
          },
        },
      },
    }
  },
}

type ProgressRow = { user_id: string } & Record<string, unknown>

function makeSelectBuilder() {
  let userId: string | null = null
  const builder = {
    eq(column: string, value: string) {
      if (column === 'user_id') userId = value
      return builder
    },
    async maybeSingle(): Promise<{
      data: ProgressRow | null
      error: { message: string } | null
    }> {
      try {
        const raw = userId ? localStorage.getItem(ROW_PREFIX + userId) : null
        return { data: raw ? (JSON.parse(raw) as ProgressRow) : null, error: null }
      } catch (err) {
        return { data: null, error: { message: String(err) } }
      }
    },
  }
  return builder
}

function from(_table: string) {
  return {
    select(_columns?: string) {
      return makeSelectBuilder()
    },
    async upsert(row: ProgressRow): Promise<{ error: { message: string } | null }> {
      try {
        localStorage.setItem(ROW_PREFIX + row.user_id, JSON.stringify(row))
        return { error: null }
      } catch (err) {
        return { error: { message: String(err) } }
      }
    },
  }
}

/** Structural subset of a SupabaseClient backed entirely by localStorage. */
export function createLocalBackend() {
  return { auth, from }
}

export type LocalBackend = ReturnType<typeof createLocalBackend>
