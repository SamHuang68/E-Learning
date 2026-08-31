import type { CSSProperties } from 'react'
import type { JlptLevel, Unit } from '../data/course'
import type { LangId } from '../utils/storage'
import { TrackSwitcher } from './TrackSwitcher'

export type NavId =
  | 'kana'
  | 'signals'
  | 'today'
  | 'builder'
  | 'vocab'
  | 'grammar'
  | 'kanji'
  | 'scenario'
  | 'speaking'
  | 'mock'
  | 'placement'

type Props = {
  nav: NavId
  onNav: (id: NavId) => void
  level: JlptLevel
  unit: Unit
  progressPct: number
  kanaMastered: number
  kanaTotal: number
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const items: { id: NavId; icon: string; label: string }[] = [
  { id: 'today', icon: '日', label: '今日學習' },
  { id: 'signals', icon: '🎯', label: '句型動作判準 (3秒)' },
  { id: 'kana', icon: 'あ', label: '五十音（基礎）' },
  { id: 'builder', icon: '設', label: '課程設計器' },
  { id: 'vocab', icon: 'Aa', label: '單字練習' },
  { id: 'grammar', icon: '文', label: '文法教室' },
  { id: 'placement', icon: '級', label: '分級測驗' },
  { id: 'mock', icon: '模', label: '模擬測驗' },
  { id: 'kanji', icon: '漢', label: '漢字實驗室' },
  { id: 'scenario', icon: '場', label: '情境任務' },
  { id: 'speaking', icon: '話', label: '口說跟讀' },
]

export function Sidebar({
  nav,
  onNav,
  level,
  unit,
  progressPct,
  kanaMastered,
  kanaTotal,
  onBackHub,
  onSwitchLang,
}: Props) {
  return (
    <aside className="sidebar">
      <TrackSwitcher current="ja" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          あ
        </div>
        <div>
          <strong>あおば Aoba</strong>
          <span>JLPT 級距學習</span>
        </div>
      </div>

      <nav aria-label="主選單">
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
        <p className="eyebrow">FOUNDATION</p>
        <strong>五十音進度</strong>
        <span>
          已掌握 {kanaMastered}/{kanaTotal} · 平／片假名（非學校必修補強）
        </span>
        <div className="kana-progress-bar" aria-hidden="true">
          <i
            style={{
              width: `${kanaTotal ? (kanaMastered / kanaTotal) * 100 : 0}%`,
            }}
          />
        </div>

        <p className="eyebrow" style={{ marginTop: '0.9rem' }}>
          JLPT TRACK
        </p>
        <div
          className="level-badge"
          style={
            {
              '--level-color': level.color,
            } as CSSProperties
          }
        >
          <strong>
            {level.band}
            <small>{level.tier}</small>
          </strong>
          <span>{level.scoreHint}</span>
        </div>
        <span style={{ display: 'block', marginTop: '0.45rem' }}>
          本課 {unit.words} Words · Unit {unit.id}
        </span>
        <div className="unit-dots" aria-hidden="true">
          {level.units.map((u) => (
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
      </div>
    </aside>
  )
}
