import { describe, it, expect } from 'vitest'
import {
  computeMathRadar,
  computeCalculusRadar,
  computeAobaRadar,
  computeToeicRadar,
} from './radar'

describe('Knowledge Radar Engine & Four Tracks Ability Model', () => {
  it('computes 5-dimension radar for Taiwan Math track', () => {
    const radar = computeMathRadar(['q1', 'q2', 'q3'], { exam1: 85 }, ['blocks', 'pythagoras'])
    expect(radar.track).toBe('math')
    expect(radar.dimensions).toHaveLength(5)
    expect(radar.averageScore).toBeGreaterThan(0)
    expect(radar.strongestDimension).toBeDefined()
    expect(radar.weakestDimension).toBeDefined()
  })

  it('computes 5-dimension radar for Calculus track', () => {
    const radar = computeCalculusRadar(0.8, 5, 4)
    expect(radar.track).toBe('calculus')
    expect(radar.trackName).toContain('微積分')
    expect(radar.dimensions).toHaveLength(5)
    expect(radar.dimensions.map((d) => d.key)).toEqual([
      'limits',
      'derivatives',
      'integrals',
      'ftc',
      'taylor',
    ])
    expect(radar.averageScore).toBeGreaterThanOrEqual(40)
  })

  it('computes 5-dimension radar for Aoba Japanese track', () => {
    const radar = computeAobaRadar(10, 5, 3, 7)
    expect(radar.track).toBe('ja')
    expect(radar.dimensions).toHaveLength(5)
    expect(radar.dimensions.map((d) => d.key)).toEqual([
      'kana',
      'vocab',
      'grammar',
      'keigo',
      'listening',
    ])
  })

  it('computes 5-dimension radar for TOEIC track', () => {
    const radar = computeToeicRadar(12, 6, 800)
    expect(radar.track).toBe('en')
    expect(radar.dimensions).toHaveLength(5)
    expect(radar.dimensions.map((d) => d.key)).toEqual([
      'chunks',
      'listening',
      'grammar',
      'reading',
      'vocab',
    ])
  })
})
