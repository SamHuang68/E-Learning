import { afterEach, expect, it, vi } from 'vitest'
import { isChunkLoadError } from '../utils/chunkLoadError'

afterEach(() => {
  vi.doUnmock('./stemVaultContentEn')
  vi.resetModules()
})

it('routes a rejected English content import to full-page reload recovery', async () => {
  vi.resetModules()
  vi.doMock('./stemVaultContentEn', () => { throw new TypeError('Importing a module script failed.') })
  const { loadStemVaultContentCopy } = await import('./stemVaultCopy')
  const promise = loadStemVaultContentCopy()
  const error = await promise.catch(error => error)
  expect(error).toBeInstanceOf(Error)
  expect(isChunkLoadError(error)).toBe(true)
  // Vitest wraps a failed mock factory; the original browser error stays in its cause chain.
  expect(error.cause.cause?.message ?? error.cause.message).toBe('Importing a module script failed.')
  expect(loadStemVaultContentCopy()).toBe(promise)
})
