import { ChunkLoadError } from './chunkLoadError'

export type AnkiDeck = 'toeic' | 'ja' | 'math'

type AnkiExporter = Pick<typeof import('./ankiExporter'),
  'exportToeicChunksToAnki' | 'exportJapaneseSignalsToAnki' | 'exportMathSignalsToAnki'>

const exportMethods = {
  toeic: 'exportToeicChunksToAnki',
  ja: 'exportJapaneseSignalsToAnki',
  math: 'exportMathSignalsToAnki',
} as const

/** Load the banks on demand; concurrent clicks share one download operation. */
export function createAnkiExportLoader(
  loadExporter: () => Promise<AnkiExporter> = () => import('./ankiExporter'),
) {
  let loaded: Promise<AnkiExporter> | undefined
  let pending: Promise<void> | undefined

  return (deck: AnkiDeck): Promise<void> => {
    if (pending) return pending
    pending = Promise.resolve()
      .then(() => loaded ??= loadExporter().catch(cause => {
        // Browsers retain failed imports in the module map until the page reloads.
        throw new ChunkLoadError('Unable to load Anki exports. Reload to retry.', { cause })
      }))
      .then(exporter => exporter[exportMethods[deck]]())
      .finally(() => { pending = undefined })
    return pending
  }
}

export const exportAnkiDeck = createAnkiExportLoader()
