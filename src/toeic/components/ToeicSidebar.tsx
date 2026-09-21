import type { CSSProperties } from 'react'
import type { ToeicCertificate, ToeicUnit } from '../data/certificates'
import type { LangId } from '../../utils/storage'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'

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
  | 'letter-of-credit'
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
  const { t } = useI18n()
  const isJa = instructionLang === 'ja'

  const items: { id: ToeicNavId; icon: string; label: string; badge?: string }[] = [
    { id: 'today', icon: '★', label: isJa ? '今日学習' : t('en.nav.today') },
    { id: 'chunks', icon: '⚡', label: isJa ? 'ビジネスチャンク' : t('en.nav.chunks') },
    { id: 'signals', icon: '🎯', label: isJa ? '3秒解答シグナル' : t('en.nav.signals') },
    { id: 'double-passage', icon: '📑', label: isJa ? '複数文書読解' : t('en.nav.double') },
    { id: 'charts', icon: '📊', label: isJa ? '図表読解ラボ' : t('en.nav.charts') },
    { id: 'negotiation', icon: '🤝', label: isJa ? '交渉・スモールトーク' : t('en.nav.negotiation') },
    { id: 'email-master', icon: '✉️', label: isJa ? 'ビジネスメール演習' : t('en.nav.email') },
    { id: 'phone', icon: '📞', label: isJa ? '電話・留守電特訓' : t('en.nav.phone') },
    { id: 'travel', icon: '✈️', label: isJa ? '出張・フライト宿泊' : t('en.nav.travel') },
    { id: 'conference', icon: '💻', label: isJa ? 'オンライン会議Q&A' : t('en.nav.conference') },
    { id: 'interview', icon: '👔', label: isJa ? '面接・採用福利' : t('en.nav.interview') },
    { id: 'marketing', icon: '📢', label: isJa ? 'マーケ・SNS広報' : t('en.nav.marketing') },
    { id: 'supply-chain', icon: '🚢', label: isJa ? 'サプライチェーン物流' : t('en.nav.supply') },
    { id: 'cybersecurity', icon: '🛡️', label: isJa ? 'IT・セキュリティ' : t('en.nav.cyber') },
    { id: 'trade', icon: '🌐', label: isJa ? '国際貿易・関税申告' : t('en.nav.trade') },
    { id: 'real-estate', icon: '🏢', label: isJa ? '不動産・オフィス賃貸' : t('en.nav.estate') },
    { id: 'pr', icon: '📰', label: isJa ? '広報・プレスリリース' : t('en.nav.pr') },
    { id: 'mna', icon: '🤝', label: isJa ? 'M&A・デューデリ' : t('en.nav.mna') },
    { id: 'ip', icon: '⚖️', label: isJa ? '知財・特許ライセンス' : t('en.nav.ip') },
    { id: 'esg', icon: '🌱', label: isJa ? 'ESG・脱炭素カーボン' : t('en.nav.esg') },
    { id: 'ai-cloud', icon: '🤖', label: isJa ? 'AIトランスフォーメーション' : t('en.nav.ai') },
    { id: 'cold-chain', icon: '❄️', label: isJa ? '航空貨物・コールドチェーン' : t('en.nav.cold') },
    { id: 'bonded-warehouse', icon: '🏛️', label: isJa ? '通関申告・保税倉庫' : t('en.nav.bonded') },
    { id: 'rfp-bidding', icon: '📑', label: isJa ? '調達RFP・ベンダー選定' : t('en.nav.rfp') },
    { id: 'force-majeure', icon: '🌪️', label: isJa ? '不可抗力・保険求償' : t('en.nav.force') },
    { id: 'tech-transfer', icon: '🔐', label: isJa ? '技術移転・エスクロー' : t('en.nav.tech') },
    { id: 'antitrust', icon: '⚖️', label: isJa ? '独禁法・カルテル防止' : t('en.nav.antitrust') },
    { id: 'conflict-minerals', icon: '💎', label: isJa ? '紛争鉱物・労働監査' : t('en.nav.minerals') },
    { id: 'patent-litigation', icon: '⚖️', label: isJa ? '特許侵害・仮差止命令' : t('en.nav.patent') },
    { id: 'gdpr-privacy', icon: '🛡️', label: isJa ? 'GDPR・プライバシー保護' : t('en.nav.gdpr') },
    { id: 'nda-trade-secrets', icon: '🤝', label: isJa ? '秘密保持・NDA違約金' : t('en.nav.nda') },
    { id: 'cloud-sla', icon: '☁️', label: isJa ? 'クラウドSLA・障害補償' : t('en.nav.sla') },
    { id: 'marine-insurance', icon: '🚢', label: isJa ? '共同海損・海上保険' : t('en.nav.marine') },
    { id: 'royalty-audit', icon: '📊', label: isJa ? '特許監査・ロイヤルティ' : t('en.nav.royalty') },
    { id: 'fcpa-compliance', icon: '⚖️', label: isJa ? 'FCPA・反贈賄審査' : t('en.nav.fcpa') },
    { id: 'antitrust-hhi', icon: '📊', label: isJa ? 'HHI独禁審査・企業結合' : t('en.nav.hhi') },
    { id: 'business-interruption', icon: '🏭', label: isJa ? '休業損害保険・BII理賠' : t('en.nav.bii') },
    { id: 'letter-of-credit', icon: '📜', label: isJa ? '信用状（L/C）・ディスクレ' : t('en.nav.lc') },
    { id: 'errors', icon: '📕', label: isJa ? '誤答ノート' : t('en.nav.errors'), badge: errorCount > 0 ? `${errorCount}` : undefined },
    { id: 'story', icon: '📖', label: isJa ? 'ストーリー復習' : t('en.nav.story') },
    { id: 'phonics', icon: 'Aa', label: isJa ? '発音基礎' : t('en.nav.phonics') },
    { id: 'builder', icon: '✎', label: isJa ? 'コースビルダー' : t('en.nav.builder') },
    { id: 'vocab', icon: 'V', label: isJa ? '単語練習' : t('en.nav.vocab') },
    { id: 'listening', icon: '♪', label: isJa ? 'リスニング' : t('en.nav.listening') },
    { id: 'grammar', icon: 'G', label: isJa ? '文法クラス' : t('en.nav.grammar') },
    { id: 'placement', icon: '級', label: isJa ? 'レベル判定' : t('en.nav.placement') },
    { id: 'mock', icon: '模', label: isJa ? '模擬試験' : t('en.nav.mock') },
    { id: 'scenario', icon: '場', label: isJa ? 'シチュエーション' : t('en.nav.scenario') },
    { id: 'speaking', icon: '話', label: isJa ? 'シャドーイング' : t('en.nav.speaking') },
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
          <span>{isJa ? 'TOEIC スコア別トラック' : t('en.brandSub')}</span>
        </div>
      </div>

      {/* 語言切換膠囊 (中文 / 日本語解説) */}
      <div style={{ padding: '0.4rem 0.8rem', borderBottom: '1px solid var(--line)', background: 'var(--surface-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
          <span>{isJa ? '解説言語' : t('en.explainLang')}</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{isJa ? '🇯🇵 日本語' : '🇹🇼 繁中'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
          <button
            type="button"
            className={`pill-btn ${!isJa ? 'active' : ''}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.3rem', textAlign: 'center' }}
            onClick={() => onToggleInstructionLang?.('zh')}
          >
            {t('en.zhTw')}
          </button>
          <button
            type="button"
            className={`pill-btn ${isJa ? 'active' : ''}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.3rem', textAlign: 'center' }}
            onClick={() => onToggleInstructionLang?.('ja')}
          >
            {t('en.jaExplain')}
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
        <strong>{isJa ? 'コース概要' : t('en.summary')}</strong>
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
        <p className="score-disclaimer" style={{ fontSize: '0.75rem', opacity: 0.85, margin: '0.35rem 0' }}>
          {isJa ? cert.disclaimer.replace('分數級距', 'スコアバンド') : `${cert.disclaimer} (${cert.disclaimerEn})`}
        </p>
        <span style={{ display: 'block', marginTop: '0.55rem' }}>
          {isJa ? `本レベル進捗 ${progressPct}% · Unit ${unit.id}` : t('en.progress', { pct: progressPct, id: unit.id })}
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
          {t('en.phonics', { count: phonicsCount, audience: cert.audience })}
        </span>
      </div>
    </aside>
  )
}
