import { describe, expect, it, vi } from 'vitest'
import { createAnkiExportLoader } from './ankiExportLoader'
import { ChunkLoadError } from './chunkLoadError'

const makeExporter = () => ({
  exportToeicChunksToAnki: vi.fn(),
  exportJapaneseSignalsToAnki: vi.fn(),
  exportMathSignalsToAnki: vi.fn(),
})

describe('click-time Anki exports', () => {
  it('does not load any exporter until an export is requested', async () => {
    const exporter = makeExporter()
    const load = vi.fn().mockResolvedValue(exporter)
    const exportDeck = createAnkiExportLoader(load)
    expect(load).not.toHaveBeenCalled()

    await exportDeck('toeic')
    expect(load).toHaveBeenCalledTimes(1)
    expect(exporter.exportToeicChunksToAnki).toHaveBeenCalledTimes(1)
  })

  it('shares the pending operation so repeated clicks cannot download twice', async () => {
    const exporter = makeExporter()
    let resolve!: (value: typeof exporter) => void
    const loading = new Promise<typeof exporter>(done => { resolve = done })
    const load = vi.fn(() => loading)
    const exportDeck = createAnkiExportLoader(load)

    const first = exportDeck('toeic')
    const repeated = exportDeck('toeic')
    const otherButton = exportDeck('ja')
    expect(repeated).toBe(first)
    expect(otherButton).toBe(first)
    await Promise.resolve()
    expect(load).toHaveBeenCalledTimes(1)
    expect(exporter.exportToeicChunksToAnki).not.toHaveBeenCalled()

    resolve(exporter)
    await Promise.all([first, repeated, otherButton])
    expect(exporter.exportToeicChunksToAnki).toHaveBeenCalledTimes(1)
    expect(exporter.exportJapaneseSignalsToAnki).not.toHaveBeenCalled()
  })

  it('reuses the loaded module while allowing later exports of every deck', async () => {
    const exporter = makeExporter()
    const load = vi.fn().mockResolvedValue(exporter)
    const exportDeck = createAnkiExportLoader(load)

    await exportDeck('toeic')
    await exportDeck('ja')
    await exportDeck('math')
    expect(load).toHaveBeenCalledTimes(1)
    for (const download of Object.values(exporter)) expect(download).toHaveBeenCalledTimes(1)
  })

  it('classifies a failed import with its cause and releases the pending operation without pretending to reload the module', async () => {
    const failure = new Error('Module request failed')
    const load = vi.fn().mockRejectedValue(failure)
    const exportDeck = createAnkiExportLoader(load)

    const first = exportDeck('math')
    const error = await first.catch(error => error)
    expect(error).toBeInstanceOf(ChunkLoadError)
    expect(error.cause).toBe(failure)
    const next = exportDeck('math')
    expect(next).not.toBe(first)
    await expect(next).rejects.toBe(error)
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('releases a failed download operation so the loaded exporter can be retried', async () => {
    const exporter = makeExporter()
    const failure = new Error('Download could not start')
    exporter.exportJapaneseSignalsToAnki.mockImplementationOnce(() => { throw failure })
    const load = vi.fn().mockResolvedValue(exporter)
    const exportDeck = createAnkiExportLoader(load)

    await expect(exportDeck('ja')).rejects.toBe(failure)
    await exportDeck('ja')
    expect(load).toHaveBeenCalledTimes(1)
    expect(exporter.exportJapaneseSignalsToAnki).toHaveBeenCalledTimes(2)
  })
})
