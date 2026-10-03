import { describe, it, expect } from 'vitest'
import { Scratchpad } from './Scratchpad'
import { ScratchpadButton } from './ScratchpadButton'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

describe('Scratchpad Component & Launcher', () => {
  it('exports Scratchpad as a valid React component', () => {
    expect(typeof Scratchpad).toBe('function')
  })

  it('exports ScratchpadButton as a valid React component', () => {
    expect(typeof ScratchpadButton).toBe('function')
  })

  it('exposes a labelled native dialog and drawing tool states', () => {
    const html = renderToStaticMarkup(React.createElement(Scratchpad, { id: 'practice-pad', isOpen: true, onClose() {} }))
    expect(html).toContain('<dialog')
    expect(html).toContain('aria-labelledby="practice-pad-title"')
    expect(html).toContain('aria-describedby="practice-pad-instructions"')
    expect(html).toContain('id="practice-pad-title"')
    expect(html).toContain('aria-modal="true"')
    expect(html).toContain('aria-pressed="true" aria-label="青藍筆"')
    expect(html).toContain('aria-pressed="false">橡皮擦</button>')
    expect(html).toContain('aria-label="手繪草稿區" role="img"')
  })

  it('does not expose a closed scratchpad in the document', () => {
    expect(renderToStaticMarkup(React.createElement(Scratchpad, { isOpen: false, onClose() {} }))).toBe('')
  })
})
