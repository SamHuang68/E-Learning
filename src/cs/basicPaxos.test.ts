import { describe, it, expect } from 'vitest'

/**
 * 分散式共識演算法基石：經典 Paxos (Basic Paxos) 協定模型
 * 
 * 角色：Proposer (提案者), Acceptor (接受者)
 * 
 * Phase 1: Prepare / Promise
 * - Proposer 發送 Prepare(n)，n 為全域唯一遞增提案號
 * - Acceptor: 若 n > minProposal，則 minProposal = n，並回覆 Promise(acceptedProposal, acceptedValue)
 * 
 * Phase 2: Accept / Accepted
 * - Proposer: 收到 Quorum 個 Promise 後，挑選所有 Promise 中提案號最大的 value 作為提案值
 *             (若皆為空，則使用自己的提案值 v)
 *             發送 Accept(n, value)
 * - Acceptor: 若 n >= minProposal，則 acceptedProposal = n, acceptedValue = value，回覆 Accepted
 */
export interface AcceptorState {
  id: string
  minProposal: number
  acceptedProposal: number | null
  acceptedValue: string | null
}

export function handlePrepare(
  acceptor: AcceptorState,
  proposalNumber: number,
): { isPromised: boolean; acceptedProposal: number | null; acceptedValue: string | null } {
  if (proposalNumber > acceptor.minProposal) {
    acceptor.minProposal = proposalNumber
    return {
      isPromised: true,
      acceptedProposal: acceptor.acceptedProposal,
      acceptedValue: acceptor.acceptedValue,
    }
  }
  return { isPromised: false, acceptedProposal: null, acceptedValue: null }
}

export function handleAccept(
  acceptor: AcceptorState,
  proposalNumber: number,
  value: string,
): boolean {
  if (proposalNumber >= acceptor.minProposal) {
    acceptor.minProposal = proposalNumber
    acceptor.acceptedProposal = proposalNumber
    acceptor.acceptedValue = value
    return true
  }
  return false
}

describe('分散式共識基石：Basic Paxos 兩階段承諾與接受狀態機單元測試', () => {
  it('若先前未接受任何值，Proposer 獲取法定過半數 Promise 後成功提案自身價值', () => {
    // 3 個 Acceptor，Quorum = 2
    const acceptors: AcceptorState[] = [
      { id: 'acc-1', minProposal: 0, acceptedProposal: null, acceptedValue: null },
      { id: 'acc-2', minProposal: 0, acceptedProposal: null, acceptedValue: null },
      { id: 'acc-3', minProposal: 0, acceptedProposal: null, acceptedValue: null },
    ]

    // Phase 1: Proposer 發送 Prepare(10) 給 acc-1 和 acc-2
    const p1 = handlePrepare(acceptors[0], 10)
    const p2 = handlePrepare(acceptors[1], 10)

    expect(p1.isPromised).toBe(true)
    expect(p2.isPromised).toBe(true)
    // 兩者先前均無已接受值
    expect(p1.acceptedValue).toBeNull()
    expect(p2.acceptedValue).toBeNull()

    // Phase 2: Proposer 發送 Accept(10, 'Value-A')
    const a1 = handleAccept(acceptors[0], 10, 'Value-A')
    const a2 = handleAccept(acceptors[1], 10, 'Value-A')

    expect(a1).toBe(true)
    expect(a2).toBe(true)
    expect(acceptors[0].acceptedValue).toBe('Value-A')
    expect(acceptors[1].acceptedValue).toBe('Value-A')
  })

  it('若 Acceptor 已接受過舊提案值，高號提案者必須承接該已接受值以確保共識不變性', () => {
    const acc1: AcceptorState = {
      id: 'acc-1',
      minProposal: 10,
      acceptedProposal: 10,
      acceptedValue: 'Committed-Value-X',
    }
    const acc2: AcceptorState = {
      id: 'acc-2',
      minProposal: 5,
      acceptedProposal: 5,
      acceptedValue: 'Old-Value-W',
    }

    // 新 Proposer 發起更高提案號 20
    const p1 = handlePrepare(acc1, 20)
    const p2 = handlePrepare(acc2, 20)

    expect(p1.isPromised).toBe(true)
    expect(p2.isPromised).toBe(true)

    // 挑選 acceptedProposal 最大的值 (acc1 的 10 > acc2 的 5)
    let chosenValue = 'My-New-Value'
    let highestProposal = -1
    for (const p of [p1, p2]) {
      if (p.acceptedProposal !== null && p.acceptedProposal > highestProposal) {
        highestProposal = p.acceptedProposal
        chosenValue = p.acceptedValue!
      }
    }

    // 嚴格保證新提案者承接先前已接受之最高提案值 Committed-Value-X
    expect(chosenValue).toBe('Committed-Value-X')
  })
})
