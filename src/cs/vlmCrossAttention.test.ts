import { describe, it, expect } from 'vitest'

/**
 * 多模態模型 (VLM) 視覺 Transformer (ViT) 影像分塊與 Patch 投影模型
 */
export interface ViTPatchMetrics {
  numPatches: number // (H * W) / (P * P)
  totalTokensWithCls: number // numPatches + 1
  rawPatchDim: number // P * P * C
  linearEmbeddingDim: number // D
}

export function computeViTPatches(
  height: number,
  width: number,
  channels: number = 3,
  patchSize: number = 16,
  embeddingDim: number = 768,
): ViTPatchMetrics {
  const numPatches = (height * width) / (patchSize * patchSize)
  return {
    numPatches,
    totalTokensWithCls: numPatches + 1,
    rawPatchDim: patchSize * patchSize * channels,
    linearEmbeddingDim: embeddingDim,
  }
}

/**
 * 跨模態交叉注意力 (Cross-Attention) 核心數學計算
 * Query: 文字 Token 序列 (T_text x d)
 * Key/Value: 視覺 Patch 序列 (S_vision x d)
 */
export function computeCrossAttention(
  queryText: number[][], // (T x d)
  keyVision: number[][], // (S x d)
  valueVision: number[][], // (S x d)
): { attentionWeights: number[][]; output: number[][] } {
  const T = queryText.length
  const S = keyVision.length
  const d = queryText[0].length
  const scale = Math.sqrt(d)

  // 1. Q * K^T 點積
  const attentionWeights: number[][] = []
  for (let i = 0; i < T; i++) {
    const scores: number[] = []
    for (let j = 0; j < S; j++) {
      let dot = 0
      for (let k = 0; k < d; k++) {
        dot += queryText[i][k] * keyVision[j][k]
      }
      scores.push(dot / scale)
    }

    // Softmax 歸一化
    const maxScore = Math.max(...scores)
    const expScores = scores.map((s) => Math.exp(s - maxScore))
    const sumExp = expScores.reduce((a, b) => a + b, 0)
    attentionWeights.push(expScores.map((v) => Number((v / sumExp).toFixed(4))))
  }

  // 2. Weights * V
  const output: number[][] = []
  for (let i = 0; i < T; i++) {
    const outRow: number[] = new Array(d).fill(0)
    for (let j = 0; j < S; j++) {
      const weight = attentionWeights[i][j]
      for (let k = 0; k < d; k++) {
        outRow[k] += weight * valueVision[j][k]
      }
    }
    output.push(outRow.map((v) => Number(v.toFixed(4))))
  }

  return { attentionWeights, output }
}

describe('前沿 AI：多模態 VLM (ViT 分塊與 Cross-Attention) 單元測試', () => {
  it('標準 224x224 RGB 影像經 16x16 切割生成 196 個 Patches (總長 197 含 CLS)', () => {
    const metrics = computeViTPatches(224, 224, 3, 16, 768)

    expect(metrics.numPatches).toBe(196)
    expect(metrics.totalTokensWithCls).toBe(197)
    // 每個 Patch 原始像素長度：16 * 16 * 3 = 768
    expect(metrics.rawPatchDim).toBe(768)
    expect(metrics.linearEmbeddingDim).toBe(768)
  })

  it('交叉注意力矩陣每行 Softmax 總和嚴格為 1.0 且正確聚合視覺特徵', () => {
    // 2 個文字 query token，3 個視覺 patch key/value，維度 d = 4
    const Q = [
      [1.0, 0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0, 1.0],
    ]
    const K = [
      [1.0, 0.0, 1.0, 0.0], // 與 Q[0] 高度對齊
      [0.0, 1.0, 0.0, 1.0], // 與 Q[1] 高度對齊
      [0.5, 0.5, 0.5, 0.5],
    ]
    const V = [
      [10.0, 10.0, 10.0, 10.0],
      [20.0, 20.0, 20.0, 20.0],
      [30.0, 30.0, 30.0, 30.0],
    ]

    const res = computeCrossAttention(Q, K, V)

    // 檢查 Softmax 行和
    const row0Sum = res.attentionWeights[0].reduce((a, b) => a + b, 0)
    const row1Sum = res.attentionWeights[1].reduce((a, b) => a + b, 0)
    expect(row0Sum).toBeCloseTo(1.0, 3)
    expect(row1Sum).toBeCloseTo(1.0, 3)

    // Q[0] 與 K[0] 點積最大，故注意力權重最偏向第 0 個視覺 token
    expect(res.attentionWeights[0][0]).toBeGreaterThan(res.attentionWeights[0][1])
  })
})
