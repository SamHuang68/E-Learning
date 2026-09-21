import { describe, expect, it } from 'vitest'
import { sanitizeClientError } from './sanitizeClientError'

describe('sanitizeClientError', () => {
  it('keeps a safe auth hint that names Email but has no address', () => {
    expect(sanitizeClientError('Email 或密碼不正確。')).toBe('Email 或密碼不正確。')
  })

  it('does not echo emails, JWTs, bearer tokens, or user ids', () => {
    const fallback = 'safe'
    expect(
      sanitizeClientError('No user found for sam@example.com', fallback),
    ).toBe(fallback)
    expect(
      sanitizeClientError(
        'session eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aaa.bbb expired',
        fallback,
      ),
    ).toBe(fallback)
    expect(sanitizeClientError('bearer super-secret-token-value', fallback)).toBe(
      fallback,
    )
    expect(
      sanitizeClientError(
        'user_id 11111111-1111-4111-8111-111111111111 failed',
        fallback,
      ),
    ).toBe(fallback)
  })

  it('does not echo local paths or access_token query fragments', () => {
    const fallback = 'safe'
    expect(
      sanitizeClientError('read /Users/sam/Library/progress.json', fallback),
    ).toBe(fallback)
    expect(
      sanitizeClientError('callback?access_token=abc.def.ghi', fallback),
    ).toBe(fallback)
  })

  it('drops stack frames and local paths, and uses the fallback for long dumps', () => {
    const stacked = 'Boom\n    at AuthPanel (/Users/sam/app/AuthPanel.tsx:10:2)'
    expect(sanitizeClientError(stacked, 'safe')).toBe('Boom')
    expect(sanitizeClientError(stacked, 'safe')).not.toMatch(/Users/)
    expect(sanitizeClientError(new Error('x'.repeat(400)), 'safe')).toBe('safe')
  })
})
