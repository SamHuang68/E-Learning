import { describe, expect, it } from 'vitest'
import { stemVaultCopy } from '../../i18n/stemVaultCopy'

const modules = import.meta.glob('./MathErrorVault.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const source = modules['./MathErrorVault.tsx']

describe('Math Error Vault locale and dialog state contracts', () => {
  it('stores only the selected question id and re-localizes from the current locale', () => {
    expect(source).toContain('useState<string | null>(null)')
    expect(source).toContain('rawQuestionsById.get(selectedQuestionId)')
    expect(source).toContain('localizeMathQuestion(selectedRawQuestion, locale)')
    expect(source).toContain('setSelectedQuestionId(q.id)')
    expect(source).not.toContain('useState<MathQuestion | null>')
    expect(source).not.toContain('setSelectedQ(q)')
  })

  it('uses a native modal dialog and restores focus to the retry trigger', () => {
    expect(source).toContain('dialog.showModal()')
    expect(source).toContain('aria-modal="true"')
    expect(source).toContain('onCancel={(event) =>')
    expect(source).toContain('retryTrigger.isConnected')
    expect(source).toContain('vaultHeadingRef.current?.focus()')
  })

  it('cancels delayed closure before a later retry dialog can open', () => {
    expect(source).toContain('closeTimerRef')
    expect(source).toContain('clearTimeout(closeTimerRef.current)')
    expect(source).toContain('cancelScheduledClose()')
  })

  it('exposes option selection and correction feedback to assistive technology', () => {
    expect(source).toContain('aria-pressed={testInput === String(idx)}')
    expect(source).toContain('className="feedback-badge correct" role="status"')
    expect(source).toContain('className="feedback-badge wrong" role="alert"')
  })

  it('keeps every related-lab label in one canonical source language until display', () => {
    const labels = [...source.matchAll(/labInfo = \{ name: '([^']+)', tab: '[^']+' \}/g)]
      .map(match => match[1])

    expect(labels).toHaveLength(5)
    for (const label of labels) {
      expect(stemVaultCopy('zh-Hant', label)).toBe(label)
      expect(stemVaultCopy('en', label)).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
    }
    expect(source).not.toContain("name: locale === 'en'")
  })
})
