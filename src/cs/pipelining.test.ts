import { describe, it, expect } from 'vitest'

/**
 * CPU 管線化流水線 (Pipelining) 與冒險處理 (Hazards) 核心模型
 * 
 * 經典 5 級 RISC 管線：
 * 1. IF (Instruction Fetch, 取指)
 * 2. ID (Instruction Decode & Register Fetch, 解碼與暫存器讀取)
 * 3. EX (Execute / Address Calculation, 執行與位址計算)
 * 4. MEM (Memory Access, 記憶體訪存)
 * 5. WB (Writeback, 寫回暫存器)
 */

export interface PipelineSimulation {
  instructionCount: number
  clockCyclesIdeal: number
  clockCyclesWithStalls: number
  speedupIdeal: number
  speedupActual: number
}

/**
 * 計算理想 5 級管線 vs 無管線 (Single Cycle) 之時脈週期與加速比
 * 無管線每條指令需 5 週期 (或單一長週期 5T)；管線化在穩態下每個週期完成一條指令。
 * N 條指令所需週期數：Cycles = k + (N - 1)，其中 k = 5 級
 */
export function calculatePipelineSpeedup(
  instructionCount: number,
  stalls: number = 0,
  stages: number = 5,
): PipelineSimulation {
  const clockCyclesIdeal = stages + (instructionCount - 1)
  const clockCyclesWithStalls = clockCyclesIdeal + stalls
  const singleCycleTime = instructionCount * stages

  const speedupIdeal = Number((singleCycleTime / clockCyclesIdeal).toFixed(2))
  const speedupActual = Number((singleCycleTime / clockCyclesWithStalls).toFixed(2))

  return {
    instructionCount,
    clockCyclesIdeal,
    clockCyclesWithStalls,
    speedupIdeal,
    speedupActual,
  }
}

/**
 * 檢測資料相依性 (Data Hazard) 類型與前向傳遞 (Forwarding / Bypassing)
 * 
 * 指令 i: ADD R1, R2, R3 (R1 寫回在 WB 級)
 * 指令 i+1: SUB R4, R1, R5 (R1 讀取在 ID 級) ➜ 產生 RAW (Read-After-Write) 資料冒險！
 * 
 * 若有硬體轉發 (Forwarding)：
 * EX/MEM 暫存器可直接將 ALU 運算結果拉線回傳給下一個週期的 ALU 輸入端，無需停頓 (Stall 0)！
 * 
 * 但若前一條為載入指令 (Load-Use Data Hazard):
 * 指令 i: LW R1, 0(R2) (資料要到 MEM 級結束才能取得)
 * 指令 i+1: ADD R3, R1, R4
 * 即使有 Forwarding，仍必須硬體停頓 1 個時脈週期 (Stall = 1)！
 */
export function detectDataHazard(
  prevOp: 'ALU' | 'LW',
  prevDestReg: string,
  currentSrcReg: string,
  hasForwarding: boolean,
): { hasHazard: boolean; stallCycles: number; canBypass: boolean } {
  if (prevDestReg !== currentSrcReg) {
    return { hasHazard: false, stallCycles: 0, canBypass: false }
  }

  // 相同暫存器，存在 RAW 相依
  if (prevOp === 'ALU') {
    if (hasForwarding) {
      return { hasHazard: true, stallCycles: 0, canBypass: true }
    } else {
      // 無轉發需等待 WB 完成，停頓 2 週期
      return { hasHazard: true, stallCycles: 2, canBypass: false }
    }
  } else {
    // prevOp === 'LW' (Load-Use Hazard)
    if (hasForwarding) {
      // 即使有轉發，資料從 MEM 才能送出，下一條 EX 需要它，必須停頓 1 週期
      return { hasHazard: true, stallCycles: 1, canBypass: true }
    } else {
      return { hasHazard: true, stallCycles: 2, canBypass: false }
    }
  }
}

/**
 * 動態分支預測 (Dynamic Branch Prediction) 2-bit 飽和計數器狀態機
 * 狀態：
 * 00: Strongly Not Taken (SNT)
 * 01: Weakly Not Taken (WNT)
 * 10: Weakly Taken (WT)
 * 11: Strongly Taken (ST)
 */
export type SaturatingCounterState = 'SNT' | 'WNT' | 'WT' | 'ST'

