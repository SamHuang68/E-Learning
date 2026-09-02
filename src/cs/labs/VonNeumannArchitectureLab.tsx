import React, { useState } from 'react'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

type MachineCycleStep = 'fetch' | 'decode' | 'execute' | 'writeback'

export const VonNeumannArchitectureLab: React.FC<Props> = ({ onEarnXp }) => {
  const [cycleStep, setCycleStep] = useState<MachineCycleStep>('fetch')
  const [pc, setPc] = useState(0x0100)
  const [ir, setIr] = useState('ADD R1, #5')
  const [acc, setAcc] = useState(12)
  const [r1, setR1] = useState(7)
  const [flagZ, setFlagZ] = useState(false)
  const [flagC, setFlagC] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [claimedXp, setClaimedXp] = useState(false)

  const stepLabels: Record<MachineCycleStep, { title: string; desc: string; bus: string }> = {
    fetch: {
      title: '1. 取指階段 (Instruction Fetch)',
      desc: 'CU 控制單元依據程式計數器 (PC=0x0100) 發送位址匯流排訊號，從主記憶體 (RAM) 讀取指令機器碼並存入指令暫存器 (IR)。PC 自動遞增 (+1)。',
      bus: '位址匯流排 (Address Bus) 傳送 0x0100 ➜ 資料匯流排傳回指令編碼',
    },
    decode: {
      title: '2. 解碼階段 (Instruction Decode)',
      desc: '控制單元 (CU) 解析指令暫存器 (IR: ADD R1, #5) 中的操作碼 (Opcode: 加法) 與運算元 (Operand: R1 暫存器與數值 5)，啟動內部控制訊號。',
      bus: '控制匯流排 (Control Bus) 向 ALU 與暫存器檔案發出加法控制脈衝',
    },
    execute: {
      title: '3. 執行階段 (ALU Execute)',
      desc: '算術邏輯單元 (ALU) 接收暫存器 R1 之數值 (7) 與立即值 (5)，並行二進位加法運算：7 + 5 = 12，並即時更新條件狀態旗標 (Flags)。',
      bus: '內部高速暫存器匯流排資料進入 ALU 加法器電路運算',
    },
    writeback: {
      title: '4. 寫回階段 (Memory / Register Writeback)',
      desc: 'ALU 計算出的運算結果 (12) 透過內部資料匯流排寫回累加器 (ACC) 或目標暫存器 R1，完成該機器指令週期。',
      bus: '資料匯流排將 12 寫入累加器 (ACC=12)，週期結束準備執行下一條指令',
    },
  }

  function handleNextStep() {
    playCorrectSound()
    setStepCount((prev) => prev + 1)

    if (cycleStep === 'fetch') {
      setCycleStep('decode')
    } else if (cycleStep === 'decode') {
      setCycleStep('execute')
    } else if (cycleStep === 'execute') {
      setCycleStep('writeback')
      setAcc(r1 + 5)
      setFlagZ(r1 + 5 === 0)
      setFlagC(r1 + 5 > 255)
    } else {
      setCycleStep('fetch')
      setPc((prev) => prev + 1)
      setR1((prev) => (prev + 3) % 50)
      setIr(`ADD R1, #${(stepCount % 7) + 2}`)
    }

    if (!claimedXp && stepCount >= 3) {
      setClaimedXp(true)
      onEarnXp(15)
    }
  }

  function handleReset() {
    setCycleStep('fetch')
    setPc(0x0100)
    setIr('ADD R1, #5')
    setAcc(12)
    setR1(7)
    setFlagZ(false)
    setFlagC(false)
    setStepCount(0)
  }

  const currentInfo = stepLabels[cycleStep]

  return (
    <div className="math-lab von-neumann-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⚙️</span> 馮紐曼五大單元動態資料流與機器週期實驗室
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            即時視覺化 CPU 機器週期：取指 (Fetch) ➜ 解碼 (Decode) ➜ 執行 (Execute) ➜ 寫回 (Writeback)，掌握 PC、IR、ALU 與系統匯流排本質！
          </p>
        </div>
      </div>

      {/* 控制與資訊儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(16, 185, 129, 0.12))',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          marginBottom: '0.85rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem' }}>
            {cycleStep === 'fetch' ? '📥' : cycleStep === 'decode' ? '🔍' : cycleStep === 'execute' ? '⚡' : '💾'}
          </div>
          <div>
            <strong style={{ fontSize: '0.92rem', display: 'block', color: '#2563eb' }}>
              當前時脈階段：{currentInfo.title}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text)', display: 'block', maxWidth: '620px' }}>
              {currentInfo.desc}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, display: 'block', marginTop: '0.2rem' }}>
              🚌 匯流排訊號：{currentInfo.bus}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            }}
            onClick={handleNextStep}
          >
            ▶ 單步時脈脈衝 (Step Cycle)
          </button>
          <button
            type="button"
            className="pill-btn"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.74rem' }}
            onClick={handleReset}
          >
            ↺ 重設 (Reset)
          </button>
        </div>
      </div>

      {/* 馮紐曼五大單元可視化架構圖 (SVG) */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '0.85rem',
        }}
      >
        <svg
          viewBox="0 0 760 280"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          aria-label="馮紐曼五大功能單元架構圖"
        >
          {/* 背景 CPU 晶片邊界 */}
          <rect x="20" y="20" width="460" height="240" rx="12" fill="rgba(37, 99, 235, 0.05)" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
          <text x="35" y="42" fill="#2563eb" fontSize="12" fontWeight="bold">中央處理器 CPU (Central Processing Unit)</text>

          {/* 1. 控制單元 (CU) */}
          <rect
            x="40"
            y="60"
            width="200"
            height="180"
            rx="8"
            fill={cycleStep === 'fetch' || cycleStep === 'decode' ? 'rgba(59, 130, 246, 0.25)' : 'var(--surface-soft)'}
            stroke={cycleStep === 'fetch' || cycleStep === 'decode' ? '#2563eb' : 'var(--line)'}
            strokeWidth="2"
          />
          <text x="55" y="85" fill="var(--text)" fontSize="13" fontWeight="bold">🎮 控制單元 (Control Unit, CU)</text>
          <text x="55" y="108" fill="var(--muted)" fontSize="11">程式計數器 PC: 0x{pc.toString(16).toUpperCase()}</text>
          <text x="55" y="128" fill="var(--muted)" fontSize="11">指令暫存器 IR: {ir}</text>
          <text x="55" y="148" fill="var(--muted)" fontSize="11">時序產生器 (Clock Cycle)</text>
          <text x="55" y="168" fill="var(--muted)" fontSize="11">指令解碼器 (Instruction Decoder)</text>
          <rect x="55" y="185" width="170" height="40" rx="4" fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" />
          <text x="65" y="208" fill="#2563eb" fontSize="11" fontWeight="bold">
            狀態：{cycleStep === 'fetch' ? '📥 取指中' : cycleStep === 'decode' ? '🔍 解碼中' : '等待執行結果'}
          </text>

          {/* 2. 算術邏輯單元 (ALU) */}
          <rect
            x="260"
            y="60"
            width="200"
            height="180"
            rx="8"
            fill={cycleStep === 'execute' || cycleStep === 'writeback' ? 'rgba(16, 185, 129, 0.25)' : 'var(--surface-soft)'}
            stroke={cycleStep === 'execute' || cycleStep === 'writeback' ? '#10b981' : 'var(--line)'}
            strokeWidth="2"
          />
          <text x="275" y="85" fill="var(--text)" fontSize="13" fontWeight="bold">⚡ 算術邏輯單元 (ALU)</text>
          <text x="275" y="108" fill="var(--muted)" fontSize="11">暫存器 R1: {r1}</text>
          <text x="275" y="128" fill="var(--muted)" fontSize="11">累加器 ACC: {acc}</text>
          <text x="275" y="148" fill="var(--muted)" fontSize="11">旗標 Flags: [Z={flagZ ? '1' : '0'}, C={flagC ? '1' : '0'}]</text>
          <rect x="275" y="185" width="170" height="40" rx="4" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" />
          <text x="285" y="208" fill="#10b981" fontSize="11" fontWeight="bold">
            狀態：{cycleStep === 'execute' ? '⚡ 運算中 (R1 + 5)' : cycleStep === 'writeback' ? '💾 結果寫回 ACC' : '待命'}
          </text>

          {/* 3. 記憶體單元 (Memory Unit) */}
          <rect
            x="510"
            y="60"
            width="230"
            height="180"
            rx="8"
            fill={cycleStep === 'fetch' || cycleStep === 'writeback' ? 'rgba(217, 119, 6, 0.2)' : 'var(--surface-soft)'}
            stroke={cycleStep === 'fetch' || cycleStep === 'writeback' ? '#d97706' : 'var(--line)'}
            strokeWidth="2"
          />
          <text x="525" y="85" fill="var(--text)" fontSize="13" fontWeight="bold">💾 記憶體單元 (Memory Unit, MU)</text>
          <text x="525" y="108" fill="var(--muted)" fontSize="11">主記憶體 (RAM: DRAM)</text>
          <text x="525" y="128" fill="var(--muted)" fontSize="11">[0x0100]: ADD R1, #5</text>
          <text x="525" y="148" fill="var(--muted)" fontSize="11">[0x0101]: MOV R2, ACC</text>
          <text x="525" y="168" fill="var(--muted)" fontSize="11">[0x0102]: HALT</text>
          <rect x="525" y="185" width="200" height="40" rx="4" fill="rgba(217, 119, 6, 0.1)" stroke="#d97706" />
          <text x="535" y="208" fill="#d97706" fontSize="11" fontWeight="bold">
            存取：{cycleStep === 'fetch' ? '讀取 0x0100 指令' : cycleStep === 'writeback' ? '儲存暫存資料' : '維持現況'}
          </text>

          {/* 匯流排連線 (Bus Lines) */}
          <line x1="240" y1="120" x2="260" y2="120" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="460" y1="120" x2="510" y2="120" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow)" />
          <text x="468" y="112" fill="#d97706" fontSize="9" fontWeight="bold">系統匯流排</text>
        </svg>
      </div>

      {/* 五大單元速記對照 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.5rem' }}>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block' }}>🎮 控制單元 (CU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>指令取指解碼、控制脈衝、PC/IR暫存器</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#10b981', display: 'block' }}>⚡ 算術邏輯 (ALU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>二進位加減、邏輯比較、條件狀態旗標</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#d97706', display: 'block' }}>💾 記憶單元 (MU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>階層快取 (L1~L3)、主記憶體 RAM、虛擬記憶體</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#8b5cf6', display: 'block' }}>⌨️ 輸入單元 (IU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>鍵盤滑鼠、相機、麥克風 ADC 取樣傳入</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#ec4899', display: 'block' }}>🖥️ 輸出單元 (OU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>螢幕 GPU 顯示、音訊 DAC 揚聲器輸出</span>
        </div>
      </div>
    </div>
  )
}
