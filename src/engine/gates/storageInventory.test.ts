import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { LOCAL_PREFERENCE_KEYS, PROGRESS_STORAGE_KEYS } from '../../utils/progressKeys'
import { UI_LOCALE_KEY } from '../../i18n/locale'

describe('cookie / localStorage inventory', () => {
  it('documents real keys and local-only honesty; no first-party cookies', () => {
    const docs = readFileSync(join(process.cwd(), 'docs/cookie-localstorage-inventory.md'), 'utf8')
    expect(docs).toMatch(/No.*first-party cookies/i)
    expect(docs).toMatch(/document\.cookie/)
    expect(docs).toMatch(/local-only|this-browser/i)
    expect(docs).toContain(PROGRESS_STORAGE_KEYS.math)
    expect(docs).toContain(PROGRESS_STORAGE_KEYS.chinese)
    expect(docs).toContain(PROGRESS_STORAGE_KEYS.csSignals)
    expect(docs).toContain(LOCAL_PREFERENCE_KEYS.accessibility)
    expect(docs).toContain(UI_LOCALE_KEY)
    expect(docs).toContain('aoba-progress')
    expect(docs).toContain('toeic-progress')
    expect(docs).toContain('e-learning-meta')
    expect(docs).toContain('local-backend:users')
    expect(docs).toContain('aoba-groq-key')
    expect(docs).not.toMatch(/document\.cookie\s*=/)
  })
})
