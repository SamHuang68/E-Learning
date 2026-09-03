import React, { useState } from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import type { LangId } from '../../utils/storage'

export type CsNavSection =
  | 'hierarchy'
  | 'textbook'
  | 'today'
  | 'practice'
  | 'signals'
  | 'arch-map'
  | 'von-neumann'
  | 'pipeline-hazard'
  | 'cache-mapping'
  | 'ai-transformer'
  | 'mock'
  | 'errors'

interface Props {
  activeSection: CsNavSection
  onSelectSection: (section: CsNavSection) => void
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
  xp: number
  errorCount?: number
  completedCount?: number
  totalQuestions?: number
}

export const CsTopNav: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  xp,
  errorCount = 0,
  completedCount = 0,
  totalQuestions = 112,
}) => {
  const [showLabsDropdown, setShowLabsDropdown] = useState(false)

  const isLabActive = [
    'von-neumann',
    'pipeline-hazard',
    'cache-mapping',
    'ai-transformer',
  ].includes(activeSection)

  const LABS_LIST: Array<{ id: CsNavSection; title: string; desc: string; icon: string }> = [
    { id: 'von-neumann', title: '五大單元實驗室', desc: '指令週期取指解碼寫回', icon: '⚙️' },
    { id: 'pipeline-hazard', title: 'CPU 管線冒險', desc: '前推 Forwarding 與停頓 Stall', icon: '⚡' },
    { id: 'cache-mapping', title: '快取映射實驗室', desc: 'Tag · Index · Offset 命中率', icon: '💾' },
    { id: 'ai-transformer', title: 'AI 矩陣注意力', desc: 'SRAM Tiling & GEMM 算子融合', icon: '🤖' },
  ]

  return (
    <header
      className="cs-top-nav"
      style={{
        width: '100%',
        height: '56px',
        flexShrink: 0,
        background: 'rgba(13, 17, 23, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        gap: '0.75rem',
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 左側：品牌識別與指標膠囊 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 'fit-content' }}>
        <button
          type="button"
          onClick={() => onSelectSection('hierarchy')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
          title="返回知識體系階層樹"
        >
          <span style={{ fontSize: '1.4rem' }}>💻</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                計算機概論
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  background: 'rgba(6, 182, 212, 0.18)',
                  color: '#06b6d4',
                  fontWeight: 700,
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                }}
              >
                CS CORE
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'rgba(148, 163, 184, 0.85)', display: 'block', lineHeight: 1.1 }}>
              軟硬體 · 五大單元 · 前沿AI
            </span>
          </div>
        </button>

        {/* 經驗值與錯題狀態膠囊 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.3rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              fontWeight: 700,
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            ⚡ {xp} XP
          </span>

          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontWeight: 700,
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            ✓ {completedCount}/{totalQuestions} 題
          </span>

          {errorCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectSection('errors')}
              style={{
                fontSize: '0.72rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontWeight: 700,
                border: '1px solid rgba(239, 68, 68, 0.35)',
                cursor: 'pointer',
              }}
              title="點擊前往錯題本"
            >
              📕 {errorCount} 錯題
            </button>
          )}
        </div>
      </div>

      {/* 導覽列：劃分明確的【知識研讀 Domain】與【實戰評量 Domain】，題庫與測驗完全分開且為同等權重 */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          overflowX: 'auto',
          padding: '0 0.25rem',
          scrollbarWidth: 'none',
        }}
      >
        {/* === 領域一：知識體系與深度研讀 (Knowledge Domain) === */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.2rem 0.35rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, padding: '0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            知識研讀
          </span>

          {/* 1. 知識階層樹 */}
          <button
            type="button"
            onClick={() => onSelectSection('hierarchy')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'hierarchy' ? 800 : 600,
              background:
                activeSection === 'hierarchy'
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(99, 102, 241, 0.25))'
                  : 'transparent',
              color: activeSection === 'hierarchy' ? '#38bdf8' : 'rgba(226, 232, 240, 0.85)',
              border: activeSection === 'hierarchy' ? '1px solid #38bdf8' : '1px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🌳</span>
            <span>階層樹</span>
          </button>

          {/* 2. 教科書深度研讀 (7大章學術長篇巨著) */}
          <button
            type="button"
            onClick={() => onSelectSection('textbook')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'textbook' ? 800 : 600,
              background: activeSection === 'textbook' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.08)',
              color: activeSection === 'textbook' ? '#38bdf8' : '#7dd3fc',
              border: activeSection === 'textbook' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.3)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📖</span>
            <span>教科書深研 (7章)</span>
          </button>

          {/* 3. 系統硬體架構圖 (Archify 7圖) */}
          <button
            type="button"
            onClick={() => onSelectSection('arch-map')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'arch-map' ? 800 : 600,
              background: activeSection === 'arch-map' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeSection === 'arch-map' ? '#34d399' : 'rgba(226, 232, 240, 0.85)',
              border: activeSection === 'arch-map' ? '1px solid #34d399' : '1px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🏛️</span>
            <span>硬體架構 (Archify 7圖)</span>
          </button>

          {/* 4. 動態實作教具下拉 */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowLabsDropdown(!showLabsDropdown)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '5px',
                fontSize: '0.78rem',
                fontWeight: isLabActive ? 800 : 600,
                background: isLabActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: isLabActive ? '#c084fc' : 'rgba(226, 232, 240, 0.85)',
                border: isLabActive ? '1px solid #c084fc' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🔬</span>
              <span>實作教具 ▾</span>
            </button>

            {showLabsDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#0f172a',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  minWidth: '220px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                {LABS_LIST.map((lab) => (
                  <button
                    key={lab.id}
                    type="button"
                    onClick={() => {
                      onSelectSection(lab.id)
                      setShowLabsDropdown(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '5px',
                      border: 'none',
                      background: activeSection === lab.id ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                      color: activeSection === lab.id ? '#c084fc' : '#e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{lab.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{lab.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{lab.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. 3秒破題訊號卡 */}
          <button
            type="button"
            onClick={() => onSelectSection('signals')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'signals' ? 800 : 600,
              background: activeSection === 'signals' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeSection === 'signals' ? '#fbbf24' : 'rgba(226, 232, 240, 0.85)',
              border: activeSection === 'signals' ? '1px solid #fbbf24' : '1px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>⚡</span>
            <span>破題訊號 (23組)</span>
          </button>
        </div>

        {/* === 領域二：實戰評量與能力檢驗 (Assessment Domain - 題庫與測驗完全分開，具備相同一級比重) === */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.2rem 0.35rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, padding: '0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            實戰評量
          </span>

          {/* 6. 單元題庫自主練習 (Formative Practice - 112題) */}
          <button
            type="button"
            onClick={() => onSelectSection('practice')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'practice' ? 800 : 600,
              background: activeSection === 'practice' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: activeSection === 'practice' ? '#818cf8' : 'rgba(226, 232, 240, 0.85)',
              border: activeSection === 'practice' ? '1px solid #818cf8' : '1px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📚</span>
            <span>單元題庫練習 (112題)</span>
          </button>

          {/* 7. 全真模擬測驗 (Summative Mock Exam - 全真計時與等第診斷) */}
          <button
            type="button"
            onClick={() => onSelectSection('mock')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'mock' ? 800 : 600,
              background: activeSection === 'mock' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
              color: activeSection === 'mock' ? '#fb7185' : 'rgba(226, 232, 240, 0.85)',
              border: activeSection === 'mock' ? '1px solid #fb7185' : '1px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📝</span>
            <span>全真模擬測驗 (計時考)</span>
          </button>

          {/* 8. 個人錯題弱點本 */}
          <button
            type="button"
            onClick={() => onSelectSection('errors')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              fontWeight: activeSection === 'errors' ? 800 : 600,
              background: activeSection === 'errors' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              color: activeSection === 'errors' ? '#f87171' : 'rgba(226, 232, 240, 0.85)',
              border: activeSection === 'errors' ? '1px solid #f87171' : '1px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>❌</span>
            <span>錯題本 {errorCount > 0 ? `(${errorCount})` : ''}</span>
          </button>
        </div>

        {/* 9. 今日概覽 */}
        <button
          type="button"
          onClick={() => onSelectSection('today')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: activeSection === 'today' ? 800 : 600,
            background: activeSection === 'today' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: activeSection === 'today' ? '#818cf8' : 'rgba(226, 232, 240, 0.85)',
            border: activeSection === 'today' ? '1px solid #818cf8' : '1px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🎯</span>
          <span>今日進度</span>
        </button>
      </nav>

      {/* 右側：學科切換工具 */}
      <div style={{ minWidth: 'fit-content' }}>
        <TrackSwitcher current="cs" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      </div>
    </header>
  )
}
