import { describe, it, expect } from 'vitest'

/**
 * 圖論最短路徑模型：Dijkstra 與 Bellman-Ford 演算法
 */
export interface Edge {
  u: number
  v: number
  w: number
}

/**
 * Dijkstra 演算法 (非負權重邊)
 */
export function dijkstraShortestPath(
  numVertices: number,
  edges: Edge[],
  startNode: number,
): number[] {
  const dist = new Array(numVertices).fill(Infinity)
  const visited = new Array(numVertices).fill(false)
  dist[startNode] = 0

  for (let i = 0; i < numVertices; i++) {
    // 找出未訪問節點中距離最小者
    let u = -1
    let minDist = Infinity
    for (let j = 0; j < numVertices; j++) {
      if (!visited[j] && dist[j] < minDist) {
        minDist = dist[j]
        u = j
      }
    }

    if (u === -1 || minDist === Infinity) break
    visited[u] = true

    // 鬆弛 (Relaxation) 相鄰邊
    for (const edge of edges) {
      if (edge.u === u) {
        const v = edge.v
        if (dist[u] + edge.w < dist[v]) {
          dist[v] = dist[u] + edge.w
        }
      }
    }
  }

  return dist
}

/**
 * Bellman-Ford 演算法 (支援負權重邊與負權迴路偵測)
 */
export function bellmanFordShortestPath(
  numVertices: number,
  edges: Edge[],
  startNode: number,
): { dist: number[]; hasNegativeCycle: boolean } {
  const dist = new Array(numVertices).fill(Infinity)
  dist[startNode] = 0

  // 進行 V - 1 輪鬆弛
  for (let i = 1; i <= numVertices - 1; i++) {
    for (const edge of edges) {
      if (dist[edge.u] !== Infinity && dist[edge.u] + edge.w < dist[edge.v]) {
        dist[edge.v] = dist[edge.u] + edge.w
      }
    }
  }

  // 第 V 輪檢查是否存在負權迴路
  let hasNegativeCycle = false
  for (const edge of edges) {
    if (dist[edge.u] !== Infinity && dist[edge.u] + edge.w < dist[edge.v]) {
      hasNegativeCycle = true
      break
    }
  }

  return { dist, hasNegativeCycle }
}

describe('演算法與網路：Dijkstra 與 Bellman-Ford 最短路徑單元測試', () => {
  it('Dijkstra 演算法精準計算非負加權圖從起點至各節點之最短路徑', () => {
    // 4 節點圖：0 -> 1 (w=4), 0 -> 2 (w=1), 2 -> 1 (w=2), 1 -> 3 (w=1), 2 -> 3 (w=5)
    const edges: Edge[] = [
      { u: 0, v: 1, w: 4 },
      { u: 0, v: 2, w: 1 },
      { u: 2, v: 1, w: 2 },
      { u: 1, v: 3, w: 1 },
      { u: 2, v: 3, w: 5 },
    ]

    const dist = dijkstraShortestPath(4, edges, 0)

    // 起點 0: 0
    expect(dist[0]).toBe(0)
    // 到 2: 1
    expect(dist[2]).toBe(1)
    // 到 1: 0 -> 2 -> 1 (1 + 2 = 3 < 4)
    expect(dist[1]).toBe(3)
    // 到 3: 0 -> 2 -> 1 -> 3 (3 + 1 = 4)
    expect(dist[3]).toBe(4)
  })

  it('Bellman-Ford 演算法成功偵測包含負權迴路之網路並標記', () => {
    // 包含負權迴路的環：1 -> 2 (w=1), 2 -> 3 (w=-5), 3 -> 1 (w=2) => 環權重 1 - 5 + 2 = -2 < 0
    const edges: Edge[] = [
      { u: 0, v: 1, w: 2 },
      { u: 1, v: 2, w: 1 },
      { u: 2, v: 3, w: -5 },
      { u: 3, v: 1, w: 2 },
    ]

    const res = bellmanFordShortestPath(4, edges, 0)
    expect(res.hasNegativeCycle).toBe(true)
  })
})
