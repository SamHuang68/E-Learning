import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getSupabase } from '../lib/supabase'
import {
  __setCloudProgressBackendForTests,
  getSyncStatus,
  hydrateFromCloud,
  setCloudUserId,
} from './cloudProgress'
import {
  defaultKanaProgress,
  defaultLearningMeta,
  defaultToeicProgress,
  loadToeicProgress,
  saveToeicProgress,
} from './storage'

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
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  }
}

type TableClient = {
  select: (columns?: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: () => Promise<{ data: unknown; error: { message: string } | null }>
    }
  }
  upsert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>
}

function wrapProgressBackend(
  innerClient: unknown,
  hooks: {
    beforeSelect?: () => Promise<void>
    mapSelect?: (result: { data: unknown; error: { message: string } | null }) => {
      data: unknown
      error: { message: string } | null
    }
    beforeUpsert?: (row: Record<string, unknown>) => Promise<void>
  },
) {
  const inner = innerClient as { from: (table: string) => TableClient }
  return {
    from(table: string) {
      const orig = inner.from(table)
      return {
        select(columns?: string) {
          const builder = orig.select(columns)
          return {
            eq(column: string, value: string) {
              const next = builder.eq(column, value)
              return {
                async maybeSingle() {
                  if (hooks.beforeSelect) await hooks.beforeSelect()
                  const result = await next.maybeSingle()
                  return hooks.mapSelect ? hooks.mapSelect(result) : result
                },
              }
            },
          }
        },
        async upsert(row: Record<string, unknown>) {
          if (hooks.beforeUpsert) await hooks.beforeUpsert(row)
          return orig.upsert(row)
        },
      }
    },
  }
}

beforeEach(() => {
  installBrowserGlobals()
})

afterEach(() => {
  __setCloudProgressBackendForTests(null)
  setCloudUserId(null)
})

describe('cloud progress honesty (Host Gate R1–R3)', () => {
  it('R1: upsert OK + stale SELECT with wrong XP must not mark synced', async () => {
    const userId = 'stale-read-user'
    saveToeicProgress({ ...defaultToeicProgress(), xp: 50 })
    const inner = getSupabase()!
    let upserted: Record<string, unknown> | null = null

    __setCloudProgressBackendForTests(
      wrapProgressBackend(inner, {
        mapSelect(result) {
          if (!upserted) return result
          return {
            error: null,
            data: {
              ...upserted,
              aoba: { ...(upserted.aoba as object), xp: 1 },
              toeic: { ...(upserted.toeic as object), xp: 1 },
            },
          }
        },
        async beforeUpsert(row) {
          upserted = row
        },
      }),
    )

    setCloudUserId(userId)
    const outcome = await hydrateFromCloud(userId)
    expect(outcome).toBe('error')
    expect(getSyncStatus()).not.toBe('synced')
    expect(getSyncStatus()).toBe('error')
  })

  it('R2: logout during delayed hydrate must not apply or upsert the stale session', async () => {
    const oldUser = 'old-hydrate-user'
    const inner = getSupabase()!
    await inner.from('user_progress').upsert({
      user_id: oldUser,
      aoba: { levelId: 'n5n4', unitId: 1, xp: 99, vocabDone: 0, readingDone: 0, grammarStarted: false },
      kana: defaultKanaProgress(),
      toeic: { ...defaultToeicProgress(), xp: 99 },
      lang: 'en',
      meta: defaultLearningMeta(),
      updated_at: new Date().toISOString(),
    })
    saveToeicProgress({ ...defaultToeicProgress(), xp: 7 })

    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    let started!: () => void
    const startedGate = new Promise<void>((resolve) => {
      started = resolve
    })
    let upsertedAfterLogout = false

    __setCloudProgressBackendForTests(
      wrapProgressBackend(inner, {
        async beforeSelect() {
          started()
          await gate
        },
        async beforeUpsert() {
          upsertedAfterLogout = true
        },
      }),
    )

    setCloudUserId(oldUser)
    const hydratePromise = hydrateFromCloud(oldUser)
    await startedGate
    setCloudUserId(null)
    expect(loadToeicProgress().xp).toBe(7)
    expect(getSyncStatus()).toBe('local-only')
    release()
    expect(await hydratePromise).toBe('skipped')
    expect(loadToeicProgress().xp).toBe(7)
    expect(getSyncStatus()).toBe('local-only')
    expect(upsertedAfterLogout).toBe(false)
    const still = await inner.from('user_progress').select('*').eq('user_id', oldUser).maybeSingle()
    expect((still.data as { toeic?: { xp?: number } } | null)?.toeic?.xp).toBe(99)
  })

  it('R3: local XP changes during blocked hydrate must be re-pushed before synced', async () => {
    const userId = 'dirty-during-hydrate'
    saveToeicProgress({ ...defaultToeicProgress(), xp: 10 })
    const inner = getSupabase()!

    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    let started!: () => void
    const startedGate = new Promise<void>((resolve) => {
      started = resolve
    })
    let firstUpsert = true
    const upsertedXp: number[] = []

    __setCloudProgressBackendForTests(
      wrapProgressBackend(inner, {
        async beforeUpsert(row) {
          const xp = Number((row.toeic as { xp?: number } | undefined)?.xp) || 0
          upsertedXp.push(xp)
          if (firstUpsert) {
            firstUpsert = false
            started()
            await gate
          }
        },
      }),
    )

    setCloudUserId(userId)
    const hydratePromise = hydrateFromCloud(userId)
    await startedGate
    saveToeicProgress({ ...defaultToeicProgress(), xp: 25 })
    release()
    const outcome = await hydratePromise
    expect(outcome).toBe('migrated')
    expect(getSyncStatus()).toBe('synced')
    expect(upsertedXp).toContain(10)
    expect(upsertedXp.at(-1)).toBe(25)
    const stored = await inner.from('user_progress').select('*').eq('user_id', userId).maybeSingle()
    expect((stored.data as { toeic?: { xp?: number } } | null)?.toeic?.xp).toBe(25)
  })
})
