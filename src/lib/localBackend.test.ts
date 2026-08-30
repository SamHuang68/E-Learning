import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createLocalBackend } from './localBackend'
import { getBackendKind, getSupabase, isSupabaseCloudConfigured } from './supabase'
import {
  hydrateFromCloud,
  pushProgressNow,
  setCloudUserId,
} from '../utils/cloudProgress'
import {
  applyCloudBundle,
  defaultKanaProgress,
  defaultLearningMeta,
  defaultToeicProgress,
  loadToeicProgress,
  saveToeicProgress,
} from '../utils/storage'

class MemoryStorage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null
  }
  getItem(key: string) {
    return this.store.has(key) ? (this.store.get(key) as string) : null
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }
  removeItem(key: string) {
    this.store.delete(key)
  }
  clear() {
    this.store.clear()
  }
}

function installBrowserGlobals() {
  ;(globalThis as unknown as { localStorage: Storage }).localStorage =
    new MemoryStorage() as unknown as Storage
  ;(globalThis as unknown as { window: unknown }).window = {
    location: { hash: '' },
  }
}

beforeEach(() => {
  installBrowserGlobals()
})

afterEach(() => {
  setCloudUserId(null)
})

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('local backend selection', () => {
  it('uses the local backend when no cloud env is configured', () => {
    expect(isSupabaseCloudConfigured()).toBe(false)
    expect(getBackendKind()).toBe('local')
    expect(getSupabase()).not.toBeNull()
  })
})

describe('local backend auth', () => {
  it('signs up, persists a session, signs in, and rejects bad passwords', async () => {
    const sb = createLocalBackend()

    // No session before sign up.
    expect((await sb.auth.getSession()).data.session).toBeNull()

    const signUp = await sb.auth.signUp({
      email: 'Tester@Local.Test',
      password: 'local123',
    })
    expect(signUp.error).toBeNull()
    expect(signUp.data.session?.user.email).toBe('tester@local.test')
    const userId = signUp.data.session!.user.id
    expect(userId).toBeTruthy()

    // Session persists (this is what survives a page reload).
    const persisted = (await sb.auth.getSession()).data.session
    expect(persisted?.user.id).toBe(userId)

    // Duplicate email is rejected.
    const dup = await sb.auth.signUp({
      email: 'tester@local.test',
      password: 'other999',
    })
    expect(dup.error?.message).toContain('已註冊')

    // Sign out clears the session.
    await sb.auth.signOut()
    expect((await sb.auth.getSession()).data.session).toBeNull()

    // Wrong password fails.
    const bad = await sb.auth.signInWithPassword({
      email: 'tester@local.test',
      password: 'wrongpass',
    })
    expect(bad.error).not.toBeNull()
    expect(bad.data.session).toBeNull()

    // Correct password (case-insensitive email) restores the same user id.
    const good = await sb.auth.signInWithPassword({
      email: 'TESTER@local.test',
      password: 'local123',
    })
    expect(good.error).toBeNull()
    expect(good.data.session?.user.id).toBe(userId)
  })

  it('emits auth state changes to subscribers', async () => {
    const sb = createLocalBackend()
    const events: string[] = []
    const { data } = sb.auth.onAuthStateChange((event) => {
      events.push(event)
    })

    await sb.auth.signUp({ email: 'evt@local.test', password: 'local123' })
    await tick()
    await sb.auth.signOut()
    await tick()

    expect(events).toEqual(['SIGNED_IN', 'SIGNED_OUT'])
    data.subscription.unsubscribe()
  })
})

describe('local user_progress table', () => {
  it('upserts and reads back a row per user', async () => {
    const sb = createLocalBackend()
    const row = {
      user_id: 'user-1',
      aoba: { xp: 7 },
      updated_at: new Date().toISOString(),
    }
    expect((await sb.from('user_progress').upsert(row)).error).toBeNull()

    const read = await sb
      .from('user_progress')
      .select('user_id, aoba, updated_at')
      .eq('user_id', 'user-1')
      .maybeSingle()
    expect(read.error).toBeNull()
    expect(read.data).toMatchObject({ user_id: 'user-1', aoba: { xp: 7 } })

    // Unknown user returns null (not an error).
    const missing = await sb
      .from('user_progress')
      .select('*')
      .eq('user_id', 'nobody')
      .maybeSingle()
    expect(missing.error).toBeNull()
    expect(missing.data).toBeNull()
  })
})

describe('progress sync via cloudProgress (offline)', () => {
  it('migrates local progress on first login, then restores it on next login', async () => {
    const userId = 'sync-user'

    // Seed some local progress (as if earned while signed out).
    saveToeicProgress({ ...defaultToeicProgress(), xp: 50, vocabDone: 4 })
    expect(loadToeicProgress().xp).toBe(50)

    // First login: no cloud row yet -> migrate local up to the backend.
    const first = await hydrateFromCloud(userId)
    expect(first).toBe('migrated')

    // A write-through push after more progress.
    saveToeicProgress({ ...loadToeicProgress(), xp: 75 })
    expect(await pushProgressNow()).toBe(true)

    // Simulate a fresh device/browser: wipe local back to defaults.
    applyCloudBundle({
      aoba: {
        levelId: 'n5n4',
        unitId: 1,
        xp: 0,
        vocabDone: 0,
        readingDone: 0,
        grammarStarted: false,
      },
      kana: defaultKanaProgress(),
      toeic: defaultToeicProgress(),
      lang: 'hub',
      meta: defaultLearningMeta(),
    })
    expect(loadToeicProgress().xp).toBe(0)

    // Second login: row exists -> pull it back down, restoring progress.
    const second = await hydrateFromCloud(userId)
    expect(second).toBe('pulled')
    expect(loadToeicProgress().xp).toBe(75)
  })
})
