import { describe, it, expect } from 'vitest'

/**
 * 分散式系統事務架構：Saga 模式與補償事務 (Compensating Transactions) 模型
 * 
 * 參考：Hector Garcia-Molina & Kenneth Salem (1987)
 * 
 * 核心原理：
 * 1. 跨微服務分散式架構中，2PC (兩階段提交) 存在強鎖定與單點協調者崩潰風險。
 * 2. Saga 將分散式長事務分解為序列化的本地子事務: T_1, T_2, ..., T_n
 * 3. 每個子事務 T_i 具備對應的語義補償事務: C_i (用於逆向抵消 T_i 的業務效果)
 * 4. 執行邏輯：
 *    - 正常路徑：依序執行 T_1 -> T_2 -> ... -> T_n (全部成功提交)
 *    - 失敗路徑：若 T_k 執行失敗，Saga 協調器立即觸發逆向補償序列:
 *      C_{k-1} -> C_{k-2} -> ... -> C_1，保證最終一致性 (Eventual Consistency)。
 */
export interface SagaStep {
  name: string
  action: () => boolean
  compensate: () => void
}

export interface SagaExecutionResult {
  isSuccess: boolean
  executedSteps: string[]
  compensatedSteps: string[]
  failedAtStep?: string
}

export class SagaOrchestrator {
  private steps: SagaStep[] = []

  addStep(step: SagaStep) {
    this.steps.push(step)
  }

  execute(): SagaExecutionResult {
    const executedSteps: string[] = []
    const completedSteps: SagaStep[] = []

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i]
      executedSteps.push(step.name)

      const success = step.action()
      if (!success) {
        // 觸發逆向補償
        const compensatedSteps: string[] = []
        for (let j = completedSteps.length - 1; j >= 0; j--) {
          completedSteps[j].compensate()
          compensatedSteps.push(completedSteps[j].name)
        }

        return {
          isSuccess: false,
          executedSteps,
          compensatedSteps,
          failedAtStep: step.name,
        }
      }

      completedSteps.push(step)
    }

    return {
      isSuccess: true,
      executedSteps,
      compensatedSteps: [],
    }
  }
}

describe('分散式事務：Saga 模式與逆向補償事務單元測試', () => {
  it('所有子事務正常執行完畢時返回成功且無補償', () => {
    const saga = new SagaOrchestrator()
    const log: string[] = []

    saga.addStep({
      name: 'CreateOrder',
      action: () => { log.push('order_created'); return true },
      compensate: () => { log.push('order_cancelled') },
    })
    saga.addStep({
      name: 'DeductInventory',
      action: () => { log.push('inventory_deducted'); return true },
      compensate: () => { log.push('inventory_restored') },
    })

    const res = saga.execute()
    expect(res.isSuccess).toBe(true)
    expect(res.executedSteps).toEqual(['CreateOrder', 'DeductInventory'])
    expect(res.compensatedSteps).toEqual([])
    expect(log).toEqual(['order_created', 'inventory_deducted'])
  })

  it('中途子事務失敗時嚴格逆向依序觸發補償事務', () => {
    const saga = new SagaOrchestrator()
    const log: string[] = []

    saga.addStep({
      name: 'CreateOrder',
      action: () => { log.push('order_created'); return true },
      compensate: () => { log.push('order_cancelled') },
    })
    saga.addStep({
      name: 'DeductInventory',
      action: () => { log.push('inventory_deducted'); return true },
      compensate: () => { log.push('inventory_restored') },
    })
    saga.addStep({
      name: 'ChargePayment',
      action: () => { log.push('payment_declined'); return false }, // 失敗
      compensate: () => { log.push('refund') },
    })

    const res = saga.execute()
    expect(res.isSuccess).toBe(false)
    expect(res.failedAtStep).toBe('ChargePayment')
    // 逆向補償順序：先補償 DeductInventory，再補償 CreateOrder
    expect(res.compensatedSteps).toEqual(['DeductInventory', 'CreateOrder'])
    expect(log).toEqual([
      'order_created',
      'inventory_deducted',
      'payment_declined',
      'inventory_restored',
      'order_cancelled',
    ])
  })
})
