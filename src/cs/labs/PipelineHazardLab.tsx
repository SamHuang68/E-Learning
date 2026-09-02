import React, { useState } from 'react'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

type HazardScenario = 'alu_raw' | 'load_use'

export const PipelineHazardLab: React.FC<Props> = ({ onEarnXp }) => {
  const [scenario, setScenario] = useState<HazardScenario>('alu_raw')
  const [enableForwarding, setEnableForwarding] = useState<boolean>(true)
  const [hasClaimedXp, setHasClaimedXp] = useState<boolean>(false)

  // 判定停頓週期數與總週期
  const stallCycles =
    scenario === 'alu_raw' ? (enableForwarding ? 0 : 2) : enableForwarding ? 1 : 2
  const totalCycles = 5 + stallCycles

  function handleClaimXp() {
    if (hasClaimedXp) return
    playCorrectSound()
    onEarnXp(15)
    setHasClaimedXp(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflowY: 'auto', paddingRight: '0.4rem' }}>
      {/* 頂部控制面板 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⚡</span> CPU 5級管線冒險與前向傳遞 (Forwarding) 實驗室
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.76rem', color: 'var(--muted)' }}>
            觀察資料冒險 (RAW) 如何引發管線停頓 (Stall)，以及旁路前向傳遞如何消除氣泡
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--surface-soft)', padding: '3px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <button
              type="button"
              onClick={() => setScenario('alu_raw')}
              style={{
                background: scenario === 'alu_raw' ? '#2563eb' : 'transparent',
                color: scenario === 'alu_raw' ? '#fff' : 'var(--text)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ALU-ALU 相依
            </button>
            <button
              type="button"
              onClick={() => setScenario('load_use')}
              style={{
                background: scenario === 'load_use' ? '#2563eb' : 'transparent',
                color: scenario === 'load_use' ? '#fff' : 'var(--text)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Load-Use 相依
            </button>
          </div>

          <button
            type="button"
            onClick={() => setEnableForwarding(!enableForwarding)}
            style={{
              background: enableForwarding ? '#10b981' : '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.76rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            {enableForwarding ? '🟢 Forwarding: 開啟' : '🔴 Forwarding: 關閉'}
          </button>

          {!hasClaimedXp ? (
            <button
              type="button"
              onClick={handleClaimXp}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              領取 +15 XP
            </button>
          ) : (
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>✓ 已掌握 +15 XP</span>
          )}
        </div>
      </div>

      {/* 指令序列與管線週期時序圖 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* 左側：時序表 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563eb' }}>
            📅 5 級管線時序圖 (時脈週期 CC 1 ~ {totalCycles})
          </span>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.78rem', fontFamily: 'monospace' }}>
            <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '0.3rem' }}>
              {scenario === 'alu_raw' ? 'I1: ADD R1, R2, R3 (寫入 R1)' : 'I1: LW R1, 0(R2) (從記憶體載入 R1)'}
            </div>
            <div style={{ fontWeight: 700, color: '#3b82f6' }}>
              {scenario === 'alu_raw' ? 'I2: SUB R4, R1, R5 (讀取 R1 ➜ RAW)' : 'I2: ADD R3, R1, R4 (讀取 R1 ➜ Load-Use)'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowX: 'auto' }}>
            {/* 指令 1 時序 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '70px', fontSize: '0.74rem', fontWeight: 600 }}>指令 1:</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC1: IF</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC2: ID</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC3: EX</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC4: MEM</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC5: WB</span>
            </div>

            {/* 指令 2 時序 (根據是否有 Stall 展開) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '70px', fontSize: '0.74rem', fontWeight: 600 }}>指令 2:</span>
              <span style={{ opacity: 0.2, padding: '3px 8px', fontSize: '0.7rem' }}>-</span>
              <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC2: IF</span>
              <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC3: ID</span>

              {stallCycles === 0 ? (
                <>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC4: EX</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC5: MEM</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC6: WB</span>
                </>
              ) : stallCycles === 1 ? (
                <>
                  <span style={{ background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CC4: STALL</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC5: EX</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC6: MEM</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC7: WB</span>
                </>
              ) : (
                <>
                  <span style={{ background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CC4: STALL</span>
                  <span style={{ background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CC5: STALL</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC6: EX</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC7: MEM</span>
                  <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC8: WB</span>
                </>
              )}
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: stallCycles === 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${stallCycles === 0 ? '#10b981' : '#ef4444'}`, borderRadius: '8px', fontSize: '0.76rem' }}>
            <strong>狀態判定：</strong>
            {stallCycles === 0 ? (
              <span style={{ color: '#10b981', fontWeight: 700 }}> 零停頓 (0 Stall)！EX/MEM 轉發旁路直接將 R1 傳入下一條 EX，完美隱藏延遲。</span>
            ) : stallCycles === 1 ? (
              <span style={{ color: '#ef4444', fontWeight: 700 }}> 停頓 1 週期 (Load-Use Hazard)！資料必須等 MEM 階段讀出後才能 Forwarding。</span>
            ) : (
              <span style={{ color: '#ef4444', fontWeight: 700 }}> 停頓 2 週期！無 Forwarding 支援，必須等待指令 1 在 WB 級寫回暫存器。</span>
            )}
          </div>
        </div>

        {/* 右側：硬體管線結構與考點解析 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981' }}>
            💡 管線冒險 (Pipeline Hazards) 考點精要
          </span>

          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text)', lineHeight: 1.6 }}>
            <li><strong>結構冒險 (Structural Hazard)</strong>：硬體資源衝突（例如指令與資料共享單一記憶體埠），解法為採用 Harvard 架構分離 I-Cache 與 D-Cache。</li>
            <li><strong>資料冒險 (Data Hazard: RAW)</strong>：後續指令需要先前指令的運算結果，透過 <strong>Forwarding (轉發/旁路)</strong> 可大幅減少或消除停頓。</li>
            <li><strong>載入使用冒險 (Load-Use Data Hazard)</strong>：唯一無法被 Forwarding 完全消除的資料冒險，硬體 Hazard Detection Unit 必須強制插入 <strong>1 個 Bubble 氣泡</strong>。</li>
            <li><strong>控制冒險 (Control Hazard)</strong>：分支指令 (Branch) 跳躍與否，解法為<strong>靜態預測、動態 2-bit 飽和計數器與分支目標緩衝區 (BTB)</strong>。</li>
          </ul>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.45 }}>
            🔍 <strong>工程意義：</strong>在現代高性能處理器與 GPU SM（流式多處理器）中，管線化與亂序執行 (Out-of-Order, OoO) 能極限填滿執行單元，是提升 IPC (Instructions Per Cycle) 的核心靈魂。
          </div>
        </div>
      </div>
    </div>
  )
}
