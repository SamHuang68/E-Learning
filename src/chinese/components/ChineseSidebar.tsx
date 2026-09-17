import React from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'
import type { LangId } from '../../utils/storage'
import type { MessageKey } from '../../i18n/messages'

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
  | 'zhuazhou'
  | 'ghost-festival'
  | 'tangyuan'
  | 'dragon-boat'
  | 'mid-autumn'
  | 'lantern-festival'
  | 'qingming-popiah'
  | 'yuelao-love'
  | 'double-ninth'
  | 'start-of-winter'
  | 'guabao-sishen'
  | 'menu'
  | 'mock'
  | 'errors'

interface Props {
  activeSection: ChineseNavSection
  onSelectSection: (section: ChineseNavSection) => void
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
  xp: number
  errorCount?: number
}

export const ChineseSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  xp,
  errorCount = 0,
}) => {
  const { t } = useI18n()
  const NAV_ITEMS: Array<{ id: ChineseNavSection; icon: string; titleKey: MessageKey; subtitle: string; badge?: string }> = [
    { id: 'today', icon: '🌸', titleKey: 'zh.nav.today', subtitle: '今日の学習ダッシュボード' },
    { id: 'pinyin', icon: '🗣️', titleKey: 'zh.nav.pinyin', subtitle: 'ピンイン・注音・声調' },
    { id: 'tones-lab', icon: '🎧', titleKey: 'zh.nav.tones', subtitle: '四声聞き分け・ミニマルペア' },
    { id: 'stroke', icon: '🖌️', titleKey: 'zh.nav.stroke', subtitle: 'ボポモフォ＆書き順練習' },
    { id: 'false-friends', icon: '⛩️', titleKey: 'zh.nav.false', subtitle: '要注意の偽友詞・落とし穴' },
    { id: 'synonyms', icon: '⚖️', titleKey: 'zh.nav.synonyms', subtitle: '合適vs適合・以為vs認為' },
    { id: 'measure-words', icon: '🔢', titleKey: 'zh.nav.measure', subtitle: '一張桌子・一把雨傘' },
    { id: 'signals', icon: '⚡', titleKey: 'zh.nav.signals', subtitle: '把字句・被字句・了' },
    { id: 'idioms', icon: '📜', titleKey: 'zh.nav.idioms', subtitle: '四字熟語・摸蜊仔兼洗褲' },
    { id: 'conversations', icon: '💬', titleKey: 'zh.nav.conversations', subtitle: '夜市・MRT・台湾日常会話' },
    { id: 'transit', icon: '🚇', titleKey: 'zh.nav.transit', subtitle: '悠遊卡・高鐵・運將對話' },
    { id: 'housing', icon: '🏠', titleKey: 'zh.nav.housing', subtitle: '套房押金・水電・追垃圾車' },
    { id: 'banking', icon: '🏦', titleKey: 'zh.nav.banking', subtitle: '印章・台幣日圓匯率試算' },
    { id: 'medical', icon: '🩺', titleKey: 'zh.nav.medical', subtitle: '健保卡・症狀描述・藥局拿藥' },
    { id: 'post', icon: '📦', titleKey: 'zh.nav.post', subtitle: '手機末三碼・貨到付款・掛號' },
    { id: 'railway', icon: '🚅', titleKey: 'zh.nav.railway', subtitle: '早鳥票・對號座・阿里山日出' },
    { id: 'food', icon: '🧋', titleKey: 'zh.nav.food', subtitle: '微糖微冰・雞排要不要切' },
    { id: 'utilities', icon: '⚡', titleKey: 'zh.nav.utilities', subtitle: '一度電試算・瓦斯・搬家紙箱' },
    { id: 'festivals', icon: '🏮', titleKey: 'zh.nav.festivals', subtitle: '龍山寺擲筊・年貨大街・買三送一' },
    { id: 'crafts', icon: '🍵', titleKey: 'zh.nav.crafts', subtitle: '十分天燈祈福・九份高山茶品茗' },
    { id: 'road-trip', icon: '⛽', titleKey: 'zh.nav.road', subtitle: '中油九五加滿・蘇花改・ETC' },
    { id: 'repair', icon: '🔧', titleKey: 'zh.nav.repair', subtitle: '冷氣漏水報修・跳電・管理費' },
    { id: 'pet', icon: '🐶', titleKey: 'zh.nav.pet', subtitle: '晶片狂犬病・捷運提籠・友善餐廳' },
    { id: 'rechao', icon: '🍻', titleKey: 'zh.nav.rechao', subtitle: '金牌台啤・蔥爆牛・搶買單我請客' },
    { id: 'convenience-atm', icon: '🏪', titleKey: 'zh.nav.atm', subtitle: '跨行轉帳・無卡提款・自備環保杯' },
    { id: 'youbike', icon: '🚲', titleKey: 'zh.nav.youbike', subtitle: 'YouBike 2.0・座墊反轉・轉乘折5元' },
    { id: 'boba', icon: '🧋', titleKey: 'zh.nav.boba', subtitle: '微糖微冰・黑糖波霸・環保杯折5元' },
    { id: 'wedding', icon: '💒', titleKey: 'zh.nav.wedding', subtitle: '雙數吉利・紅包賀詞・喝喜酒喜餅' },
    { id: 'lottery', icon: '🧾', titleKey: 'zh.nav.lottery', subtitle: '單月25日開獎・末三碼200元・超商折抵' },
    { id: 'weiya', icon: '🍗', titleKey: 'zh.nav.weiya', subtitle: '虎咬豬・雞頭對老闆・加碼抽特獎' },
    { id: 'zhuazhou', icon: '👶', titleKey: 'zh.nav.zhuazhou', subtitle: '虎頭帽・腳踏龜紅龜粿・米篩道具' },
    { id: 'ghost-festival', icon: '🏮', titleKey: 'zh.nav.ghost', subtitle: '好兄弟拜拜・供品禁忌・基隆水燈' },
    { id: 'tangyuan', icon: '🥣', titleKey: 'zh.nav.tangyuan', subtitle: '搓紅白圓・芝麻花生大湯圓' },
    { id: 'dragon-boat', icon: '🛶', titleKey: 'zh.nav.dragon', subtitle: '正午立蛋・水煮生米vs油飯蒸粽' },
    { id: 'mid-autumn', icon: '🌕', titleKey: 'zh.nav.midautumn', subtitle: '騎樓炭烤吐司・文旦戴柚子帽' },
    { id: 'lantern-festival', icon: '🏮', titleKey: 'zh.nav.lantern', subtitle: '平溪四色天燈・鹽水萬發蜂炮' },
    { id: 'qingming-popiah', icon: '🌱', titleKey: 'zh.nav.qingming', subtitle: '壓墓紙慎終追遠・花生糖粉包潤餅' },
    { id: 'yuelao-love', icon: '🏮', titleKey: 'zh.nav.yuelao', subtitle: '霞海城隍廟・鉛錢過香爐求良緣' },
    { id: 'double-ninth', icon: '⛰️', titleKey: 'zh.nav.ninth', subtitle: '登高遠眺踏青・銅鑼杭菊吃重陽糕' },
    { id: 'start-of-winter', icon: '🦆', titleKey: 'zh.nav.winter', subtitle: '炭火紅泥爐・拌鴨油麵線沾腐乳' },
    { id: 'guabao-sishen', icon: '🍔', titleKey: 'zh.nav.guabao', subtitle: '虎咬豬咬住福氣・老滷爌肉當歸酒' },
    { id: 'menu', icon: '🏮', titleKey: 'zh.nav.menu', subtitle: '台湾グルメ＆生活台湾語' },
    { id: 'mock', icon: '📝', titleKey: 'zh.nav.mock', subtitle: 'A1/A2 レベル判定模試' },
    { id: 'errors', icon: '📕', titleKey: 'zh.nav.errors', subtitle: '弱点專項攻克', badge: errorCount > 0 ? `${errorCount}` : undefined },
  ]

  return (
    <aside className="math-sidebar chinese-sidebar">
      <TrackSwitcher current="zh" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      {/* 頂部品牌區 */}
      <div className="sidebar-brand-box">
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
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            華
          </div>
          <div>
            <strong style={{ fontSize: '0.92rem', display: 'block' }}>{t('zh.brand')}</strong>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{t('zh.brandSub')}</span>
          </div>
        </div>

        <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.6rem', background: 'var(--surface-soft)', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{t('nav.xp')}</span>
          <strong style={{ fontSize: '0.84rem', color: '#f59e0b' }}>{xp} XP</strong>
        </div>
      </div>

      {/* 導航項目清單 */}
      <nav className="chinese-nav">
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
                  <div className="zh-nav-title">{t(item.titleKey)}</div>
                  <div className="zh-nav-sub">{item.subtitle}</div>
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
