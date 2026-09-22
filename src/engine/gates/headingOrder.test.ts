import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub and Aoba heading order', () => {
  it('Hub has one h1 and no skipped levels on primary chrome', () => {
    const hub = readFileSync(join(process.cwd(), 'src/Hub.tsx'), 'utf8')
    expect(hub.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(hub).toContain('<h2>')
    expect(hub).toContain('<h3>')
    expect(hub).not.toMatch(/<h[45]/)

    const radar = readFileSync(join(process.cwd(), 'src/components/KnowledgeRadar.tsx'), 'utf8')
    expect(radar).toContain('<h3>')
    expect(radar).not.toMatch(/<h[45]/)
  })

  it('Aoba shell keeps a single h1; practice chrome is h2', () => {
    const aoba = readFileSync(join(process.cwd(), 'src/aoba/AobaApp.tsx'), 'utf8')
    expect(aoba.match(/<h1[\s>]/g)).toHaveLength(1)
    const practice = readFileSync(join(process.cwd(), 'src/components/PracticeView.tsx'), 'utf8')
    expect(practice).toContain('<h2>')
    expect(practice).not.toMatch(/<h1[\s>]/)
  })
})
