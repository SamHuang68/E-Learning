import { describe, it, expect } from 'vitest'

/**
 * 分散式系統：Quorum 一致性 (R + W > N) 與 Merkle 樹反熵 (Anti-Entropy) 模型
 * 
 * 參考：Amazon Dynamo, Apache Cassandra
 * 
 * 1. Quorum 一致性：
 *    - 副本總數 N, 寫入法定數 W, 讀取法定數 R
 *    - 若 R + W > N，鴿籠原理保證讀取 Quorum 與寫入 Quorum 至少交集 1 個節點，
 *      配合向量時鐘或時間戳版本即可保證強一致性 (讀到最新資料)。
 *    - 若 R + W <= N，則為弱一致性 (可能讀到過期舊資料)。
 * 
 * 2. Merkle 樹反熵修復：
 *    - 每個葉節點儲存一個 Key-Value 的雜湊值
 *    - 內部節點儲存左右子節點雜湊的組合雜湊
 *    - 當兩節點進行後台資料修復 (Anti-Entropy) 時，由頂部 Root 開始比對：
 *      若 Root Hash 相等，代表兩節點數據 100% 一致，僅消耗 1 次網路往返！
 *      若不相等，僅需沿著相異子節點遞迴向下查找，極大化減少通訊頻寬開銷。
 */
export interface QuorumMetrics {
  n: number
  r: number
  w: number
  isStrongConsistency: boolean
  overlapCount: number
}

export function evaluateQuorumConsistency(n: number, r: number, w: number): QuorumMetrics {
  if (n <= 0 || r <= 0 || w <= 0 || r > n || w > n) {
    throw new Error('Invalid Quorum configuration')
  }

  const overlap = r + w - n
  return {
    n,
    r,
    w,
    isStrongConsistency: r + w > n,
    overlapCount: Math.max(0, overlap),
  }
}

export interface MerkleNode {
  hash: string
  left?: MerkleNode
  right?: MerkleNode
}

export function compareMerkleTrees(
  nodeA?: MerkleNode,
  nodeB?: MerkleNode,
): { isIdentical: boolean; mismatchedNodesCount: number } {
  if (!nodeA && !nodeB) return { isIdentical: true, mismatchedNodesCount: 0 }
  if (!nodeA || !nodeB) return { isIdentical: false, mismatchedNodesCount: 1 }

  if (nodeA.hash === nodeB.hash) {
    return { isIdentical: true, mismatchedNodesCount: 0 }
  }

  // Hash 不等，向下遞迴比對子樹
  const leftRes = compareMerkleTrees(nodeA.left, nodeB.left)
  const rightRes = compareMerkleTrees(nodeA.right, nodeB.right)

  return {
    isIdentical: false,
    mismatchedNodesCount: 1 + leftRes.mismatchedNodesCount + rightRes.mismatchedNodesCount,
  }
}

describe('分散式系統核心：Quorum 一致性與 Merkle 樹反熵比對單元測試', () => {
  it('當 R + W > N 時保證讀寫重疊，達成強一致性', () => {
    // 經典配置：N = 3, R = 2, W = 2 => R + W = 4 > 3，重疊 1 個節點
    const res = evaluateQuorumConsistency(3, 2, 2)
    expect(res.isStrongConsistency).toBe(true)
    expect(res.overlapCount).toBe(1)
  })

  it('當 R + W <= N 時為最終一致性配置，無保證讀寫交集', () => {
    // N = 5, R = 2, W = 2 => R + W = 4 <= 5
    const res = evaluateQuorumConsistency(5, 2, 2)
    expect(res.isStrongConsistency).toBe(false)
    expect(res.overlapCount).toBe(0)
  })

  it('Merkle 樹比對：Root Hash 相同時單步判定完全一致', () => {
    const treeA: MerkleNode = { hash: 'root_abc', left: { hash: 'l1' }, right: { hash: 'r1' } }
    const treeB: MerkleNode = { hash: 'root_abc', left: { hash: 'l1' }, right: { hash: 'r1' } }

    const res = compareMerkleTrees(treeA, treeB)
    expect(res.isIdentical).toBe(true)
    expect(res.mismatchedNodesCount).toBe(0)
  })

  it('Merkle 樹比對：局部相異時精準向下遍歷定位不一致區塊', () => {
    const treeA: MerkleNode = {
      hash: 'root_diff',
      left: { hash: 'same_l' },
      right: { hash: 'diff_r1' },
    }
    const treeB: MerkleNode = {
      hash: 'root_diff2',
      left: { hash: 'same_l' },
      right: { hash: 'diff_r2' },
    }

    const res = compareMerkleTrees(treeA, treeB)
    expect(res.isIdentical).toBe(false)
    // Root 不等 (1) + 右子樹不等 (1) = 2
    expect(res.mismatchedNodesCount).toBe(2)
  })
})
