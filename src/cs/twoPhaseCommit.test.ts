import { describe, it, expect } from 'vitest'

/**
 * 分散式交易核心：兩階段提交 (Two-Phase Commit, 2PC) 狀態機模型
 * 
 * 階段 1：Prepare 投票階段
 * - 協調者 (Coordinator) 發送 Prepare
 * - 參與者 (Cohort) 執行本地事務並回傳 Vote: 'COMMIT' | 'ABORT'
 * 
 * 階段 2：Commit 決策階段
 * - 若全體投票 'COMMIT' => 廣播 'GLOBAL_COMMIT'
 * - 若任一參與者投票 'ABORT' 或超時 => 廣播 'GLOBAL_ABORT' (全體回滾 Undo)
 */
export type Vote = 'COMMIT' | 'ABORT'
export type GlobalDecision = 'GLOBAL_COMMIT' | 'GLOBAL_ABORT'

export interface CohortParticipant {
  id: string
  canCommit: boolean
  isCommitted: boolean
  isAborted: boolean
}

export function executeTwoPhaseCommit(
  cohorts: CohortParticipant[],
): { decision: GlobalDecision; committedCount: number; abortedCount: number } {
  // Phase 1: Prepare
  const votes: Record<string, Vote> = {}
  for (const c of cohorts) {
    votes[c.id] = c.canCommit ? 'COMMIT' : 'ABORT'
  }

  // 檢查是否所有參與者皆投 COMMIT
  const allVotedCommit = Object.values(votes).every((v) => v === 'COMMIT')

  // Phase 2: Commit / Abort Decision
  const decision: GlobalDecision = allVotedCommit ? 'GLOBAL_COMMIT' : 'GLOBAL_ABORT'

  let committedCount = 0
  let abortedCount = 0

  for (const c of cohorts) {
    if (decision === 'GLOBAL_COMMIT') {
      c.isCommitted = true
      c.isAborted = false
      committedCount++
    } else {
      c.isCommitted = false
      c.isAborted = true
      abortedCount++
    }
  }

  return { decision, committedCount, abortedCount }
}

describe('分散式系統核心：兩階段提交 (2PC) 原子性與一致性單元測試', () => {
  it('所有參與者準備就緒時協調者下達 GLOBAL_COMMIT 並全體提交', () => {
    const cohorts: CohortParticipant[] = [
      { id: 'db-node-1', canCommit: true, isCommitted: false, isAborted: false },
      { id: 'db-node-2', canCommit: true, isCommitted: false, isAborted: false },
      { id: 'db-node-3', canCommit: true, isCommitted: false, isAborted: false },
    ]

    const result = executeTwoPhaseCommit(cohorts)

    expect(result.decision).toBe('GLOBAL_COMMIT')
    expect(result.committedCount).toBe(3)
    expect(result.abortedCount).toBe(0)
    expect(cohorts.every((c) => c.isCommitted)).toBe(true)
  })

  it('單一節點因磁碟或鎖衝突投票 ABORT 時觸發全域回滾 (GLOBAL_ABORT)', () => {
    const cohorts: CohortParticipant[] = [
      { id: 'order-db', canCommit: true, isCommitted: false, isAborted: false },
      { id: 'inventory-db', canCommit: false, isCommitted: false, isAborted: false }, // 庫存不足 ABORT
      { id: 'payment-db', canCommit: true, isCommitted: false, isAborted: false },
    ]

    const result = executeTwoPhaseCommit(cohorts)

    expect(result.decision).toBe('GLOBAL_ABORT')
    expect(result.committedCount).toBe(0)
    expect(result.abortedCount).toBe(3)
    expect(cohorts.every((c) => c.isAborted)).toBe(true)
  })
})
