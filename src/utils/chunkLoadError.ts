/** A lazy module failure requires a page reload to reset browser module caches. */
export class ChunkLoadError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ChunkLoadError'
  }
}

export function isChunkLoadError(error: Error): boolean {
  return error.name === 'ChunkLoadError' || [
    'dynamically imported module',
    'Failed to fetch',
    'Loading chunk',
    'Importing a module script failed',
  ].some(message => error.message.includes(message))
}
