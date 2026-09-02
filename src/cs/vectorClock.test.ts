import { describe, it, expect } from 'vitest'

/**
 * 分散式系統因果關係追蹤：向量時鐘 (Vector Clocks) 演算法模型
 * 
 * 規則 (節點 i 擁有時鐘 V_i)：
 * 1. 本地事件：V_i[i] = V_i[i] + 1
 * 2. 發送訊息：攜帶當前向量時鐘 V_i
 * 3. 接收訊息 (攜帶 V_msg)：
 *    對所有 k: V_i[k] = max(V_i[k], V_msg[k])
 *    V_i[i] = V_i[i] + 1
 * 
 * 因果偏序關係判定 (Happens-Before: A -> B)：
 * A -> B 當且僅當：
 * 對所有 k: V_A[k] <= V_B[k]，且存在至少一個 j 使得 V_A[j] < V_B[j]
 * 
 * 並發關係 (Concurrent: A || B)：
 * 既非 A -> B，亦非 B -> A
 */
export type VectorClock = Record<string, number>

export function createVectorClock(nodes: string[]): VectorClock {
  const vc: VectorClock = {}
  for (const n of nodes) vc[n] = 0
  return vc
}

export function localEvent(vc: VectorClock, nodeId: string): VectorClock {
  return { ...vc, [nodeId]: (vc[nodeId] || 0) + 1 }
}

export function receiveMessage(
  localVc: VectorClock,
  msgVc: VectorClock,
  nodeId: string,
): VectorClock {
  const updated: VectorClock = {}
  const allNodes = new Set([...Object.keys(localVc), ...Object.keys(msgVc)])
  for (const n of allNodes) {
    updated[n] = Math.max(localVc[n] || 0, msgVc[n] || 0)
  }
  updated[nodeId] = (updated[nodeId] || 0) + 1
  return updated
}

export function compareVectorClocks(
  vcA: VectorClock,
  vcB: VectorClock,
): 'A_BEFORE_B' | 'B_BEFORE_A' | 'CONCURRENT' | 'IDENTICAL' {
  const allNodes = new Set([...Object.keys(vcA), ...Object.keys(vcB)])
  let hasLess = false
  let hasGreater = false

  for (const n of allNodes) {
    const a = vcA[n] || 0
    const b = vcB[n] || 0
    if (a < b) hasLess = true
    if (a > b) hasGreater = true
  }

  if (!hasLess && !hasGreater) return 'IDENTICAL'
  if (hasLess && !hasGreater) return 'A_BEFORE_B'
  if (!hasLess && hasGreater) return 'B_BEFORE_A'
  return 'CONCURRENT'
}

describe('分散式系統核心：向量時鐘 (Vector Clocks) 因果關係判定單元測試', () => {
  it('訊息傳遞事件能精確捕捉因果先後順序 (Happens-Before)', () => {
    // 3 節點系統：Node A, Node B, Node C
    let vcA = createVectorClock(['A', 'B', 'C'])
    let vcB = createVectorClock(['A', 'B', 'C'])

    // 1. Node A 發生本地事件 e1
    vcA = localEvent(vcA, 'A') // A: [1, 0, 0]

    // 2. Node A 發送訊息給 Node B，Node B 接收該訊息生成事件 e2
    vcB = receiveMessage(vcB, vcA, 'B') // B: [1, 1, 0]

    // 驗證 e1 -> e2 (A_BEFORE_B)
    expect(compareVectorClocks(vcA, vcB)).toBe('A_BEFORE_B')
    expect(compareVectorClocks(vcB, vcA)).toBe('B_BEFORE_A')
  })

  it('無訊息交互之獨立並行事件被正確判定為並發 (Concurrent)', () => {
    let vcA = createVectorClock(['A', 'B', 'C'])
    let vcB = createVectorClock(['A', 'B', 'C'])

    // Node A 本地執行事件 e_A
    vcA = localEvent(vcA, 'A') // A: [1, 0, 0]

    // Node B 本地執行事件 e_B
    vcB = localEvent(vcB, 'B') // B: [0, 1, 0]

    // 兩者並發 (互無因果關係)
    expect(compareVectorClocks(vcA, vcB)).toBe('CONCURRENT')
  })
})
