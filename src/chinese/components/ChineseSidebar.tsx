import React from 'react'

export type ChineseNavSection = 'today' | 'pinyin' | 'false-friends' | 'signals' | 'conversations'

interface Props {
  activeSection: ChineseNavSection
  onSelectSection: (section: ChineseNavSection) => void
  onBackHub: () => void
  xp: number
}

export const ChineseSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  xp,
}) => {
  const NAV_ITEMS: Array<{ id: ChineseNavSection; icon: string; title: string; subtitle: string }> = [
    { id: 'today', icon: '🌸', title: '今日學習總覽', subtitle: '今日の学習ダッシュボード' },
    { id: 'pinyin', icon: '🗣️', title: '拼音與四聲聲調', subtitle: 'ピンイン・注音・声調' },
    { id: 'false-friends', icon: '⛩️', title: '日中同形異義語', subtitle: '要注意の偽友詞・落とし穴' },
    { id: 'signals', icon: '⚡', title: '3秒文法決策樹', subtitle: '把字句・被字句・了' },
    { id: 'conversations', icon: '💬', title: '實用情境會話', subtitle: '夜市・MRT・台湾日常会話' },
  ]

  return (
    <aside className="math-sidebar chinese-sidebar" style={{ width: '260px', minWidth: '260px', flexShrink: 0 }}>
      {/* 頂部品牌區 */}
      <div className="sidebar-brand-box" style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)' }}>
        <button
          type="button"
          className="btn-back-hub"
          onClick={onBackHub}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            padding: 0,
            marginBottom: '0.5rem',
          }}
        >
          ← 返回學習大廳 (Hub)
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            華
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>台湾華語・中国語</h2>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>日本語母語者のための学習</span>
          </div>
        </div>
      </div>

      {/* XP 累積進度 */}
      <div style={{ padding: '0.65rem 1rem', background: 'var(--surface-soft)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)' }}>
          <span>累積學習經驗值</span>
          <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{xp} XP</strong>
        </div>
      </div>

      {/* 導覽選單清單 */}
      <nav style={{ padding: '0.65rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: isActive ? '#f59e0b' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.subtitle}
                </div>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
