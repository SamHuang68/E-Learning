import React, { useState } from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'
import type { MessageKey } from '../../i18n/messages'
import type { LangId } from '../../utils/storage'

export type CsNavSection =
  | 'hierarchy'
  | 'textbook'
  | 'today'
  | 'practice'
  | 'signals'
  | 'arch-map'
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
  errorCount?: number
}

const PRIMARY: Array<{ id: CsNavSection; labelKey: MessageKey }> = [
  { id: 'today', labelKey: 'cs.top.today' },
  { id: 'hierarchy', labelKey: 'cs.top.curriculum' },
  { id: 'textbook', labelKey: 'cs.top.textbook' },
]

const LABS: Array<{ id: CsNavSection; titleKey: MessageKey; descKey: MessageKey; advanced?: boolean }> = [
  { id: 'von-neumann', titleKey: 'cs.lab.von', descKey: 'cs.lab.vonDesc' },
  { id: 'pipeline-hazard', titleKey: 'cs.lab.pipe', descKey: 'cs.lab.pipeDesc' },
  { id: 'cache-mapping', titleKey: 'cs.lab.cache', descKey: 'cs.lab.cacheDesc' },
  { id: 'arch-map', titleKey: 'cs.lab.arch', descKey: 'cs.lab.archDesc' },
  { id: 'ai-transformer', titleKey: 'cs.lab.ai', descKey: 'cs.lab.aiDesc', advanced: true },
]

const PRACTICE: Array<{ id: CsNavSection; titleKey: MessageKey; descKey: MessageKey }> = [
  { id: 'practice', titleKey: 'cs.prac.unit', descKey: 'cs.prac.unitDesc' },
  { id: 'signals', titleKey: 'cs.prac.signals', descKey: 'cs.prac.signalsDesc' },
]

const EXAMS: Array<{ id: CsNavSection; titleKey: MessageKey; descKey: MessageKey }> = [
  { id: 'mock', titleKey: 'cs.exam.mock', descKey: 'cs.exam.mockDesc' },
  { id: 'errors', titleKey: 'cs.exam.errors', descKey: 'cs.exam.errorsDesc' },
]

const LAB_IDS: CsNavSection[] = LABS.map((item) => item.id)
const PRACTICE_IDS: CsNavSection[] = PRACTICE.map((item) => item.id)
const EXAM_IDS: CsNavSection[] = EXAMS.map((item) => item.id)

export const CsTopNav: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  errorCount = 0,
}) => {
  const { t } = useI18n()
  const [openMenu, setOpenMenu] = useState<'labs' | 'practice' | 'exams' | null>(null)

  function go(section: CsNavSection) {
    onSelectSection(section)
    setOpenMenu(null)
  }

  function menuClass(active: boolean) {
    return `cs-nav-item${active ? ' is-active' : ''}`
  }

  return (
    <header className="cs-top-nav">
      <div className="cs-nav-brand">
        <p className="eyebrow">{t('cs.brand')}</p>
        <span className="cs-nav-brand-sub">{t('cs.lead')}</span>
      </div>

      <nav className="cs-nav-list" aria-label={t('cs.navAria')}>
        {PRIMARY.map((item) => (
          <button
            key={item.id}
            type="button"
            className={menuClass(activeSection === item.id)}
            onClick={() => go(item.id)}
          >
            {t(item.labelKey)}
          </button>
        ))}

        <div className="cs-nav-menu">
          <button
            type="button"
            className={menuClass(LAB_IDS.includes(activeSection))}
            aria-expanded={openMenu === 'labs'}
            onClick={() => setOpenMenu((cur) => (cur === 'labs' ? null : 'labs'))}
          >
            {t('cs.top.labs')}
          </button>
          {openMenu === 'labs' ? (
            <div className="cs-nav-dropdown" role="menu">
              {LABS.map((lab) => (
                <button key={lab.id} type="button" onClick={() => go(lab.id)}>
                  <strong>
                    {t(lab.titleKey)}
                    {lab.advanced ? <span className="cs-advanced-tag">{t('cs.top.advanced')}</span> : null}
                  </strong>
                  <span>{t(lab.descKey)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="cs-nav-menu">
          <button
            type="button"
            className={menuClass(PRACTICE_IDS.includes(activeSection))}
            aria-expanded={openMenu === 'practice'}
            onClick={() => setOpenMenu((cur) => (cur === 'practice' ? null : 'practice'))}
          >
            {t('cs.top.practice')}
          </button>
          {openMenu === 'practice' ? (
            <div className="cs-nav-dropdown" role="menu">
              {PRACTICE.map((item) => (
                <button key={item.id} type="button" onClick={() => go(item.id)}>
                  <strong>{t(item.titleKey)}</strong>
                  <span>{t(item.descKey)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="cs-nav-menu">
          <button
            type="button"
            className={menuClass(EXAM_IDS.includes(activeSection))}
            aria-expanded={openMenu === 'exams'}
            onClick={() => setOpenMenu((cur) => (cur === 'exams' ? null : 'exams'))}
          >
            {t('cs.top.exams')}
            {errorCount > 0 ? <span className="cs-nav-badge">{errorCount}</span> : null}
          </button>
          {openMenu === 'exams' ? (
            <div className="cs-nav-dropdown" role="menu">
              {EXAMS.map((item) => (
                <button key={item.id} type="button" onClick={() => go(item.id)}>
                  <strong>
                    {t(item.titleKey)}
                    {item.id === 'errors' && errorCount > 0 ? `（${errorCount}）` : ''}
                  </strong>
                  <span>{t(item.descKey)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </nav>

      <TrackSwitcher current="cs" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
    </header>
  )
}
