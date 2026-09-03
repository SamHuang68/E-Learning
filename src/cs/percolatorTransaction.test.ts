import { describe, it, expect } from 'vitest'

/**
 * 分散式事務：Google Percolator 兩階段樂觀提交與 TSO 時間戳模型
 * 
 * 核心原理：
 * 1. 底層依賴 BigTable 單行事務 (Row-level ACID) 與多版本並發控制 (MVCC)。
 * 2. 每個 Key 拆分為 3 個列族 (Column Families):
 *    - data[start_ts] = 數據實際內容
 *    - lock[start_ts] = { primary_lock_ref: Key } (未提交鎖)
 *    - write[commit_ts] = start_ts (已生效提交指針)
 * 3. Prewrite 階段:
 *    - 選擇 Primary Key，檢查衝突 (若在 [start_ts, infty) 已有 write 記錄，或任何時間存在 lock，則中止回滾)。
 *    - 鎖定 Primary Key，再鎖定所有 Secondary Keys。
 * 4. Commit 階段:
 *    - 向 TSO 取得 commit_ts (> start_ts)。
 *    - 先原子提交 Primary Key: 刪除 Primary lock 並寫入 write[commit_ts] = start_ts。
 *    - 「Primary Key 一旦提交成功，整筆事務視為永久提交成功！」後續異步清理 Secondary locks。
 */
export interface CellVersion {
  data: Map<number, string> // start_ts -> value
  lock?: { start_ts: number; primaryKey: string }
  write: Map<number, number> // commit_ts -> start_ts
}

export class PercolatorStorage {
  private store: Map<string, CellVersion> = new Map()

  private getCell(key: string): CellVersion {
    if (!this.store.has(key)) {
      this.store.set(key, { data: new Map(), write: new Map() })
    }
    return this.store.get(key)!
  }

  /**
   * Prewrite 單行: 檢查鎖衝突與寫寫衝突
   */
  public prewrite(key: string, value: string, startTs: number, primaryKey: string): boolean {
    const cell = this.getCell(key)

    // 檢查 1: 是否存在任何未清理的鎖 (讀寫/寫寫衝突)
    if (cell.lock !== undefined) {
      return false
    }

    // 檢查 2: 是否在 startTs 之後已經有其他事務提交寫入 (寫寫衝突)
    for (const commitTs of cell.write.keys()) {
      if (commitTs >= startTs) {
        return false
      }
    }

    // 寫入數據與鎖
    cell.data.set(startTs, value)
    cell.lock = { start_ts: startTs, primaryKey }
    return true
  }

  /**
   * Commit Primary: 關鍵原子提交點
   */
  public commitPrimary(primaryKey: string, startTs: number, commitTs: number): boolean {
    const cell = this.getCell(primaryKey)
    if (!cell.lock || cell.lock.start_ts !== startTs) {
      return false // 鎖已被他人回滾或超時清理
    }

    // 原子轉化: 移除 lock，增加 write
    delete cell.lock
    cell.write.set(commitTs, startTs)
    return true
  }

  /**
   * Commit Secondary: 解開次要鎖並生效 write 記錄
   */
  public commitSecondary(key: string, startTs: number, commitTs: number): boolean {
    const cell = this.getCell(key)
    if (cell.lock && cell.lock.start_ts === startTs) {
      delete cell.lock
    }
    cell.write.set(commitTs, startTs)
    return true
  }

  /**
   * 讀取 Snapshot Read: 在特定 readTs 下獲取最新已提交值
   */
  public read(key: string, readTs: number): string | null {
    const cell = this.getCell(key)

    // 若存在 lock 且 start_ts <= readTs，存在並發寫入，需等待或報錯 (Snapshot Isolation 衝突)
    if (cell.lock && cell.lock.start_ts <= readTs) {
      throw new Error(`Read conflict on locked key: ${key}`)
    }

    // 尋找 commit_ts <= readTs 的最大 commitTs
    let maxCommitTs = -1
    for (const cTs of cell.write.keys()) {
      if (cTs <= readTs && cTs > maxCommitTs) {
        maxCommitTs = cTs
      }
    }

    if (maxCommitTs === -1) return null
    const startTs = cell.write.get(maxCommitTs)!
    return cell.data.get(startTs) || null
  }
}

describe('分散式事務：Percolator Primary-Lock 協調與快照隔離單元測試', () => {
  it('事務成功兩階段提交並透過 Snapshot 讀取最新已提交數據', () => {
    const db = new PercolatorStorage()
    const startTs = 10
    const commitTs = 15

    // Prewrite: Primary key = "account:A", Secondary key = "account:B"
    expect(db.prewrite('account:A', '$900', startTs, 'account:A')).toBe(true)
    expect(db.prewrite('account:B', '$1100', startTs, 'account:A')).toBe(true)

    // Commit Primary: 關鍵點
    expect(db.commitPrimary('account:A', startTs, commitTs)).toBe(true)
    // Commit Secondary
    expect(db.commitSecondary('account:B', startTs, commitTs)).toBe(true)

    // 透過 readTs = 20 讀取
    expect(db.read('account:A', 20)).toBe('$900')
    expect(db.read('account:B', 20)).toBe('$1100')

    // 透過 readTs = 12 讀取歷史快照 (應為 null，因為提交於 15)
    expect(db.read('account:A', 12)).toBe(null)
  })

  it('發生寫寫衝突時 Prewrite 失敗並自動終止事務', () => {
    const db = new PercolatorStorage()
    // 事務 1 提交於 commitTs = 25
    db.prewrite('stock:TSMC', '1000', 10, 'stock:TSMC')
    db.commitPrimary('stock:TSMC', 10, 25)

    // 事務 2 的 startTs 為 20 (早於事務 1 的提交時間 25)
    // 當事務 2 嘗試 Prewrite 時，發現 write[25] >= 20，發生衝突
    const res = db.prewrite('stock:TSMC', '1050', 20, 'stock:TSMC')
    expect(res).toBe(false)
  })
})
