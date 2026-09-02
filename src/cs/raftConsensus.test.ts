import { describe, it, expect } from 'vitest'

/**
 * 分散式共識演算法 Raft 核心狀態機模型
 * 
 * 角色 (Roles):
 * - Follower: 初始角色，接收 Leader 心跳，超時則轉為 Candidate。
 * - Candidate: 發起 RequestVote RPC，爭取過半數選票。
 * - Leader: 處理客戶端讀寫請求，定期發送心跳 (AppendEntries RPC) 維繫權威。
 * 
 * 過半數門檻 (Quorum):
 * 集群大小 N，法定過半數投票為 floor(N / 2) + 1。
 */
export interface RaftNode {
  id: number
  role: 'Leader' | 'Candidate' | 'Follower'
  currentTerm: number
  votedFor: number | null
  log: Array<{ term: number; index: number; command: string }>
}

/**
 * 判斷候選人日誌是否至少與選民一樣新 (Election Restriction: Section 5.4.1)
 * 條件：
 * 1. 候選人的最後日誌條目 term 大於選民的最後日誌條目 term；或
 * 2. term 相同，但候選人的最後日誌條目 index 大於或等於選民的 index。
 */
export function isCandidateLogUpToDate(
  candidateLastTerm: number,
  candidateLastIndex: number,
  voterLastTerm: number,
  voterLastIndex: number,
): boolean {
  if (candidateLastTerm !== voterLastTerm) {
    return candidateLastTerm > voterLastTerm
  }
  return candidateLastIndex >= voterLastIndex
}

/**
 * 計算集群法定過半數 (Quorum)
 */
export function calculateQuorum(clusterSize: number): number {
  return Math.floor(clusterSize / 2) + 1
}

/**
 * 模擬單輪投票結果
 */
export function evaluateElection(
  clusterSize: number,
  votesReceived: number,
): { isElected: boolean; quorumRequired: number } {
  const quorumRequired = calculateQuorum(clusterSize)
  const isElected = votesReceived >= quorumRequired
  return { isElected, quorumRequired }
}

describe('分散式系統：Raft 共識演算法核心單元測試', () => {
  it('5 節點與 7 節點集群的法定過半數 (Quorum) 嚴格精算', () => {
    // 5 節點集群需 3 票 (允許容忍 2 節點故障)
    expect(calculateQuorum(5)).toBe(3)
    const election5 = evaluateElection(5, 3)
    expect(election5.isElected).toBe(true)

    // 7 節點集群需 4 票
    expect(calculateQuorum(7)).toBe(4)
    const electionFail = evaluateElection(7, 3)
    expect(electionFail.isElected).toBe(false)
  })

  it('候選人日誌更新限制 (Log Up-to-Date) 判定安全性', () => {
    // 案例 1：候選人 Term 較大 (Term 3 vs Term 2)，即使 Index 較小也算較新
    expect(isCandidateLogUpToDate(3, 2, 2, 5)).toBe(true)

    // 案例 2：候選人 Term 較小 (Term 2 vs Term 3)，直接被拒絕
    expect(isCandidateLogUpToDate(2, 10, 3, 4)).toBe(false)

    // 案例 3：Term 相同 (Term 2)，候選人 Index 較大或相等時才允許投票
    expect(isCandidateLogUpToDate(2, 5, 2, 5)).toBe(true)
    expect(isCandidateLogUpToDate(2, 4, 2, 5)).toBe(false)
  })
})
