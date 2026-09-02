import { describe, it, expect } from 'vitest'

/**
 * 大語言模型溫度縮放 Softmax (Temperature Scaling)
 */
export function applyTemperatureSoftmax(logits: number[], temperature: number): number[] {
  // 避免除以 0
  const T = Math.max(1e-5, temperature)
  const scaledLogits = logits.map((z) => z / T)
  const maxScaled = Math.max(...scaledLogits)
  const expValues = scaledLogits.map((z) => Math.exp(z - maxScaled))
  const sumExp = expValues.reduce((a, b) => a + b, 0)
  return expValues.map((v) => Number((v / sumExp).toFixed(4)))
}

/**
 * Top-p (Nucleus) 核心取樣截斷模型
 * 保留累積機率達到 p 的最小候選集，其餘機率歸零並重新歸一化
 */
export function applyTopPFilter(
  tokens: Array<{ id: number; token: string; prob: number }>,
  p: number = 0.9,
): Array<{ id: number; token: string; prob: number }> {
  // 依機率降冪排序
  const sorted = [...tokens].sort((a, b) => b.prob - a.prob)

  let cumulativeProb = 0
  const keptTokens: Array<{ id: number; token: string; prob: number }> = []

  for (const t of sorted) {
    keptTokens.push(t)
    cumulativeProb += t.prob
    if (cumulativeProb >= p) {
      break
    }
  }

  // 重新歸一化
  const sumKept = keptTokens.reduce((acc, item) => acc + item.prob, 0)
  return keptTokens.map((t) => ({
    ...t,
    prob: Number((t.prob / sumKept).toFixed(4)),
  }))
}

describe('大語言模型解碼策略 (LLM Decoding Strategies) 單元測試', () => {
  it('低溫 (T=0.2) 顯著提高最高分 Logit 之機率集中度 (Greedy 趨勢)', () => {
    const logits = [2.0, 5.0, 1.0] // 索引 1 明顯佔優

    const standardProbs = applyTemperatureSoftmax(logits, 1.0)
    const lowTempProbs = applyTemperatureSoftmax(logits, 0.2)

    // 在 T=1.0 下，索引 1 機率約 0.93
    expect(standardProbs[1]).toBeGreaterThan(0.9)
    // 在 T=0.2 低溫下，索引 1 機率幾乎達到 0.9999 (極限尖銳)
    expect(lowTempProbs[1]).toBeGreaterThanOrEqual(0.999)
    expect(lowTempProbs[0]).toBeLessThan(0.001)
  })

  it('Top-p (Nucleus) 成功截斷長尾無效 Token 並完成重新歸一化', () => {
    const rawTokens = [
      { id: 1, token: 'Taiwan', prob: 0.65 },
      { id: 2, token: 'Semiconductor', prob: 0.25 },
      { id: 3, token: 'Banana', prob: 0.06 },
      { id: 4, token: 'Spaceship', prob: 0.04 },
    ]

    // 設定 p = 0.90：累積機率 0.65 + 0.25 = 0.90，剛好在前兩個 token 截斷！
    const filtered = applyTopPFilter(rawTokens, 0.90)

    expect(filtered.length).toBe(2)
    expect(filtered.map((t) => t.token)).toEqual(['Taiwan', 'Semiconductor'])

    // 兩者重新歸一化後的總和為 1.0
    const sum = filtered.reduce((a, b) => a + b.prob, 0)
    expect(sum).toBeCloseTo(1.0, 3)
  })
})
