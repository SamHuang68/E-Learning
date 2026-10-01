import { describe, expect, it } from 'vitest'
import { ChunkLoadError, isChunkLoadError } from './chunkLoadError'

describe('lazy module recovery', () => {
  it('recognizes typed failures independently of the browser error message', () => {
    const cause = new TypeError('Importing a module script failed.')
    const error = new ChunkLoadError('Unable to load English question content.', { cause })
    expect(error.cause).toBe(cause)
    expect(isChunkLoadError(error)).toBe(true)
  })
  it('recognizes Safari failures and preserves ordinary in-place retries', () => {
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true)
    expect(isChunkLoadError(new Error('Unexpected input'))).toBe(false)
  })
})
