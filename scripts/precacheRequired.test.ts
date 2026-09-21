import { describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  listPublicOfflineFiles,
  missingFromPrecache,
  missingRouteApps,
  REQUIRED_ASSET_PATTERNS,
  REQUIRED_SHELL_FILES,
} from './precacheRequired.mjs'

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public')

describe('precache required-entry gate', () => {
  it('fails with named misses when shell, audio, or archify paths are absent', () => {
    const required = [
      './index.html',
      './archify/git-mental-model.sequence.json',
      './audio/kana/a.mp3',
    ]
    expect(missingFromPrecache(['./index.html'], required)).toEqual([
      './archify/git-mental-model.sequence.json',
      './audio/kana/a.mp3',
    ])
    expect(missingFromPrecache(required, required)).toEqual([])
  })

  it('fails when a lazy Hub route chunk is missing from the manifest', () => {
    const files = REQUIRED_ROUTE_SAMPLE
    expect(missingRouteApps(files)).toEqual(['Chinese'])
    expect(missingRouteApps([...files, './assets/ChineseApp-abc.js'])).toEqual([])
  })

  it('lists public offline files so a dropped copy fails CI by name', async () => {
    const listed = await listPublicOfflineFiles(publicDir)
    expect(listed).toContain('./archify/git-mental-model.sequence.json')
    expect(listed).toContain('./audio/kana/a.mp3')
    expect(listed).toContain('./content/manifest.json')
    expect(listed.some((file) => file.startsWith('./audio/kana/') && file.endsWith('.mp3'))).toBe(true)
    expect(listed.filter((file) => file.startsWith('./archify/')).length).toBeGreaterThan(8)
    expect(missingFromPrecache(['./index.html'], listed).length).toBe(listed.length)
  })

  it('keeps shell files and hashed-asset patterns in the required set', () => {
    expect(REQUIRED_SHELL_FILES).toContain('./content/manifest.json')
    expect(REQUIRED_ASSET_PATTERNS.some((pattern) => pattern.test('./assets/index-xyz.js'))).toBe(true)
    expect(
      REQUIRED_ASSET_PATTERNS.some((pattern) =>
        pattern.test('./archify/git-mental-model.sequence.json'),
      ),
    ).toBe(true)
  })
})

const REQUIRED_ROUTE_SAMPLE = [
  './assets/AobaApp-1.js',
  './assets/ToeicApp-1.js',
  './assets/MathApp-1.js',
  './assets/CalculusApp-1.js',
  './assets/PhysicsApp-1.js',
  './assets/ChemistryApp-1.js',
  './assets/CsApp-1.js',
]
