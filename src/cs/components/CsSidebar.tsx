import React from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import type { LangId } from '../../utils/storage'
import { useI18n } from '../../i18n/i18n'
import { CS_LAB_ID, type CsLabId } from '../csLabRegistry'

export type CsNavSection =
  | 'today'
  | 'practice'
  | 'signals'
  | 'mock'
  | 'errors'
  | CsLabId

interface Props {
  activeSection: CsNavSection
  onSelectSection: (section: CsNavSection) => void
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
  xp: number
  errorCount?: number
}

export const CsSidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  xp,
  errorCount = 0,
}) => {
  const { t } = useI18n()
  const NAV_ITEMS: Array<{ id: CsNavSection; icon: string; title: string; subtitle: string; badge?: string }> = [
    { id: 'today', icon: '💻', title: t('cs.nav.today'), subtitle: t('cs.nav.todaySub') },
    { id: 'practice', icon: '📚', title: t('cs.nav.practice'), subtitle: t('cs.nav.practiceSub') },
    { id: 'signals', icon: '⚡', title: t('cs.nav.signals'), subtitle: t('cs.nav.signalsSub') },
    { id: CS_LAB_ID.ARCH_MAP, icon: '🏛️', title: t('cs.nav.arch'), subtitle: t('cs.nav.archSub'), badge: 'NEW' },
    { id: CS_LAB_ID.VON_NEUMANN, icon: '⚙️', title: t('cs.nav.von'), subtitle: t('cs.nav.vonSub') },
    { id: CS_LAB_ID.PIPELINE_HAZARD, icon: '⚡', title: t('cs.nav.pipe'), subtitle: t('cs.nav.pipeSub') },
    { id: CS_LAB_ID.CACHE_MAPPING, icon: '💾', title: t('cs.nav.cache'), subtitle: t('cs.nav.cacheSub') },
    { id: CS_LAB_ID.AI_TRANSFORMER, icon: '🤖', title: t('cs.nav.ai'), subtitle: t('cs.nav.aiSub') },
    { id: 'mock', icon: '📝', title: t('cs.nav.mock'), subtitle: t('cs.nav.mockSub') },
    { id: 'errors', icon: '📕', title: t('cs.nav.errors'), subtitle: t('cs.nav.errorsSub'), badge: errorCount > 0 ? `${errorCount}` : undefined },
  ]

  return (
    <aside className="math-sidebar cs-sidebar" style={{ width: '260px', minWidth: '260px', flexShrink: 0 }}>
      {/* 頂部切換 */}
      <TrackSwitcher current="cs" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />

      {/* 品牌標題 */}
      <div className="sidebar-brand-box" style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>💻</span>
          <div>
            <h2 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>{t('cs.brand')}</h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{t('cs.brandSub')}</span>
          </div>
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
          <span style={{ color: 'var(--muted)' }}>{t('nav.xp')}</span>
          <span style={{ fontWeight: 700, color: '#2563eb' }}>{xp} XP</span>
        </div>
      </div>

      {/* 導航選單 */}
      <nav style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button aria-pressed={isActive}
              key={item.id}
              type="button"
              className={`practice-card ${isActive ? 'active' : ''}`}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: isActive ? '2px solid #2563eb' : '1px solid transparent',
                background: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => onSelectSection(item.id)}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.82rem', color: isActive ? '#2563eb' : 'var(--text)' }}>
                    {item.title}
                  </strong>
                  {item.badge && (
                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '999px', background: '#ef4444', color: '#fff', fontWeight: 700 }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.subtitle}
                </span>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