export function updateBranchPredictor(
  currentState: SaturatingCounterState,
  actualTaken: boolean,
): { nextState: SaturatingCounterState; predictedTaken: boolean; nextPrediction: boolean } {
  const predictedTaken = currentState === 'WT' || currentState === 'ST'

  let nextState: SaturatingCounterState = currentState
  if (actualTaken) {
    if (currentState === 'SNT') nextState = 'WNT'
    else if (currentState === 'WNT') nextState = 'WT'
    else if (currentState === 'WT') nextState = 'ST'
    else nextState = 'ST'
  } else {
    if (currentState === 'ST') nextState = 'WT'
    else if (currentState === 'WT') nextState = 'WNT'
    else if (currentState === 'WNT') nextState = 'SNT'
    else nextState = 'SNT'
  }

  const nextPrediction = nextState === 'WT' || nextState === 'ST'
  return { nextState, predictedTaken, nextPrediction }
}

describe('CPU 管線化 (Pipelining) 與冒險處理單元測試', () => {
  it('100 條指令在理想 5 級管線下的時脈週期與極限加速比計算', () => {
    const sim = calculatePipelineSpeedup(100, 0, 5)
    // 5 + (100 - 1) = 104 cycles
    expect(sim.clockCyclesIdeal).toBe(104)
    // 500 / 104 ≈ 4.81x
    expect(sim.speedupIdeal).toBe(4.81)

    // 當指令數趨向極大時 (如 1,000,000 條)，加速比逼近管線級數 5.0x
    const simMillion = calculatePipelineSpeedup(1000000, 0, 5)
    expect(simMillion.speedupIdeal).toBe(5.0)
  })

  it('ALU 運算指令相依 (RAW) 在有/無前向傳遞 (Forwarding) 之停頓判定', () => {
    // 無 Forwarding：ADD R1, R2, R3 緊接 SUB R4, R1, R5 需停頓 2 週期等待寫回
    const noFwd = detectDataHazard('ALU', 'R1', 'R1', false)
    expect(noFwd.hasHazard).toBe(true)
    expect(noFwd.stallCycles).toBe(2)
    expect(noFwd.canBypass).toBe(false)

    // 有 Forwarding：EX/MEM 直接旁路傳遞給下一個 EX，無需停頓 (0 stall)
    const withFwd = detectDataHazard('ALU', 'R1', 'R1', true)
    expect(withFwd.hasHazard).toBe(true)
    expect(withFwd.stallCycles).toBe(0)
    expect(withFwd.canBypass).toBe(true)
  })

  it('載入使用相依 (Load-Use Data Hazard) 即使有 Forwarding 仍必停頓 1 週期', () => {
    // LW R1, 0(R2) 緊接 ADD R3, R1, R4
    const loadUse = detectDataHazard('LW', 'R1', 'R1', true)
    expect(loadUse.hasHazard).toBe(true)
    expect(loadUse.stallCycles).toBe(1) // 關鍵考點：Load-Use 無法由純 Forwarding 完全消除
    expect(loadUse.canBypass).toBe(true)
  })

  it('2-bit 飽和計數器分支預測狀態機正確轉換與兩次失誤才反轉機制', () => {
    // 初始狀態為 Strongly Taken (ST)
    let state: SaturatingCounterState = 'ST'

    // 第一次分支未發生 (Not Taken) ➜ 降為 Weakly Taken (WT)，下一次仍預測 Taken
    let res = updateBranchPredictor(state, false)
    expect(res.predictedTaken).toBe(true)
    expect(res.nextState).toBe('WT')
    expect(res.nextPrediction).toBe(true) // 依然預測 Taken
    state = res.nextState

    // 第二次分支依然未發生 ➜ 降為 Weakly Not Taken (WNT)，此時下一輪預測反轉為 Not Taken
    res = updateBranchPredictor(state, false)
    expect(res.predictedTaken).toBe(true) // 進入時是 WT
    expect(res.nextState).toBe('WNT')
    expect(res.nextPrediction).toBe(false) // 兩次失誤後正式反轉為 Not Taken
    state = res.nextState

    // 分支發生 (Taken) ➜ 升回 Weakly Taken (WT)
    res = updateBranchPredictor(state, true)
    expect(res.nextState).toBe('WT')
    expect(res.nextPrediction).toBe(true)
  })
})
