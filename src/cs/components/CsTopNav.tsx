import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'
import type { MessageKey } from '../../i18n/messages'
import type { LangId } from '../../utils/storage'
import './CsNavigation.css'

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

type MenuId = 'labs' | 'practice' | 'exams'

interface DisclosureProps {
  label: string
  active: boolean
  open: boolean
  onToggle: (open: boolean) => void
  onSelect: (section: CsNavSection) => void
  activeSection: CsNavSection
  items: Array<{ id: CsNavSection; titleKey: MessageKey; descKey: MessageKey; advanced?: boolean }>
  errorCount?: number
}

function CsNavDisclosure({ label, active, open, onToggle, onSelect, activeSection, items, errorCount = 0 }: DisclosureProps) {
  const { t } = useI18n()
  const id = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<'first' | 'last' | null>(null)
  const [position, setPosition] = useState<React.CSSProperties>({})

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const trigger = triggerRef.current
      const dropdown = dropdownRef.current
      if (!trigger || !dropdown) return
      const rect = trigger.getBoundingClientRect()
      const gutter = 12
      const width = Math.min(300, window.innerWidth - gutter * 2)
      const below = window.innerHeight - rect.bottom - gutter - 6
      const above = rect.top - gutter - 6
      const useAbove = below < Math.min(dropdown.scrollHeight, 180) && above > below
      setPosition({
        width,
        left: Math.max(gutter, Math.min(rect.left, window.innerWidth - width - gutter)),
        top: useAbove ? undefined : rect.bottom + 6,
        bottom: useAbove ? window.innerHeight - rect.top + 6 : undefined,
        maxHeight: Math.max(48, useAbove ? above : below),
      })
    }
    const closeOutside = (event: Event) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) onToggle(false)
    }
    place()
    const buttons = dropdownRef.current?.querySelectorAll('button')
    if (pendingFocus.current && buttons?.length) {
      buttons[pendingFocus.current === 'first' ? 0 : buttons.length - 1].focus()
      pendingFocus.current = null
    }
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
    }
  }, [open, onToggle])

  function focusItem(which: 'first' | 'last') {
    if (!open) {
      pendingFocus.current = which
      onToggle(true)
      return
    }
    const buttons = dropdownRef.current?.querySelectorAll('button')
    if (buttons?.length) buttons[which === 'first' ? 0 : buttons.length - 1].focus()
  }

  return (
    <div ref={wrapperRef} className="cs-nav-menu" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        event.stopPropagation()
        onToggle(false)
        triggerRef.current?.focus()
      }
    }}>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className={`cs-nav-item${active ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        onClick={() => onToggle(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            focusItem(event.key === 'ArrowDown' ? 'first' : 'last')
          }
        }}
      >
        {label}
        {errorCount > 0 ? <span className="cs-nav-badge">{errorCount}</span> : null}
      </button>
      {open ? (
        <div
          ref={dropdownRef}
          id={`${id}-options`}
          className="cs-nav-dropdown"
          role="group"
          aria-labelledby={`${id}-trigger`}
          style={position}
          onKeyDown={(event) => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
            const buttons = Array.from(event.currentTarget.querySelectorAll('button'))
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
              : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
            event.preventDefault()
            buttons[next]?.focus()
          }}
        >
          {items.map((item) => (
            <button key={item.id} type="button" aria-current={activeSection === item.id ? 'page' : undefined} onClick={() => {
              triggerRef.current?.focus()
              onSelect(item.id)
            }}>
              <strong>
                {t(item.titleKey)}
                {item.advanced ? <span className="cs-advanced-tag">{t('cs.top.advanced')}</span> : null}
                {item.id === 'errors' && errorCount > 0 ? ` (${errorCount})` : ''}
              </strong>
              <span>{t(item.descKey)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export const CsTopNav: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  errorCount = 0,
}) => {
  const { t } = useI18n()
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null)

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
            aria-current={activeSection === item.id ? 'page' : undefined}
            onClick={() => go(item.id)}
          >
            {t(item.labelKey)}
          </button>
        ))}

        {([
          { id: 'labs', labelKey: 'cs.top.labs', ids: LAB_IDS, items: LABS },
          { id: 'practice', labelKey: 'cs.top.practice', ids: PRACTICE_IDS, items: PRACTICE },
          { id: 'exams', labelKey: 'cs.top.exams', ids: EXAM_IDS, items: EXAMS },
        ] as const).map((menu) => (
          <CsNavDisclosure
            key={menu.id}
            label={t(menu.labelKey)}
            active={menu.ids.includes(activeSection)}
            activeSection={activeSection}
            open={openMenu === menu.id}
            onToggle={(open) => setOpenMenu(open ? menu.id : null)}
            onSelect={go}
            items={menu.items}
            errorCount={menu.id === 'exams' ? errorCount : 0}
          />
        ))}
      </nav>

      <TrackSwitcher current="cs" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
    </header>
  )
}
