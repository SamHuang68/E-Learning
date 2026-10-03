import { describe, expect, it, vi } from 'vitest'
import { createAnkiExportLoader } from './ankiExportLoader'

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

  it('clears a rejected load so the next click can retry without a download from the failed attempt', async () => {
    const exporter = makeExporter()
    const failure = new Error('Module request failed')
    const load = vi.fn().mockRejectedValueOnce(failure).mockResolvedValueOnce(exporter)
    const exportDeck = createAnkiExportLoader(load)

    await expect(exportDeck('math')).rejects.toBe(failure)
    for (const download of Object.values(exporter)) expect(download).not.toHaveBeenCalled()
    await exportDeck('math')
    expect(load).toHaveBeenCalledTimes(2)
    expect(exporter.exportMathSignalsToAnki).toHaveBeenCalledTimes(1)
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
