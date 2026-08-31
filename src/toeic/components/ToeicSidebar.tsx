import type { CSSProperties } from 'react'
import type { ToeicCertificate, ToeicUnit } from '../data/certificates'
import type { LangId } from '../../utils/storage'

export type ToeicNavId =
  | 'phonics'
  | 'chunks'
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

type Props = {
  nav: ToeicNavId
  onNav: (id: ToeicNavId) => void
  cert: ToeicCertificate
  unit: ToeicUnit
  progressPct: number
  phonicsCount: number
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const items: { id: ToeicNavId; icon: string; label: string }[] = [
  { id: 'today', icon: '★', label: '今日學習' },
  { id: 'chunks', icon: '⚡', label: '商務語塊 (Chunks)' },
  { id: 'story', icon: '📖', label: '情境微故事' },
  { id: 'phonics', icon: 'Aa', label: '發音基礎' },
  { id: 'builder', icon: '✎', label: '課程設計器' },
  { id: 'vocab', icon: 'V', label: '單字練習' },
  { id: 'listening', icon: '♪', label: '聽力練習' },
  { id: 'grammar', icon: 'G', label: '文法教室' },
  { id: 'placement', icon: '級', label: '分級測驗' },
  { id: 'mock', icon: '模', label: '模擬測驗' },
  { id: 'scenario', icon: '場', label: '情境任務' },
  { id: 'speaking', icon: '話', label: '口說跟讀' },
]

export function ToeicSidebar({
  nav,
  onNav,
  cert,
  unit,
  progressPct,
  phonicsCount,
}: Props) {
  return (
    <aside className="sidebar">
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
          <span>多益證書級距</span>
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
        <strong>課程摘要</strong>
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
          本級完成度 {progressPct}% · Unit {unit.id}
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
