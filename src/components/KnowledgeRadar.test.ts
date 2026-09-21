import { describe, expect, it } from 'vitest'
import type { RadarDimension, TrackRadar } from '../engine/radar'
import { buildRadarLayout, radarVertex } from './knowledgeRadarLayout'

function dim(key: string, score: number): RadarDimension {
  return {
    key,
    label: key,
    score,
    fullMark: 100,
    description: key,
    status: score >= 70 ? 'proficient' : 'needs_work',
  }
}

function fixture(scores: number[]): TrackRadar {
  const dimensions = scores.map((score, i) => dim(`d${i}`, score))
  return {
    track: 'math',
    trackName: '數學',
    dimensions,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    strongestDimension: dimensions.reduce((a, b) => (a.score >= b.score ? a : b)),
    weakestDimension: dimensions.reduce((a, b) => (a.score <= b.score ? a : b)),
  }
}

describe('KnowledgeRadar layout memo helpers', () => {
  it('keeps four grid rings and one vertex per dimension', () => {
    const layout = buildRadarLayout(fixture([80, 40, 60, 20, 50]), 340)
    expect(layout.grid).toHaveLength(4)
    expect(layout.axes).toHaveLength(5)
    expect(layout.dataPoints).toHaveLength(5)
    expect(layout.labels).toHaveLength(5)
    expect(layout.polygonPoints.split(' ')).toHaveLength(5)
  })

  it('clamps a zero score to the inner 0.1 ring so the polygon stays visible', () => {
    const size = 340
    const layout = buildRadarLayout(fixture([0, 100]), size)
    const inner = radarVertex(2, size, 0, 0.1)
    const outer = radarVertex(2, size, 1, 1)
    expect(layout.dataPoints[0]?.x).toBeCloseTo(inner.x, 8)
    expect(layout.dataPoints[0]?.y).toBeCloseTo(inner.y, 8)
    expect(layout.dataPoints[1]?.x).toBeCloseTo(outer.x, 8)
    expect(layout.dataPoints[1]?.y).toBeCloseTo(outer.y, 8)
    expect(layout.dataPoints[0]?.y).not.toBe(size / 2)
  })

  it('is stable for the same radar and size', () => {
    const radar = fixture([10, 20, 30, 40, 50])
    const a = buildRadarLayout(radar, 340)
    const b = buildRadarLayout(radar, 340)
    expect(a.polygonPoints).toBe(b.polygonPoints)
    expect(a.grid).toEqual(b.grid)
  })
})
