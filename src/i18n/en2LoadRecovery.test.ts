import { afterEach, expect, it, vi } from 'vitest'
import { isChunkLoadError } from '../utils/chunkLoadError'

afterEach(() => {
  vi.doUnmock('./chemistryConceptContentEn')
  vi.doUnmock('./calculusContentEn')
  vi.resetModules()
})

it('failed STEM concept imports require page reload recovery', async () => {
  vi.resetModules()
  vi.doMock('./chemistryConceptContentEn', () => { throw new TypeError('Importing a module script failed.') })
  const { loadStemConceptCopy } = await import('./stemConceptCopy')
  const error = await loadStemConceptCopy().catch(error => error)
  expect(isChunkLoadError(error)).toBe(true)
  expect(error.cause).toBeInstanceOf(Error)
})

it('failed calculus imports require page reload recovery', async () => {
  vi.resetModules()
  vi.doMock('./calculusContentEn', () => { throw new TypeError('Importing a module script failed.') })
  const { loadCalculusCopy } = await import('./calculusCopy')
  const error = await loadCalculusCopy().catch(error => error)
  expect(isChunkLoadError(error)).toBe(true)
  expect(error.cause).toBeInstanceOf(Error)
})
