import { describe, it, expect } from 'vitest'

/**
 * 資料庫多版本並行控制 (MVCC) 快照讀 (Snapshot Read) 演算法模型
 * 
 * 每一列資料包含系統隱藏欄位：
 * - id: 主鍵
 * - value: 業務數據
 * - xmin: 建立該列資料之事務 ID (Transaction ID)
 * - xmax: 刪除或更新該列資料之事務 ID (未刪除時為 0)
 * 
 * 快照讀可見性規則 (在事務 Tx 讀取時):
 * 1. 建立事務 xmin 必須已在 Tx 啟動前提交 (xmin <= Tx 且不在進行中事務列表)
 * 2. 刪除事務 xmax 要麼為 0 (未刪除)，要麼 xmax > Tx (在當前事務啟動之後才刪除) 或 xmax 尚未提交
 */
export interface RowVersion {
  id: number
  value: string
  xmin: number // 建立事務 ID
  xmax: number // 刪除/覆寫事務 ID
}

export interface TransactionSnapshot {
  txId: number
  activeTxIds: number[] // 啟動快照時仍未提交的活躍事務 ID
}

export function isRowVisible(
  row: RowVersion,
  snapshot: TransactionSnapshot,
): boolean {
  // 1. 檢查建立者 xmin 是否對當前快照可見
  // 如果 xmin 大於當前事務 ID，由未來事務建立，不可見
  if (row.xmin > snapshot.txId) return false
  // 如果 xmin 是當前事務快照建立時仍在活躍中的事務，不可見
  if (snapshot.activeTxIds.includes(row.xmin)) return false

  // 2. 檢查刪除者 xmax
  // 如果尚未被刪除 (xmax === 0)，可見
  if (row.xmax === 0) return true
  // 如果被未來事務刪除 (xmax > snapshot.txId)，當前快照依然可見
  if (row.xmax > snapshot.txId) return true
  // 如果刪除事務在當前快照中仍處於活躍中（未提交），當前快照依然可見
  if (snapshot.activeTxIds.includes(row.xmax)) return true

  // 否則已在當前事務啟動前被合法提交刪除，不可見
  return false
}

describe('資料庫核心：MVCC 多版本並行控制與無鎖快照讀單元測試', () => {
  it('事務 Tx 10 啟動後，後續事務 Tx 15 的插入與更新對 Tx 10 完全隔離隱身 (可重複讀)', () => {
    const rowV1: RowVersion = { id: 1, value: 'Original-Balance-100', xmin: 5, xmax: 15 }
    const rowV2: RowVersion = { id: 1, value: 'Updated-Balance-200', xmin: 15, xmax: 0 }
    const newRowTx20: RowVersion = { id: 2, value: 'New-Account-Tx20', xmin: 20, xmax: 0 }

    // 事務 Tx 10 的快照
    const snapshotTx10: TransactionSnapshot = {
      txId: 10,
      activeTxIds: [8], // 8 號事務未提交
    }

    // 驗證 rowV1 (舊版本)：xmin=5 (<10 已提交), xmax=15 (>10 未來刪除) => 對 Tx 10 可見！
    expect(isRowVisible(rowV1, snapshotTx10)).toBe(true)

    // 驗證 rowV2 (新版本)：xmin=15 (>10 未來事務建立) => 對 Tx 10 不可見！
    expect(isRowVisible(rowV2, snapshotTx10)).toBe(false)

    // 驗證 newRowTx20：xmin=20 (>10) => 對 Tx 10 不可見 (防止幻讀)！
    expect(isRowVisible(newRowTx20, snapshotTx10)).toBe(false)
  })

  it('正在進行中 (未提交) 事務所寫入的資料對其他事務不可見 (防止髒讀)', () => {
    const uncommittedRow: RowVersion = { id: 3, value: 'Dirty-Data', xmin: 12, xmax: 0 }

    // 事務 Tx 14 讀取時，事務 12 仍在活躍列表中 (尚未 commit)
    const snapshotTx14: TransactionSnapshot = {
      txId: 14,
      activeTxIds: [12],
    }

    expect(isRowVisible(uncommittedRow, snapshotTx14)).toBe(false)
  })
})
