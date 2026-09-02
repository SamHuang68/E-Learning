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
  | 'housing'
  | 'banking'
  | 'medical'
  | 'post'
  | 'railway'
  | 'food'
  | 'utilities'
  | 'festivals'
  | 'crafts'
  | 'road-trip'
  | 'repair'
  | 'pet'
  | 'rechao'
  | 'convenience-atm'
  | 'youbike'
  | 'boba'
  | 'wedding'
  | 'lottery'
  | 'weiya'
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
    { id: 'housing', icon: '🏠', title: '租屋看房與垃圾車', subtitle: '套房押金・水電・追垃圾車' },
    { id: 'banking', icon: '🏦', title: '銀行開戶與外幣換匯', subtitle: '印章・台幣日圓匯率試算' },
    { id: 'medical', icon: '🩺', title: '看病就醫與健保診所', subtitle: '健保卡・症狀描述・藥局拿藥' },
    { id: 'post', icon: '📦', title: '郵局包裹與超商取貨', subtitle: '手機末三碼・貨到付款・掛號' },
    { id: 'railway', icon: '🚅', title: '高鐵購票與鐵道觀光', subtitle: '早鳥票・對號座・阿里山日出' },
    { id: 'food', icon: '🧋', title: '夜市小吃與手搖點茶', subtitle: '微糖微冰・雞排要不要切' },
    { id: 'utilities', icon: '⚡', title: '水電帳單與搬家生活', subtitle: '一度電試算・瓦斯・搬家紙箱' },
    { id: 'festivals', icon: '🏮', title: '傳統節慶與廟宇拜拜', subtitle: '龍山寺擲筊・年貨大街・買三送一' },
    { id: 'crafts', icon: '🍵', title: '老街文創與茶藝體驗', subtitle: '十分天燈祈福・九份高山茶品茗' },
    { id: 'road-trip', icon: '⛽', title: '租車自駕與環島公路', subtitle: '中油九五加滿・蘇花改・ETC' },
    { id: 'repair', icon: '🔧', title: '租屋修繕與水電管委', subtitle: '冷氣漏水報修・跳電・管理費' },
    { id: 'pet', icon: '🐶', title: '寵物友善與動物醫院', subtitle: '晶片狂犬病・捷運提籠・友善餐廳' },
    { id: 'rechao', icon: '🍻', title: '百元熱炒與聚餐文化', subtitle: '金牌台啤・蔥爆牛・搶買單我請客' },
    { id: 'convenience-atm', icon: '🏪', title: '超商生活與 ATM 金融', subtitle: '跨行轉帳・無卡提款・自備環保杯' },
    { id: 'youbike', icon: '🚲', title: '微笑單車與捷運轉乘', subtitle: 'YouBike 2.0・座墊反轉・轉乘折5元' },
    { id: 'boba', icon: '🧋', title: '手搖飲料客製文化', subtitle: '微糖微冰・黑糖波霸・環保杯折5元' },
    { id: 'wedding', icon: '💒', title: '婚禮喜酒紅包文化', subtitle: '雙數吉利・紅包賀詞・喝喜酒喜餅' },
    { id: 'lottery', icon: '🧾', title: '統一發票與彩券生活', subtitle: '單月25日開獎・末三碼200元・超商折抵' },
    { id: 'weiya', icon: '🍗', title: '尾牙聚餐與刈包摸彩', subtitle: '虎咬豬・雞頭對老闆・加碼抽特獎' },
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
