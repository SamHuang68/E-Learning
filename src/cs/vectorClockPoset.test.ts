import { describe, it, expect } from 'vitest'

/**
 * 分散式系統核心：向量時鐘 (Vector Clocks) 因果關係判定與偏序格 (Poset Lattice) 模型
 * 
 * 核心原理：
 * 1. 向量時鐘 V 是一個長度為 N 的非負整數陣列 (N 為分散式節點總數)。
 * 2. 偏序關係判定 (Partial Order):
 *    - V_A <= V_B 当且仅当 for all i in [0, N-1], V_A[i] <= V_B[i]
 *    - V_A < V_B (事件 A 因果先於事件 B, A -> B) 当且仅当 V_A <= V_B 且 exists j, V_A[j] < V_B[j]
 * 3. 並發關係判定 (Concurrency, A || B):
 *    - 當且僅當 NOT(V_A <= V_B) 且 NOT(V_B <= V_A)
 *    - 說明兩事件在物理上並行或在因果歷史上無依賴關係，需應用衝突解決策略 (如 CRDT 或 LWW)
 * 4. 半格合併操作 (Join / Supremum in Semi-Lattice):
 *    - V_merged[i] = max(V_A[i], V_B[i])
 */
export type CausalRelation = 'happens-before' | 'happens-after' | 'concurrent' | 'identical'

export class VectorClock {
  private clock: number[]

  constructor(size: number, initialValues?: number[]) {
    if (initialValues) {
      if (initialValues.length !== size) throw new Error('Initial values length mismatch')
      this.clock = [...initialValues]
    } else {
      this.clock = new Array(size).fill(0)
    }
  }

  public getValues(): number[] {
    return [...this.clock]
  }

  public tick(nodeIndex: number): void {
    if (nodeIndex < 0 || nodeIndex >= this.clock.length) {
      throw new Error('Invalid node index')
    }
    this.clock[nodeIndex] += 1
  }

  public merge(other: VectorClock): void {
    const otherValues = other.getValues()
    if (otherValues.length !== this.clock.length) {
      throw new Error('Vector clock dimension mismatch')
    }
    for (let i = 0; i < this.clock.length; i++) {
      this.clock[i] = Math.max(this.clock[i], otherValues[i])
    }
  }

  public compare(other: VectorClock): CausalRelation {
    const a = this.clock
    const b = other.getValues()
    if (a.length !== b.length) throw new Error('Dimension mismatch')

    let aLess = false
    let bLess = false

    for (let i = 0; i < a.length; i++) {
      if (a[i] < b[i]) aLess = true
      if (a[i] > b[i]) bLess = true
    }

    if (!aLess && !bLess) return 'identical'
    if (aLess && !bLess) return 'happens-before'
    if (bLess && !aLess) return 'happens-after'
    return 'concurrent'
  }
}

describe('分散式系統：向量時鐘偏序判定與因果歷史合併單元測試', () => {
  it('正確識別因果先後關係 (happens-before)', () => {
    // 節點 0, 1, 2
    // 事件 A: [2, 0, 1]
    // 事件 B: [3, 1, 1] -> A <= B 且 A != B => A happens-before B
    const vcA = new VectorClock(3, [2, 0, 1])
    const vcB = new VectorClock(3, [3, 1, 1])

    expect(vcA.compare(vcB)).toBe('happens-before')
    expect(vcB.compare(vcA)).toBe('happens-after')
  })

  it('正確識別因果並發關係 (concurrent)', () => {
    // 事件 A: [2, 1, 0] (節點 0 領先)
    // 事件 B: [1, 2, 0] (節點 1 領先)
    // 兩者無法比較，屬於並發事件 (A || B)
    const vcA = new VectorClock(3, [2, 1, 0])
    const vcB = new VectorClock(3, [1, 2, 0])

    expect(vcA.compare(vcB)).toBe('concurrent')
    expect(vcB.compare(vcA)).toBe('concurrent')
  })

  it('正確執行半格合併 (Join / Supremum) 並在接收訊息後遞增本地時鐘', () => {
    // 節點 0 原時鐘: [2, 1, 0]
    // 接收來自節點 1 的訊息時鐘: [1, 3, 2]
    // 合併後 max: [2, 3, 2]，本地節點 0 tick: [3, 3, 2]
    const node0 = new VectorClock(3, [2, 1, 0])
    const incoming = new VectorClock(3, [1, 3, 2])

    node0.merge(incoming)
    expect(node0.getValues()).toEqual([2, 3, 2])

    node0.tick(0)
    expect(node0.getValues()).toEqual([3, 3, 2])
    expect(node0.compare(incoming)).toBe('happens-after')
  })
})
