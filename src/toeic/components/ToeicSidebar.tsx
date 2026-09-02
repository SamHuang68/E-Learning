import type { CSSProperties } from 'react'
import type { ToeicCertificate, ToeicUnit } from '../data/certificates'
import type { LangId } from '../../utils/storage'
import { TrackSwitcher } from '../../components/TrackSwitcher'

export type ToeicNavId =
  | 'phonics'
  | 'chunks'
  | 'signals'
  | 'double-passage'
  | 'charts'
  | 'negotiation'
  | 'email-master'
  | 'phone'
  | 'travel'
  | 'conference'
  | 'interview'
  | 'marketing'
  | 'supply-chain'
  | 'cybersecurity'
  | 'trade'
  | 'real-estate'
  | 'pr'
  | 'mna'
  | 'ip'
  | 'esg'
  | 'ai-cloud'
  | 'cold-chain'
  | 'bonded-warehouse'
  | 'rfp-bidding'
  | 'force-majeure'
  | 'tech-transfer'
  | 'antitrust'
  | 'conflict-minerals'
  | 'patent-litigation'
  | 'gdpr-privacy'
  | 'nda-trade-secrets'
  | 'cloud-sla'
  | 'marine-insurance'
  | 'royalty-audit'
  | 'fcpa-compliance'
  | 'antitrust-hhi'
  | 'business-interruption'
  | 'story'
  | 'today'
  | 'builder'
  | 'vocab'
  | 'listening'
  | 'grammar'
  | 'scenario'
  | 'speaking'
  | 'mock'
  | 'placement'
  | 'errors'

type Props = {
  nav: ToeicNavId
  onNav: (id: ToeicNavId) => void
  cert: ToeicCertificate
  unit: ToeicUnit
  progressPct: number
  phonicsCount: number
  instructionLang?: 'zh' | 'ja'
  onToggleInstructionLang?: (lang: 'zh' | 'ja') => void
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
  errorCount?: number
}

