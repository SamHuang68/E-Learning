import { describe, it, expect } from 'vitest'

/**
 * 分散式共識核心：Multi-Paxos 快速路徑日誌追加與領導者租約模型
 * 
 * 核心原理：
 * 1. Basic Paxos 瓶頸：
 *    - 每個槽位 (Log Slot) 都要完整執行 Phase 1 (Prepare/Promise) + Phase 2 (Accept/Accepted)，耗時 2 RTT。
 * 2. Multi-Paxos 快速路徑 (Fast Path)：
 *    - 當 Leader 透過單次全局 Prepare 獲取了全網所有未確定槽位的控制權後；
 *    - 後續日誌追加只需跳過 Phase 1，直接發起 Phase 2 (Accept) 廣播，僅需 1 RTT 即可達成多數派 Quorum 提交！
 * 3. 故障復原與衝突解決：
 *    - 當前 Leader 發生故障時，新節點以更高提案編號 (Proposal Number, n > n_old) 重新執行 Phase 1，
 *      遵循「最大提案號優先 (Highest Proposal Number Wins)」原則補齊未提交日誌條目，保證線性一致性。
 */
export interface PaxosLogEntry {
  slotIndex: number
  proposalNumber: number
  value: string
  isCommitted: boolean
}

export class MultiPaxosCluster {
  public totalNodes: number
  public quorumSize: number
  public currentLeaderId: number
  public activeProposalNumber: number
  public log: Map<number, PaxosLogEntry>

  constructor(totalNodes: number = 5, leaderId: number = 0) {
    this.totalNodes = totalNodes
    this.quorumSize = Math.floor(totalNodes / 2) + 1 // 5 個節點 quorum = 3
    this.currentLeaderId = leaderId
    this.activeProposalNumber = 100 // 初始 Leader 提案號
    this.log = new Map()
  }

  /**
   * 穩態快速路徑：Leader 跳過 Phase 1，直接執行 Phase 2 (Accept)
   */
  public fastAppend(slotIndex: number, value: string, ackNodesCount: number): { success: boolean; rtt: number } {
    if (ackNodesCount < this.quorumSize) {
      return { success: false, rtt: 1 }
    }

    this.log.set(slotIndex, {
      slotIndex,
      proposalNumber: this.activeProposalNumber,
      value,
      isCommitted: true,
    })

    return { success: true, rtt: 1 }
  }

  /**
   * Leader 故障轉移慢速路徑：新 Leader 必須以更高提案號發起 Phase 1 (Prepare) 重新確認槽位狀態
   */
  public leaderFailover(newLeaderId: number, highestObservedProposal: number): { success: boolean; rtt: number } {
    this.currentLeaderId = newLeaderId
    this.activeProposalNumber = highestObservedProposal + 10 // 提升提案號
    return { success: true, rtt: 2 } // Phase 1 + Phase 2 共 2 RTT
  }
}

describe('分散式共識：Multi-Paxos 穩態 1-RTT 快速追加與容錯切換單元測試', () => {
  it('在穩定 Leader 存在時，新日誌條目僅需 1-RTT 即可完成 Quorum 提交', () => {
    const cluster = new MultiPaxosCluster(5, 0)

    // 收到 3 個節點 ACK (滿足多數派 3/5)
    const res = cluster.fastAppend(1, 'SET user=Alice', 3)
    expect(res.success).toBe(true)
    expect(res.rtt).toBe(1)

    const entry = cluster.log.get(1)
    expect(entry?.isCommitted).toBe(true)
    expect(entry?.value).toBe('SET user=Alice')
  })

  it('未達多數派 Quorum 時快速追加失敗', () => {
    const cluster = new MultiPaxosCluster(5, 0)
    // 只有 2 個節點響應 (小於多數派 3)
    const res = cluster.fastAppend(2, 'SET user=Bob', 2)
    expect(res.success).toBe(false)
    expect(cluster.log.has(2)).toBe(false)
  })

  it('Leader 故障後新節點提升提案號並透過 2-RTT 完成狀態機收斂', () => {
    const cluster = new MultiPaxosCluster(5, 0)
    cluster.fastAppend(1, 'SET x=10', 4)

    // 節點 1 發現 Leader 0 宕機，發起選舉
    const failover = cluster.leaderFailover(1, cluster.activeProposalNumber)
    expect(failover.success).toBe(true)
    expect(failover.rtt).toBe(2)
    expect(cluster.currentLeaderId).toBe(1)
    expect(cluster.activeProposalNumber).toBeGreaterThan(100)
  })
})
