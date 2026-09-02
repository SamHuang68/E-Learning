import { describe, it, expect } from 'vitest'

/**
 * 現代大模型高效推論：Chunked Prefill 與 Decode 批次混合調度模型
 * 
 * 參考：Sarathi-Serve (Agrawal et al., OSDI 2024) / vLLM Chunked Prefill
 * 
 * 核心機制：
 * - 傳統推理瓶頸：長 Prompt Prefill 是 Compute-bound，執行耗時數百毫秒；
 *   期間並發的 Decode (Memory-bound) 請求被迫排隊等待，引發嚴重的輸出卡頓 (ITL 尖峰)。
 * - Chunked Prefill：設定單次迭代最大 Token 預算 (tokenBudget，例如 1024)。
 *   優先保留 D 個 Decode 請求的 1-Token 配額，剩餘預算容納 Prefill Chunk。
 * - 兩者打包在同一個 GPU Kernel (GEMM) 運算中執行，同時榨滿算力並保持極低解碼延遲！
 */
export interface ScheduleIterationResult {
  decodeTokensProcessed: number
  prefillTokensProcessed: number
  totalTokensInBatch: number
  remainingPromptTokens: number
  isPrefillCompleted: boolean
}

export function scheduleChunkedPrefillIteration(
  promptRemainingTokens: number,
  activeDecodeRequestsCount: number,
  tokenBudgetPerIteration: number = 1024,
): ScheduleIterationResult {
  if (tokenBudgetPerIteration <= 0) throw new Error('Invalid token budget')

  // 1. 保證每個進行中的解碼請求都能產出 1 個 token
  const decodeTokens = Math.min(activeDecodeRequestsCount, tokenBudgetPerIteration)
  const remainingBudgetForPrefill = Math.max(0, tokenBudgetPerIteration - decodeTokens)

  // 2. 切分 Prefill 塊
  const prefillTokens = Math.min(promptRemainingTokens, remainingBudgetForPrefill)
  const nextRemainingPrompt = promptRemainingTokens - prefillTokens

  return {
    decodeTokensProcessed: decodeTokens,
    prefillTokensProcessed: prefillTokens,
    totalTokensInBatch: decodeTokens + prefillTokens,
    remainingPromptTokens: nextRemainingPrompt,
    isPrefillCompleted: nextRemainingPrompt === 0,
  }
}

describe('前沿 AI 推論：Chunked Prefill 與 Decode 混合調度單元測試', () => {
  it('在 1024 預算下同時保障 128 個解碼請求流暢輸出並處理 896 個 Prefill Token', () => {
    // 假設 Prompt 長達 2048 tokens，並發有 128 個解碼請求
    const iter1 = scheduleChunkedPrefillIteration(2048, 128, 1024)

    expect(iter1.decodeTokensProcessed).toBe(128)
    expect(iter1.prefillTokensProcessed).toBe(896)
    expect(iter1.totalTokensInBatch).toBe(1024)
    expect(iter1.remainingPromptTokens).toBe(1152)
    expect(iter1.isPrefillCompleted).toBe(false)

    // 第二輪迭代
    const iter2 = scheduleChunkedPrefillIteration(iter1.remainingPromptTokens, 128, 1024)
    expect(iter2.prefillTokensProcessed).toBe(896)
    expect(iter2.remainingPromptTokens).toBe(256)
    expect(iter2.isPrefillCompleted).toBe(false)

    // 第三輪迭代：Prefill 順利收尾
    const iter3 = scheduleChunkedPrefillIteration(iter2.remainingPromptTokens, 128, 1024)
    expect(iter3.prefillTokensProcessed).toBe(256)
    expect(iter3.remainingPromptTokens).toBe(0)
    expect(iter3.isPrefillCompleted).toBe(true)
  })

  it('當解碼請求佔滿預算時不處理 Prefill，優先保護線上 SLA 延遲', () => {
    const iter = scheduleChunkedPrefillIteration(500, 1024, 1024)
    expect(iter.decodeTokensProcessed).toBe(1024)
    expect(iter.prefillTokensProcessed).toBe(0)
    expect(iter.remainingPromptTokens).toBe(500)
  })
})
