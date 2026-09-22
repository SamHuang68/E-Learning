import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Hub + each track shell. Dead TODO/FIXME here is leftover, not a plan. */
const TRACK_ENTRY_FILES = [
  'src/Hub.tsx',
  'src/App.tsx',
  'src/main.tsx',
  'src/math/MathApp.tsx',
  'src/calculus/CalculusApp.tsx',
  'src/physics/PhysicsApp.tsx',
  'src/chemistry/ChemistryApp.tsx',
  'src/cs/CsApp.tsx',
  'src/aoba/AobaApp.tsx',
  'src/toeic/ToeicApp.tsx',
  'src/chinese/ChineseApp.tsx',
] as const

const DEAD_MARKERS = /\b(TODO|FIXME|XXX|HACK)\b/

describe('track entry files have no dead TODO comments', () => {
  it('Hub, App, main, and every *App.tsx are free of TODO/FIXME/XXX/HACK', () => {
    const hits: string[] = []
    for (const file of TRACK_ENTRY_FILES) {
      const text = readFileSync(join(process.cwd(), file), 'utf8')
      text.split('\n').forEach((line, index) => {
        if (DEAD_MARKERS.test(line)) hits.push(`${file}:${index + 1}:${line.trim()}`)
      })
    }
    expect(hits, hits.join('\n')).toEqual([])
  })
})
