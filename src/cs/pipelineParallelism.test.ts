import { describe, it, expect } from 'vitest'

/**
 * 現代大模型分散式訓練：管線平行 (Pipeline Parallelism) 1F1B 調度與氣泡率模型
 * 
 * 參考：Megatron-LM (Narayanan et al.) / GPipe (Huang et al.)
 * 
 * 符號說明：
 * - p: 管線級數 (Pipeline Stages, 例如 4 級或 8 級 GPU)
 * - m: 每個全域批次的微批次數量 (Micro-batches)
 * - t_F: 單個微批次前向傳播時間
 * - t_B: 單個微批次反向傳播時間 (通常 t_B ≈ 2 * t_F)
 * 
 * 1F1B 調度核心突破：
 * - GPipe 顯存佔用隨微批次數 m 線性增長 O(m)
 * - 1F1B 在暖機後交替執行 1 次前向與 1 次反向，顯存峰值嚴格受限於 O(p)，與 m 完全無關！
 * 
 * 管線氣泡率 (Bubble Fraction):
 * F_bubble = (p - 1) / (m + p - 1)
 */
export interface PipelineMetrics {
  pipelineStages: number
  microBatches: number
  bubbleRate: number
  peakActivationSlots: number // 1F1B 最大活化暫存微批次數
}

export function computePipelineMetrics(p: number, m: number): PipelineMetrics {
  if (p <= 0 || m <= 0) throw new Error('Invalid pipeline parameters')
  
  // 氣泡率公式：(p - 1) / (m + p - 1)
  const bubbleRate = Number(((p - 1) / (m + p - 1)).toFixed(4))
  // 1F1B 活化顯存槽上限為 p
  const peakActivationSlots = p

  return {
    pipelineStages: p,
    microBatches: m,
    bubbleRate,
    peakActivationSlots,
  }
}

describe('前沿 AI 訓練：管線平行 (Pipeline Parallelism) 1F1B 顯存與氣泡率單元測試', () => {
  it('在 4 級管線且 16 個微批次下氣泡率降至 15.79% 且顯存受限於 4 槽', () => {
    const metrics = computePipelineMetrics(4, 16)

    // F_bubble = (4 - 1) / (16 + 4 - 1) = 3 / 19 ≈ 0.1579
    expect(metrics.bubbleRate).toBe(0.1579)
    // 活化顯存槽上限嚴格為 4，避免 GPipe 暴增至 16 的顯存 OOM
    expect(metrics.peakActivationSlots).toBe(4)
  })

  it('在 8 級管線且 64 個微批次下氣泡率顯著壓低至 9.86%', () => {
    const metrics = computePipelineMetrics(8, 64)

    // F_bubble = (8 - 1) / (64 + 8 - 1) = 7 / 71 ≈ 0.0986
    expect(metrics.bubbleRate).toBe(0.0986)
    expect(metrics.peakActivationSlots).toBe(8)
  })
})
