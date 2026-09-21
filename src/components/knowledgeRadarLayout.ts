import type { TrackRadar } from '../engine/radar'

export const RADAR_GRID_LEVELS = [0.25, 0.5, 0.75, 1] as const

export function radarVertex(
  count: number,
  size: number,
  index: number,
  radiusRatio: number,
): { x: number; y: number } {
  const cx = size / 2
  const cy = size / 2
  const maxRadius = (size / 2) * 0.72
  const angle = index * ((2 * Math.PI) / count) - Math.PI / 2
  const r = maxRadius * radiusRatio
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

export function buildRadarLayout(radar: TrackRadar, size: number) {
  const dimensions = radar.dimensions
  const count = dimensions.length
  const cx = size / 2
  const cy = size / 2
  const grid = RADAR_GRID_LEVELS.map((lvl) =>
    Array.from({ length: count }, (_, i) => {
      const p = radarVertex(count, size, i, lvl)
      return `${p.x},${p.y}`
    }).join(' '),
  )
  const axes = Array.from({ length: count }, (_, i) => radarVertex(count, size, i, 1))
  const dataPoints = dimensions.map((d, i) => {
    const ratio = Math.max(0.1, d.score / d.fullMark)
    return radarVertex(count, size, i, ratio)
  })
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')
  const labels = dimensions.map((d, i) => {
    const p = radarVertex(count, size, i, 1.18)
    const isLeft = p.x < cx - 10
    const isRight = p.x > cx + 10
    const textAnchor: 'end' | 'start' | 'middle' = isLeft ? 'end' : isRight ? 'start' : 'middle'
    return { x: p.x, y: p.y, textAnchor, key: d.key, label: d.label, score: d.score }
  })
  return { cx, cy, count, grid, axes, dataPoints, polygonPoints, labels, dimensions }
}
