import React from 'react'

export type ChineseNavSection =
  | 'today'
  | 'pinyin'
  | 'tones-lab'
  | 'stroke'
  | 'false-friends'
  | 'synonyms'
  | 'measure-words'
  | 'signals'
  | 'idioms'
  | 'conversations'
  | 'transit'
  | 'menu'
  | 'mock'
  | 'errors'

interface Props {
  activeSection: ChineseNavSection
  onSelectSection: (section: ChineseNavSection) => void
  onBackHub: () => void
  xp: number
  errorCount?: number
}

export const ChineseSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  xp,
  errorCount = 0,
}) => {
  const NAV_ITEMS: Array<{ id: ChineseNavSection; icon: string; title: string; subtitle: string; badge?: string }> = [
    { id: 'today', icon: '🌸', title: '今日學習總覽', subtitle: '今日の学習ダッシュボード' },
    { id: 'pinyin', icon: '🗣️', title: '拼音與四聲聲調', subtitle: 'ピンイン・注音・声調' },
    { id: 'tones-lab', icon: '🎧', title: '聲調辨音聽力', subtitle: '四声聞き分け・ミニマルペア' },
    { id: 'stroke', icon: '🖌️', title: '注音與漢字筆順', subtitle: 'ボポモフォ＆書き順練習' },
    { id: 'false-friends', icon: '⛩️', title: '日中同形異義語', subtitle: '要注意の偽友詞・落とし穴' },
    { id: 'synonyms', icon: '⚖️', title: '近義詞微語義辨析', subtitle: '合適vs適合・以為vs認為' },
    { id: 'measure-words', icon: '🔢', title: '量詞精準搭配', subtitle: '一張桌子・一把雨傘' },
    { id: 'signals', icon: '⚡', title: '3秒文法決策樹', subtitle: '把字句・被字句・了' },
    { id: 'idioms', icon: '📜', title: '成語與台灣諺語', subtitle: '四字熟語・摸蜊仔兼洗褲' },
    { id: 'conversations', icon: '💬', title: '實用情境會話', subtitle: '夜市・MRT・台湾日常会話' },
    { id: 'transit', icon: '🚇', title: '捷運與交通生活', subtitle: '悠遊卡・高鐵・運將對話' },
    { id: 'menu', icon: '🏮', title: '夜市美食與台灣語', subtitle: '台湾グルメ＆生活台湾語' },
    { id: 'mock', icon: '📝', title: 'TOCFL 模擬測驗', subtitle: 'A1/A2 レベル判定模試' },
    { id: 'errors', icon: '📕', title: '華語錯題本', subtitle: '弱点專項攻克', badge: errorCount > 0 ? `${errorCount}` : undefined },
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
              fontSize: '1rem',
            }}
          >
            華
          </div>
          <div>
            <strong style={{ fontSize: '0.92rem', display: 'block' }}>台湾華語・中国語</strong>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>日本語母語者のための学習</span>
          </div>
        </div>

        {/* 經驗值指示條 */}
        <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.6rem', background: 'var(--surface-soft)', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>累積經驗值</span>
          <strong style={{ fontSize: '0.84rem', color: '#f59e0b' }}>{xp} XP</strong>
        </div>
      </div>

      {/* 導航項目清單 */}
      <nav style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: isActive ? '#f59e0b' : 'var(--text)',
                fontWeight: isActive ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => onSelectSection(item.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.84rem', lineHeight: 1.2 }}>{item.title}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.2 }}>{item.subtitle}</div>
                </div>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    background: '#ef4444',
                    color: '#fff',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
