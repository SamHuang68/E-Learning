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
      .then(() => loaded ??= loadExporter().catch(error => {
        loaded = undefined
        throw error
      }))
      .then(exporter => exporter[exportMethods[deck]]())
      .finally(() => { pending = undefined })
    return pending
  }
}

export const exportAnkiDeck = createAnkiExportLoader()
