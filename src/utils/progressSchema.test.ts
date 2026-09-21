import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  LEARNING_EVENT_SCHEMA_VERSION,
  PROGRESS_BUNDLE_VERSION,
  PROGRESS_SCHEMA_MIGRATION_NOTES,
  isAcceptedProgressBundleVersion,
  migrateLearningEvent,
} from './progressSchema'

describe('progress event schema v5', () => {
  it('bumps the local export version and keeps v1-v4 importable', () => {
    expect(PROGRESS_BUNDLE_VERSION).toBe(5)
    expect(LEARNING_EVENT_SCHEMA_VERSION).toBe(1)
    expect(isAcceptedProgressBundleVersion(1)).toBe(true)
    expect(isAcceptedProgressBundleVersion(4)).toBe(true)
    expect(isAcceptedProgressBundleVersion(5)).toBe(true)
    expect(isAcceptedProgressBundleVersion(6)).toBe(false)
  })

  it('migrates unversioned local events to v:1 without claiming cloud sync', () => {
    expect(migrateLearningEvent({ t: '2026-01-01T00:00:00.000Z', type: 'item_answer' })).toEqual({
      v: 1,
      t: '2026-01-01T00:00:00.000Z',
      type: 'item_answer',
    })
    expect(migrateLearningEvent({ v: 1, t: 't', type: 'review_complete', payload: { n: 1 } })?.payload).toEqual({
      n: 1,
    })
    expect(migrateLearningEvent({ v: 2, type: 'nope' })).toBeNull()
    expect(PROGRESS_SCHEMA_MIGRATION_NOTES.some((note) => note.includes('v5'))).toBe(true)
    expect(PROGRESS_SCHEMA_MIGRATION_NOTES.some((note) => /local-only|Not a cloud schema/i.test(note))).toBe(true)
    const docs = readFileSync(join(process.cwd(), 'docs/progress-schema.md'), 'utf8')
    expect(docs).toMatch(/localStorage/)
    expect(docs).toMatch(/Not.*hosted cloud API/i)
  })
})
