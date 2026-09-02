import { describe, it, expect } from 'vitest'

/**
 * 分散式資料庫：Serializable 快照隔離 (SSI) 演算法模型
 * 
 * 核心原理 (Cahill et al. / PostgreSQL SSI):
 * - 在快照隔離 (SI) 基礎上，追蹤事務間的讀寫反向相依 (rw-antidependencies):
 *   T1 讀取了某個版本，隨後 T2 寫入了該項目的更新版本 (T1 ->rw T2)
 * - 當圖中偵測到連續兩條反向相依邊 (T1 ->rw T2 ->rw T3) 時，
 *   代表可能構成潛在非串行化環路 (Dangerous Structure)
 * - 系統主動中止 (Abort) 位於樞紐位置的 T2 事務，消除寫入偏差 (Write Skew)
 */
export interface TransactionNode {
  id: string
  inConflictCount: number
  outConflictCount: number
  isAborted: boolean
}

export interface AntiDependencyEdge {
  fromTx: string // 讀取者 T1
  toTx: string // 寫入覆蓋者 T2
}

export function detectAndResolveSSIDangerousStructure(
  transactions: TransactionNode[],
  edges: AntiDependencyEdge[],
): { abortedTxIds: string[]; hasDangerousStructure: boolean } {
  const abortedSet = new Set<string>()

  // 檢查是否存在 T1 ->rw T2 且 T2 ->rw T3
  for (const e1 of edges) {
    for (const e2 of edges) {
      if (e1.toTx === e2.fromTx && e1.fromTx !== e2.toTx) {
        // e1.toTx (即中間的中繼事務 T2) 構成 Dangerous Structure
        const pivotId = e1.toTx
        abortedSet.add(pivotId)
        const pivotTx = transactions.find((t) => t.id === pivotId)
        if (pivotTx) {
          pivotTx.isAborted = true
        }
      }
    }
  }

  return {
    abortedTxIds: Array.from(abortedSet),
    hasDangerousStructure: abortedSet.size > 0,
  }
}

describe('資料庫核心：Serializable 快照隔離 (SSI) 衝突圖單元測試', () => {
  it('單純單向讀寫反向相依不構成危險結構，事務正常提交', () => {
    const txs: TransactionNode[] = [
      { id: 'T1', inConflictCount: 0, outConflictCount: 1, isAborted: false },
      { id: 'T2', inConflictCount: 1, outConflictCount: 0, isAborted: false },
    ]
    const edges: AntiDependencyEdge[] = [{ fromTx: 'T1', toTx: 'T2' }]

    const res = detectAndResolveSSIDangerousStructure(txs, edges)

    expect(res.hasDangerousStructure).toBe(false)
    expect(res.abortedTxIds.length).toBe(0)
    expect(txs.every((t) => !t.isAborted)).toBe(true)
  })

  it('出現 T1 ->rw T2 ->rw T3 連續相依時精準中止樞紐事務 T2 預防異常', () => {
    const txs: TransactionNode[] = [
      { id: 'T1', inConflictCount: 0, outConflictCount: 1, isAborted: false },
      { id: 'T2', inConflictCount: 1, outConflictCount: 1, isAborted: false },
      { id: 'T3', inConflictCount: 1, outConflictCount: 0, isAborted: false },
    ]
    const edges: AntiDependencyEdge[] = [
      { fromTx: 'T1', toTx: 'T2' },
      { fromTx: 'T2', toTx: 'T3' },
    ]

    const res = detectAndResolveSSIDangerousStructure(txs, edges)

    expect(res.hasDangerousStructure).toBe(true)
    expect(res.abortedTxIds).toContain('T2')
    expect(txs.find((t) => t.id === 'T2')?.isAborted).toBe(true)
  })
})
