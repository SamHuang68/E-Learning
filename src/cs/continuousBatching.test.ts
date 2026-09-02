import { describe, it, expect } from 'vitest'

/**
 * 現代 AI 大模型推論調度：連續批次處理 (Continuous Batching / In-flight Batching) 模型
 * 
 * 參考：Orca (OSDI 2022) / vLLM 迭代級排程架構
 * 
 * 核心原理：
 * - 傳統靜態批次 (Static Batching)：整批請求以最長序列為基準對齊 (Padding)，
 *   提早完成的請求必須留在批次中空轉 (Bubble)，導致 GPU 核心嚴重閒置。
 * - 連續批次 (Continuous Batching)：在每個 Token 生成的迭代 (Iteration) 粒度進行調度。
 *   當某請求產生 <eos> 結束時，立即移出批次並釋放顯存，
 *   佇列中等待的新請求可無縫插入該空缺槽位 (Slot)，使 GPU 算力利用率達到極限！
 */
export interface InferenceRequest {
  id: string
  tokensToGenerate: number
  generatedCount: number
  isCompleted: boolean
}

export class ContinuousBatchScheduler {
  maxSlots: number
  activeSlots: InferenceRequest[]
  waitingQueue: InferenceRequest[]
  completedRequests: InferenceRequest[]
  totalIterationsRun: number

  constructor(maxSlots: number) {
    this.maxSlots = maxSlots
    this.activeSlots = []
    this.waitingQueue = []
    this.completedRequests = []
    this.totalIterationsRun = 0
  }

  enqueue(req: InferenceRequest) {
    this.waitingQueue.push(req)
  }

  stepIteration(): { finishedInThisStep: string[]; newlyAdmitted: string[] } {
    this.totalIterationsRun++
    const finishedInThisStep: string[] = []
    const newlyAdmitted: string[] = []

    // 1. 若有空缺槽位，優先自等待佇列吸納新請求 (Prefill / Schedule)
    while (this.activeSlots.length < this.maxSlots && this.waitingQueue.length > 0) {
      const nextReq = this.waitingQueue.shift()!
      this.activeSlots.push(nextReq)
      newlyAdmitted.push(nextReq.id)
    }

    // 2. 本輪迭代所有活躍請求各生成 1 個 token (Forward Pass)
    for (const req of this.activeSlots) {
      req.generatedCount++
      if (req.generatedCount >= req.tokensToGenerate) {
        req.isCompleted = true
        finishedInThisStep.push(req.id)
        this.completedRequests.push(req)
      }
    }

    // 3. 清理已完成的請求，槽位在下個迭代立即可供新請求填補
    this.activeSlots = this.activeSlots.filter((r) => !r.isCompleted)

    return { finishedInThisStep, newlyAdmitted }
  }
}

describe('前沿 AI 推論：連續批次處理 (Continuous Batching) 單元測試', () => {
  it('短請求提早完成後立刻騰出槽位接納新請求，消除排頭等待', () => {
    // 限制 2 個並發槽位
    const scheduler = new ContinuousBatchScheduler(2)

    // R1 需生成 2 個 token (短請求)，R2 需生成 5 個 token (長請求)
    scheduler.enqueue({ id: 'R1', tokensToGenerate: 2, generatedCount: 0, isCompleted: false })
    scheduler.enqueue({ id: 'R2', tokensToGenerate: 5, generatedCount: 0, isCompleted: false })
    // R3 在排隊，需生成 3 個 token
    scheduler.enqueue({ id: 'R3', tokensToGenerate: 3, generatedCount: 0, isCompleted: false })

    // iteration 1: 吸納 R1, R2，各生成 1 個 token (R1:1, R2:1)
    const step1 = scheduler.stepIteration()
    expect(step1.newlyAdmitted).toEqual(['R1', 'R2'])
    expect(step1.finishedInThisStep).toEqual([])

    // iteration 2: R1 生成第 2 個 token 達標完成！
    const step2 = scheduler.stepIteration()
    expect(step2.finishedInThisStep).toContain('R1')

    // iteration 3: R3 立即在 iteration 3 被吸納填補 R1 的槽位！
    const step3 = scheduler.stepIteration()
    expect(step3.newlyAdmitted).toContain('R3')
    expect(scheduler.activeSlots.map((r) => r.id)).toEqual(['R2', 'R3'])
  })
})
