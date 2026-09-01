import { describe, it, expect } from 'vitest'
import { Scratchpad } from './Scratchpad'
import { ScratchpadButton } from './ScratchpadButton'

describe('Scratchpad Component & Launcher', () => {
  it('exports Scratchpad as a valid React component', () => {
    expect(typeof Scratchpad).toBe('function')
  })

  it('exports ScratchpadButton as a valid React component', () => {
    expect(typeof ScratchpadButton).toBe('function')
  })
})
