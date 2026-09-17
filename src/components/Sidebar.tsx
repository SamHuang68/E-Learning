import type { CSSProperties } from 'react'
import type { JlptLevel, Unit } from '../data/course'
import type { LangId } from '../utils/storage'
import { TrackSwitcher } from './TrackSwitcher'
import { useI18n } from '../i18n/i18n'
import { jlptTierLabel } from '../i18n/jlptChrome'

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

const ITEM_KEYS: Array<{ id: NavId; icon: string; labelKey: 'ja.nav.today' | 'ja.nav.kana' | 'ja.nav.vocab' | 'ja.nav.grammar' }> = [
  { id: 'today', icon: '日', labelKey: 'ja.nav.today' },
  { id: 'kana', icon: 'あ', labelKey: 'ja.nav.kana' },
  { id: 'vocab', icon: 'Aa', labelKey: 'ja.nav.vocab' },
  { id: 'grammar', icon: '文', labelKey: 'ja.nav.grammar' },
]

const MORE_KEYS: Array<{ id: NavId; icon: string; labelKey: 'ja.nav.signals' | 'ja.nav.builder' | 'ja.nav.placement' | 'ja.nav.mock' | 'ja.nav.kanji' | 'ja.nav.scenario' | 'ja.nav.speaking' }> = [
  { id: 'signals', icon: '判', labelKey: 'ja.nav.signals' },
  { id: 'builder', icon: '設', labelKey: 'ja.nav.builder' },
  { id: 'placement', icon: '級', labelKey: 'ja.nav.placement' },
  { id: 'mock', icon: '模', labelKey: 'ja.nav.mock' },
  { id: 'kanji', icon: '漢', labelKey: 'ja.nav.kanji' },
  { id: 'scenario', icon: '場', labelKey: 'ja.nav.scenario' },
  { id: 'speaking', icon: '話', labelKey: 'ja.nav.speaking' },
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
  const { t } = useI18n()
  return (
    <aside className="sidebar">
      <TrackSwitcher current="ja" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          あ
        </div>
        <div>
          <strong>{t('ja.brand')}</strong>
          <span>{t('ja.brandSub')}</span>
        </div>
      </div>

      <nav aria-label={t('nav.jaAria')}>
        {ITEM_KEYS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={nav === item.id ? 'active' : ''}
            aria-current={nav === item.id ? 'page' : undefined}
            onClick={() => onNav(item.id)}
          >
            <span>{item.icon}</span>
            {t(item.labelKey)}
          </button>
        ))}
        <p className="nav-heading">{t('nav.more')}</p>
        {MORE_KEYS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={nav === item.id ? 'active' : ''}
            aria-current={nav === item.id ? 'page' : undefined}
            onClick={() => onNav(item.id)}
          >
            <span>{item.icon}</span>
            {t(item.labelKey)}
          </button>
        ))}
      </nav>

      <div className="course-summary">
        <p className="eyebrow">FOUNDATION</p>
        <strong>{t('ja.kanaProgress')}</strong>
        <span>
          {t('ja.kanaMeta', { done: kanaMastered, total: kanaTotal })}
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
            <small>{jlptTierLabel(level.tier, t)}</small>
          </strong>
          <span>{level.scoreHint}</span>
        </div>
        <span style={{ display: 'block', marginTop: '0.45rem' }}>
          {t('ja.unitMeta', { words: unit.words, id: unit.id })}
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
