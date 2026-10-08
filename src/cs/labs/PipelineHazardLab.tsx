import React, { useState } from 'react'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'

interface Props {
  onEarnXp: (amount: number) => void
}

type HazardScenario = 'alu_raw' | 'load_use'

export const PipelineHazardLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const copy = (zhHant: string, en: string) => locale === 'en' ? en : zhHant
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
            <span>⚡</span> {copy('CPU 5級管線冒險與前向傳遞 (Forwarding) 實驗室', 'Five-Stage CPU Pipeline Hazards and Forwarding Lab')}
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.76rem', color: 'var(--muted)' }}>
            {copy('觀察資料冒險 (RAW) 如何引發管線停頓 (Stall)，以及旁路前向傳遞如何消除氣泡', 'Observe how a read-after-write data hazard stalls a pipeline and how bypass forwarding removes bubbles.')}
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
              {copy('ALU-ALU 相依', 'ALU-to-ALU dependency')}
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
              {copy('Load-Use 相依', 'Load-use dependency')}
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
            {enableForwarding ? copy('🟢 Forwarding: 開啟', '🟢 Forwarding: on') : copy('🔴 Forwarding: 關閉', '🔴 Forwarding: off')}
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
              {copy('領取 +15 XP', 'Claim +15 XP')}
            </button>
          ) : (
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>{copy('✓ 已掌握 +15 XP', '✓ Mastered +15 XP')}</span>
          )}
        </div>
      </div>

      {/* 指令序列與管線週期時序圖 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* 左側：時序表 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563eb' }}>
            {copy('📅 5 級管線時序圖', '📅 Five-stage pipeline timing')} ({copy('時脈週期', 'clock cycles')} CC 1–{totalCycles})
          </span>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.78rem', fontFamily: 'monospace' }}>
            <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '0.3rem' }}>
              {scenario === 'alu_raw'
                ? copy('I1: ADD R1, R2, R3 (寫入 R1)', 'I1: ADD R1, R2, R3 (writes R1)')
                : copy('I1: LW R1, 0(R2) (從記憶體載入 R1)', 'I1: LW R1, 0(R2) (loads R1 from memory)')}
            </div>
            <div style={{ fontWeight: 700, color: '#3b82f6' }}>
              {scenario === 'alu_raw'
                ? copy('I2: SUB R4, R1, R5 (讀取 R1 ➜ RAW)', 'I2: SUB R4, R1, R5 (reads R1 ➜ RAW)')
                : copy('I2: ADD R3, R1, R4 (讀取 R1 ➜ Load-Use)', 'I2: ADD R3, R1, R4 (reads R1 ➜ load-use)')}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowX: 'auto' }}>
            {/* 指令 1 時序 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '70px', fontSize: '0.74rem', fontWeight: 600 }}>{copy('指令 1:', 'Instruction 1:')}</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC1: IF</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC2: ID</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC3: EX</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC4: MEM</span>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CC5: WB</span>
            </div>

            {/* 指令 2 時序 (根據是否有 Stall 展開) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '70px', fontSize: '0.74rem', fontWeight: 600 }}>{copy('指令 2:', 'Instruction 2:')}</span>
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
            <strong>{copy('狀態判定：', 'Result:')}</strong>
            {stallCycles === 0 ? (
              <span style={{ color: '#10b981', fontWeight: 700 }}> {copy('零停頓 (0 Stall)！EX/MEM 轉發旁路直接將 R1 傳入下一條 EX，完美隱藏延遲。', 'Zero stalls. The EX/MEM bypass forwards R1 directly to the next EX stage and hides the dependency latency.')}</span>
            ) : stallCycles === 1 ? (
              <span style={{ color: '#ef4444', fontWeight: 700 }}> {copy('停頓 1 週期 (Load-Use Hazard)！資料必須等 MEM 階段讀出後才能 Forwarding。', 'One-cycle stall for the load-use hazard. Forwarding must wait until the MEM stage returns the data.')}</span>
            ) : (
              <span style={{ color: '#ef4444', fontWeight: 700 }}> {copy('停頓 2 週期！無 Forwarding 支援，必須等待指令 1 在 WB 級寫回暫存器。', 'Two-cycle stall. Without forwarding, instruction 2 must wait for instruction 1 to write the register in WB.')}</span>
            )}
          </div>
        </div>

        {/* 右側：硬體管線結構與考點解析 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981' }}>
            {copy('💡 管線冒險 (Pipeline Hazards) 考點精要', '💡 Pipeline-Hazard Essentials')}
          </span>

          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text)', lineHeight: 1.6 }}>
            <li>{copy('結構冒險：硬體資源衝突，例如指令與資料共享單一記憶體埠；Harvard 架構以分離 I-Cache 與 D-Cache 解決。', 'Structural hazard: hardware resources conflict, such as instructions and data sharing one memory port; a Harvard design separates the I-Cache and D-Cache.')}</li>
            <li>{copy('資料冒險 (RAW)：後續指令需要先前指令的結果，轉發或旁路可大幅減少或消除停頓。', 'RAW data hazard: a later instruction needs an earlier result; forwarding or bypassing can reduce or eliminate the stall.')}</li>
            <li>{copy('載入使用冒險：資料到 MEM 階段才可用，因此偵測單元即使有轉發也必須插入 1 個 Bubble。', 'Load-use hazard: the value is not ready until MEM, so the hazard-detection unit must insert one bubble even with forwarding.')}</li>
            <li>{copy('控制冒險：分支方向未知；可用靜態預測、動態 2-bit 飽和計數器與分支目標緩衝區 (BTB)。', 'Control hazard: the branch direction is unknown; mitigations include static prediction, a dynamic two-bit saturating counter, and a branch target buffer.')}</li>
          </ul>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.45 }}>
            🔍 <strong>{copy('工程意義：', 'Engineering significance:')}</strong>{copy('在現代高性能處理器與 GPU SM 中，管線化與亂序執行可維持執行單元忙碌，是提升 IPC 的核心技術。', 'In modern high-performance processors and GPU streaming multiprocessors, pipelining and out-of-order execution keep functional units busy and raise instructions per cycle.')}
          </div>
        </div>
      </div>
    </div>
  )
}