export function ToeicSidebar({
  nav,
  onNav,
  cert,
  unit,
  progressPct,
  phonicsCount,
  instructionLang = 'zh',
  onToggleInstructionLang,
  onBackHub,
  onSwitchLang,
  errorCount = 0,
}: Props) {
  const isJa = instructionLang === 'ja'

  const items: { id: ToeicNavId; icon: string; label: string; badge?: string }[] = [
    { id: 'today', icon: '★', label: isJa ? '今日学習' : '今日學習' },
    { id: 'chunks', icon: '⚡', label: isJa ? 'ビジネスチャンク' : '商務語塊 (Chunks)' },
    { id: 'signals', icon: '🎯', label: isJa ? '3秒解答シグナル' : '3秒秒殺訊號卡' },
    { id: 'double-passage', icon: '📑', label: isJa ? '複数文書読解' : '雙篇閱讀對照' },
    { id: 'charts', icon: '📊', label: isJa ? '図表読解ラボ' : '商務圖表題分析' },
    { id: 'negotiation', icon: '🤝', label: isJa ? '交渉・スモールトーク' : '談判與社交語塊' },
    { id: 'email-master', icon: '✉️', label: isJa ? 'ビジネスメール演習' : '商務電郵寫作範本' },
    { id: 'phone', icon: '📞', label: isJa ? '電話・留守電特訓' : '電話與語音信箱' },
    { id: 'travel', icon: '✈️', label: isJa ? '出張・フライト宿泊' : '商務差旅與登機' },
    { id: 'conference', icon: '💻', label: isJa ? 'オンライン会議Q&A' : '視訊會議與簡報' },
    { id: 'interview', icon: '👔', label: isJa ? '面接・採用福利' : '求職面試與福利' },
    { id: 'marketing', icon: '📢', label: isJa ? 'マーケ・SNS広報' : '行銷宣傳與公關' },
    { id: 'supply-chain', icon: '🚢', label: isJa ? 'サプライチェーン物流' : '供應鏈與庫存管理' },
    { id: 'cybersecurity', icon: '🛡️', label: isJa ? 'IT・セキュリティ' : '網路資安與維護' },
    { id: 'trade', icon: '🌐', label: isJa ? '国際貿易・関税申告' : '國際貿易與關稅' },
    { id: 'real-estate', icon: '🏢', label: isJa ? '不動産・オフィス賃貸' : '商辦租賃與擴遷' },
    { id: 'pr', icon: '📰', label: isJa ? '広報・プレスリリース' : '公關與新聞發布' },
    { id: 'mna', icon: '🤝', label: isJa ? 'M&A・デューデリ' : '企業併購與盡職調查' },
    { id: 'ip', icon: '⚖️', label: isJa ? '知財・特許ライセンス' : '智財專利與技術授權' },
    { id: 'esg', icon: '🌱', label: isJa ? 'ESG・脱炭素カーボン' : '企業永續與碳盤查' },
    { id: 'ai-cloud', icon: '🤖', label: isJa ? 'AIトランスフォーメーション' : 'AI轉型與雲端機房' },
    { id: 'cold-chain', icon: '❄️', label: isJa ? '航空貨物・コールドチェーン' : '空運冷鏈與溫控物流' },
    { id: 'bonded-warehouse', icon: '🏛️', label: isJa ? '通関申告・保税倉庫' : '海關申報與保稅倉庫' },
    { id: 'rfp-bidding', icon: '📑', label: isJa ? '調達RFP・ベンダー選定' : '採購RFP與供應商競標' },
    { id: 'force-majeure', icon: '🌪️', label: isJa ? '不可抗力・保険求償' : '不可抗力與天災保險' },
    { id: 'tech-transfer', icon: '🔐', label: isJa ? '技術移転・エスクロー' : '技術移轉與原始碼託管' },
    { id: 'antitrust', icon: '⚖️', label: isJa ? '独禁法・カルテル防止' : '反托拉斯與價格合謀' },
    { id: 'conflict-minerals', icon: '💎', label: isJa ? '紛争鉱物・労働監査' : '衝突礦產與勞工人權' },
    { id: 'patent-litigation', icon: '⚖️', label: isJa ? '特許侵害・仮差止命令' : '專利侵權與禁制令' },
    { id: 'gdpr-privacy', icon: '🛡️', label: isJa ? 'GDPR・プライバシー保護' : 'GDPR與資料隱私' },
    { id: 'nda-trade-secrets', icon: '🤝', label: isJa ? '秘密保持・NDA違約金' : '保密協議與違約金' },
    { id: 'cloud-sla', icon: '☁️', label: isJa ? 'クラウドSLA・障害補償' : '雲端SLA與停機補償' },
    { id: 'marine-insurance', icon: '🚢', label: isJa ? '共同海損・海上保険' : '共同海損與海上貨運險' },
    { id: 'royalty-audit', icon: '📊', label: isJa ? '特許監査・ロイヤルティ' : '專利權利金審計' },
    { id: 'fcpa-compliance', icon: '⚖️', label: isJa ? 'FCPA・反贈賄審査' : 'FCPA反海外腐敗法' },
    { id: 'antitrust-hhi', icon: '📊', label: isJa ? 'HHI独禁審査・企業結合' : 'HHI反壟斷審查' },
    { id: 'business-interruption', icon: '🏭', label: isJa ? '休業損害保険・BII理賠' : '營業中斷險理賠' },
    { id: 'errors', icon: '📕', label: isJa ? '誤答ノート' : '錯題弱點本', badge: errorCount > 0 ? `${errorCount}` : undefined },
    { id: 'story', icon: '📖', label: isJa ? 'ストーリー復習' : '情境微故事' },
    { id: 'phonics', icon: 'Aa', label: isJa ? '発音基礎' : '發音基礎' },
    { id: 'builder', icon: '✎', label: isJa ? 'コースビルダー' : '課程設計器' },
    { id: 'vocab', icon: 'V', label: isJa ? '単語練習' : '單字練習' },
    { id: 'listening', icon: '♪', label: isJa ? 'リスニング' : '聽力練習' },
    { id: 'grammar', icon: 'G', label: isJa ? '文法クラス' : '文法教室' },
    { id: 'placement', icon: '級', label: isJa ? 'レベル判定' : '分級測驗' },
    { id: 'mock', icon: '模', label: isJa ? '模擬試験' : '模擬測驗' },
    { id: 'scenario', icon: '場', label: isJa ? 'シチュエーション' : '情境任務' },
    { id: 'speaking', icon: '話', label: isJa ? 'シャドーイング' : '口說跟讀' },
  ]

  return (
    <aside className="sidebar">
      <TrackSwitcher current="en" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      <div className="brand">
        <div
          className="brand-mark"
          style={{ background: `linear-gradient(145deg, ${cert.color}, #1f4d63)` }}
          aria-hidden="true"
        >
          T
        </div>
        <div>
          <strong>TOEIC Path</strong>
          <span>{isJa ? 'TOEIC スコア別トラック' : '多益證書級距'}</span>
        </div>
      </div>

      {/* 語言切換膠囊 (中文 / 日本語解説) */}
      <div style={{ padding: '0.4rem 0.8rem', borderBottom: '1px solid var(--line)', background: 'var(--surface-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
          <span>{isJa ? '解説言語' : '說明語言'}</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{isJa ? '🇯🇵 日本語' : '🇹🇼 繁中'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
          <button
            type="button"
            className={`pill-btn ${!isJa ? 'active' : ''}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.3rem', textAlign: 'center' }}
            onClick={() => onToggleInstructionLang?.('zh')}
          >
            🇹🇼 繁體中文
          </button>
          <button
            type="button"
            className={`pill-btn ${isJa ? 'active' : ''}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.3rem', textAlign: 'center' }}
            onClick={() => onToggleInstructionLang?.('ja')}
          >
            🇯🇵 日本語解説
          </button>
        </div>
      </div>

      <nav aria-label="TOEIC menu">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={nav === item.id ? 'active' : ''}
            aria-current={nav === item.id ? 'page' : undefined}
            onClick={() => onNav(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="course-summary">
        <strong>{isJa ? 'コース概要' : '課程摘要'}</strong>
        <div
          className="level-badge"
          style={{ '--level-color': cert.color } as CSSProperties}
        >
          <strong>
            {cert.name}
            <small>
              {cert.scoreMin}–{cert.scoreMax}
            </small>
          </strong>
          <span>{cert.nameEn}</span>
        </div>
        <span style={{ display: 'block', marginTop: '0.55rem' }}>
          {isJa ? `本レベル進捗 ${progressPct}% · Unit ${unit.id}` : `本級完成度 ${progressPct}% · Unit ${unit.id}`}
        </span>
        <div className="kana-progress-bar" aria-hidden="true">
          <i
            style={{
              width: `${progressPct}%`,
              background: cert.color,
            }}
          />
        </div>
        <div className="unit-dots" aria-hidden="true">
          {cert.units.map((u) => (
            <i
              key={u.id}
              className={u.id === unit.id ? 'current' : ''}
              style={
                {
                  '--fill':
                    u.id < unit.id
                      ? '100%'
                      : u.id === unit.id
                        ? `${progressPct}%`
                        : '0%',
                } as CSSProperties
              }
            >
              {u.id}
            </i>
          ))}
        </div>
        <span style={{ display: 'block', marginTop: '0.65rem', fontSize: '0.8rem' }}>
          發音基礎掌握 {phonicsCount} · {cert.audience}
        </span>
      </div>
    </aside>
  )
}
