import React, { useState } from 'react'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'

interface Props {
  onEarnXp: (amount: number) => void
}

type MachineCycleStep = 'fetch' | 'decode' | 'execute' | 'writeback'

export const VonNeumannArchitectureLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const copy = (zhHant: string, en: string) => locale === 'en' ? en : zhHant
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
      title: copy('1. 取指階段 (Instruction Fetch)', '1. Instruction Fetch'),
      desc: copy('CU 依據程式計數器 (PC=0x0100) 送出位址，從 RAM 讀取機器碼至指令暫存器 (IR)，再讓 PC 遞增。', 'The control unit sends PC=0x0100 on the address bus, reads the machine instruction from RAM into the instruction register, and increments the PC.'),
      bus: copy('位址匯流排送出 0x0100；資料匯流排傳回指令編碼。', 'The address bus carries 0x0100; the data bus returns the instruction encoding.'),
    },
    decode: {
      title: copy('2. 解碼階段 (Instruction Decode)', '2. Instruction Decode'),
      desc: copy('控制單元解析 IR 中 ADD R1, #5 的操作碼與運算元，並啟動內部控制訊號。', 'The control unit decodes the opcode and operands in IR instruction ADD R1, #5 and activates internal control signals.'),
      bus: copy('控制匯流排向 ALU 與暫存器檔案發出加法控制脈衝。', 'The control bus sends an add control pulse to the ALU and register file.'),
    },
    execute: {
      title: copy('3. 執行階段 (ALU Execute)', '3. ALU Execute'),
      desc: copy('ALU 接收 R1 的值 7 與立即值 5，計算 7 + 5 = 12，並更新條件旗標。', 'The ALU receives R1 value 7 and immediate value 5, computes 7 + 5 = 12, and updates the condition flags.'),
      bus: copy('內部暫存器匯流排將資料送入 ALU 加法器。', 'The internal register bus delivers the operands to the ALU adder.'),
    },
    writeback: {
      title: copy('4. 寫回階段 (Memory / Register Writeback)', '4. Register Writeback'),
      desc: copy('ALU 結果 12 經內部資料匯流排寫回累加器或目標暫存器，完成指令週期。', 'The result 12 returns through the internal data bus to the accumulator or destination register, completing the instruction cycle.'),
      bus: copy('資料匯流排將 12 寫入 ACC；處理器準備下一條指令。', 'The data bus writes 12 to ACC; the processor prepares the next instruction.'),
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
            <span>⚙️</span> {copy('馮紐曼五大單元動態資料流與機器週期實驗室', 'Von Neumann Dataflow and Machine-Cycle Lab')}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {copy('視覺化 CPU 的取指、解碼、執行與寫回週期，以及 PC、IR、ALU 與系統匯流排。', 'Visualize the CPU fetch, decode, execute, and writeback cycle together with the PC, IR, ALU, and system buses.')}
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
              {copy('當前時脈階段：', 'Current clock stage:')}{currentInfo.title}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text)', display: 'block', maxWidth: '620px' }}>
              {currentInfo.desc}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, display: 'block', marginTop: '0.2rem' }}>
              🚌 {copy('匯流排訊號：', 'Bus activity:')}{currentInfo.bus}
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
            {copy('▶ 單步時脈脈衝', '▶ Step one clock cycle')}
          </button>
          <button
            type="button"
            className="pill-btn"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.74rem' }}
            onClick={handleReset}
          >
            {copy('↺ 重設', '↺ Reset')}
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
          aria-label={copy('馮紐曼五大功能單元架構圖', 'Von Neumann functional-unit architecture')}
        >
          {/* 背景 CPU 晶片邊界 */}
          <rect x="20" y="20" width="460" height="240" rx="12" fill="rgba(37, 99, 235, 0.05)" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
          <text x="35" y="42" fill="#2563eb" fontSize="12" fontWeight="bold">{copy('中央處理器 CPU', 'Central Processing Unit')}</text>

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
          <text x="55" y="85" fill="var(--text)" fontSize="13" fontWeight="bold">🎮 {copy('控制單元 (CU)', 'Control Unit (CU)')}</text>
          <text x="55" y="108" fill="var(--muted)" fontSize="11">{copy('程式計數器', 'Program Counter')} PC: 0x{pc.toString(16).toUpperCase()}</text>
          <text x="55" y="128" fill="var(--muted)" fontSize="11">{copy('指令暫存器', 'Instruction Register')} IR: {ir}</text>
          <text x="55" y="148" fill="var(--muted)" fontSize="11">{copy('時序產生器', 'Clock generator')}</text>
          <text x="55" y="168" fill="var(--muted)" fontSize="11">{copy('指令解碼器', 'Instruction decoder')}</text>
          <rect x="55" y="185" width="170" height="40" rx="4" fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" />
          <text x="65" y="208" fill="#2563eb" fontSize="11" fontWeight="bold">
            {copy('狀態：', 'State:')}{cycleStep === 'fetch'
              ? copy('📥 取指中', '📥 Fetching')
              : cycleStep === 'decode'
                ? copy('🔍 解碼中', '🔍 Decoding')
                : copy('等待執行結果', 'Waiting for execution')}
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
          <text x="275" y="85" fill="var(--text)" fontSize="13" fontWeight="bold">⚡ {copy('算術邏輯單元', 'Arithmetic Logic Unit')} (ALU)</text>
          <text x="275" y="108" fill="var(--muted)" fontSize="11">{copy('暫存器', 'Register')} R1: {r1}</text>
          <text x="275" y="128" fill="var(--muted)" fontSize="11">{copy('累加器', 'Accumulator')} ACC: {acc}</text>
          <text x="275" y="148" fill="var(--muted)" fontSize="11">{copy('旗標', 'Flags')}: [Z={flagZ ? '1' : '0'}, C={flagC ? '1' : '0'}]</text>
          <rect x="275" y="185" width="170" height="40" rx="4" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" />
          <text x="285" y="208" fill="#10b981" fontSize="11" fontWeight="bold">
            {copy('狀態：', 'State:')}{cycleStep === 'execute'
              ? copy('⚡ 運算中 (R1 + 5)', '⚡ Executing R1 + 5')
              : cycleStep === 'writeback'
                ? copy('💾 結果寫回 ACC', '💾 Writing result to ACC')
                : copy('待命', 'Idle')}
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
          <text x="525" y="85" fill="var(--text)" fontSize="13" fontWeight="bold">💾 {copy('記憶體單元 (MU)', 'Memory Unit (MU)')}</text>
          <text x="525" y="108" fill="var(--muted)" fontSize="11">{copy('主記憶體', 'Main memory')} (RAM: DRAM)</text>
          <text x="525" y="128" fill="var(--muted)" fontSize="11">[0x0100]: ADD R1, #5</text>
          <text x="525" y="148" fill="var(--muted)" fontSize="11">[0x0101]: MOV R2, ACC</text>
          <text x="525" y="168" fill="var(--muted)" fontSize="11">[0x0102]: HALT</text>
          <rect x="525" y="185" width="200" height="40" rx="4" fill="rgba(217, 119, 6, 0.1)" stroke="#d97706" />
          <text x="535" y="208" fill="#d97706" fontSize="11" fontWeight="bold">
            {copy('存取：', 'Access:')}{cycleStep === 'fetch'
              ? copy('讀取 0x0100 指令', 'read instruction at 0x0100')
              : cycleStep === 'writeback'
                ? copy('儲存暫存資料', 'store temporary data')
                : copy('維持現況', 'no memory transfer')}
          </text>

          {/* 匯流排連線 (Bus Lines) */}
          <line x1="240" y1="120" x2="260" y2="120" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="460" y1="120" x2="510" y2="120" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow)" />
          <text x="468" y="112" fill="#d97706" fontSize="9" fontWeight="bold">{copy('系統匯流排', 'System bus')}</text>
        </svg>
      </div>

      {/* 五大單元速記對照 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.5rem' }}>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block' }}>🎮 {copy('控制單元', 'Control Unit')} (CU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{copy('取指與解碼、控制脈衝、PC/IR 暫存器', 'Instruction fetch and decode, control pulses, and PC/IR registers')}</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#10b981', display: 'block' }}>⚡ {copy('算術邏輯', 'Arithmetic Logic')} (ALU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{copy('二進位算術、邏輯比較與條件旗標', 'Binary arithmetic, logical comparisons, and condition flags')}</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#d97706', display: 'block' }}>💾 {copy('記憶單元', 'Memory Unit')} (MU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{copy('L1–L3 快取、主記憶體與虛擬記憶體', 'L1–L3 caches, main memory, and virtual memory')}</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#8b5cf6', display: 'block' }}>⌨️ {copy('輸入單元', 'Input Unit')} (IU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{copy('鍵盤、滑鼠、相機與麥克風 ADC 輸入', 'Keyboard, mouse, camera, and microphone ADC input')}</span>
        </div>
        <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <strong style={{ fontSize: '0.8rem', color: '#ec4899', display: 'block' }}>🖥️ {copy('輸出單元', 'Output Unit')} (OU)</strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{copy('GPU 顯示輸出與 DAC 揚聲器音訊', 'GPU display output and DAC speaker audio')}</span>
        </div>
      </div>
    </div>
  )
}
