import React from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import type { LangId } from '../../utils/storage'

export type CsNavSection =
  | 'today'
  | 'practice'
  | 'signals'
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
}

export const CsSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  xp,
  errorCount = 0,
}) => {
  const NAV_ITEMS: Array<{ id: CsNavSection; icon: string; title: string; subtitle: string; badge?: string }> = [
    { id: 'today', icon: '💻', title: '今日學習總覽', subtitle: '全景探索與指標' },
    { id: 'practice', icon: '📚', title: '課綱單元題庫', subtitle: '7大單元完整特訓' },
    { id: 'signals', icon: '⚡', title: '3秒破題訊號卡', subtitle: '15組秒殺決策翻轉' },
    { id: 'von-neumann', icon: '⚙️', title: '五大單元實驗室', subtitle: '取指解碼執行寫回' },
    { id: 'pipeline-hazard', icon: '⚡', title: 'CPU 管線冒險', subtitle: 'Forwarding & Stall' },
    { id: 'cache-mapping', icon: '💾', title: '快取位址映射', subtitle: 'Tag · Index · Offset' },
    { id: 'ai-transformer', icon: '🤖', title: 'AI 矩陣與注意力', subtitle: 'GPU GEMM & Attention' },
    { id: 'mock', icon: '📝', title: '期中期末模擬考', subtitle: '計時標準評量診斷' },
    { id: 'errors', icon: '📕', title: '錯題弱點本', subtitle: '盲點複習掌握', badge: errorCount > 0 ? `${errorCount}` : undefined },
  ]

  return (
    <aside className="math-sidebar cs-sidebar" style={{ width: '260px', minWidth: '260px', flexShrink: 0 }}>
      {/* 頂部切換 */}
      <TrackSwitcher current="cs" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />

      {/* 品牌標題 */}
      <div className="sidebar-brand-box" style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>💻</span>
          <div>
            <h2 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 800 }}>計算機概論</h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>軟硬體 · 五大單元 · 前沿AI</span>
          </div>
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
          <span style={{ color: 'var(--muted)' }}>累積經驗值</span>
          <span style={{ fontWeight: 700, color: '#2563eb' }}>{xp} XP</span>
        </div>
      </div>

      {/* 導航選單 */}
      <nav style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`practice-card ${isActive ? 'active' : ''}`}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: isActive ? '2px solid #2563eb' : '1px solid transparent',
                background: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => onSelectSection(item.id)}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.82rem', color: isActive ? '#2563eb' : 'var(--text)' }}>
                    {item.title}
                  </strong>
                  {item.badge && (
                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '999px', background: '#ef4444', color: '#fff', fontWeight: 700 }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.subtitle}
                </span>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
