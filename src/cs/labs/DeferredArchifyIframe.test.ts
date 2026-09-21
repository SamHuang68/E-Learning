import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { attachArchifyIframeObserver } from './deferredArchifyObserver'

describe('DeferredArchifyIframe', () => {
  it('calls onEnter immediately when IntersectionObserver is missing', () => {
    const original = globalThis.IntersectionObserver
    // @ts-expect-error test the no-IO path
    delete globalThis.IntersectionObserver
    const onEnter = vi.fn()
    const stop = attachArchifyIframeObserver({} as Element, onEnter)
    expect(onEnter).toHaveBeenCalledTimes(1)
    stop()
    globalThis.IntersectionObserver = original
  })

  it('observes the slot and fires onEnter on first intersection', () => {
    const disconnect = vi.fn()
    const observe = vi.fn()
    const box: { cb: ((entries: Array<{ isIntersecting: boolean }>) => void) | null } = { cb: null }
    class FakeIO {
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        box.cb = cb
      }
      observe = observe
      disconnect = disconnect
      unobserve = vi.fn()
      takeRecords = () => []
      root = null
      rootMargin = ''
      thresholds = []
    }
    const original = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver
    const onEnter = vi.fn()
    const node = {} as Element
    const stop = attachArchifyIframeObserver(node, onEnter)
    expect(observe).toHaveBeenCalledWith(node)
    expect(onEnter).not.toHaveBeenCalled()
    box.cb?.([{ isIntersecting: true }])
    expect(onEnter).toHaveBeenCalledTimes(1)
    stop()
    expect(disconnect).toHaveBeenCalled()
    globalThis.IntersectionObserver = original
  })

  it('wires the CS lab to a deferred iframe with loading=lazy', () => {
    const lab = readFileSync(join(process.cwd(), 'src/cs/labs/ArchifyHardwareMap.tsx'), 'utf8')
    const slot = readFileSync(join(process.cwd(), 'src/cs/labs/DeferredArchifyIframe.tsx'), 'utf8')
    const observer = readFileSync(join(process.cwd(), 'src/cs/labs/deferredArchifyObserver.ts'), 'utf8')
    expect(lab).toContain('DeferredArchifyIframe')
    expect(lab).not.toMatch(/<iframe[\s\S]*src=\{diagramMeta\.file\}/)
    expect(slot).toContain('loading="lazy"')
    expect(observer).toContain('IntersectionObserver')
    expect(slot).toContain("t('cs.archify.iframe.pending')")
  })
})
