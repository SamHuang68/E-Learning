import React from 'react'
import type { PhysicsGradeId, PhysicsStage } from '../data/curriculum'
import { getPhysicsGradeInfo } from '../data/curriculum'
import type { PhysicsProgressState } from '../utils/physicsStorage'
import type { LangId } from '../../utils/storage'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'

export type PhysicsNavId = 'today' | 'practice' | 'mock' | 'vault' | 'labs' | 'signals'

type Props = {
  activeNav: PhysicsNavId
  onNav: (nav: PhysicsNavId) => void
  currentGradeId: PhysicsGradeId
  onSelectGrade: (gradeId: PhysicsGradeId) => void
  progress: PhysicsProgressState
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const PhysicsSidebar: React.FC<Props> = ({
  activeNav,
  onNav,
  currentGradeId,
  onSelectGrade,
  progress,
  onBackHub,
  onSwitchLang,
}) => {
  const { t, locale } = useI18n()
  const stages: Array<{ id: PhysicsStage; title: string; grades: PhysicsGradeId[] }> = [
    {
      id: 'junior',
      title: t('physics.stage.junior'),
      grades: ['g7', 'g8', 'g9'],
    },
    {
      id: 'senior',
      title: t('physics.stage.senior'),
      grades: ['g10', 'g11', 'g12'],
    },
  ]

  return (
    <aside className="sidebar math-sidebar physics-sidebar">
      <TrackSwitcher current="physics" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      {/* 品牌商標 */}
      <button type="button" className="brand brand-button" onClick={() => onNav('today')} aria-label={t('physics.backToday')}>
        <div className="brand-mark math-mark" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>⚛️</div>
        <div>
          <strong>{t('physics.brand')}</strong>
          <span className="brand-sub">{t('physics.brandSub')}</span>
        </div>
      </button>

      {/* 主功能導覽 */}
      <nav className="nav-group" aria-label={t('nav.physicsAria')}>
        <button
          type="button"
          className={activeNav === 'today' ? 'active' : ''}
          onClick={() => onNav('today')}
          aria-current={activeNav === 'today' ? 'page' : undefined}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">{t('nav.todayHome')}</span>
        </button>
        <button
          type="button"
          className={activeNav === 'practice' ? 'active' : ''}
          onClick={() => onNav('practice')}
          aria-current={activeNav === 'practice' ? 'page' : undefined}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">{t('nav.practice')}</span>
        </button>
        <button
          type="button"
          className={activeNav === 'mock' ? 'active' : ''}
          onClick={() => onNav('mock')}
          aria-current={activeNav === 'mock' ? 'page' : undefined}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">{t('nav.mockExam')}</span>
        </button>
        <button
          type="button"
          className={activeNav === 'vault' ? 'active' : ''}
          onClick={() => onNav('vault')}
          aria-current={activeNav === 'vault' ? 'page' : undefined}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">{t('nav.vault', { count: progress.errorQuestions.length })}</span>
        </button>
        <button
          type="button"
          className={activeNav === 'signals' ? 'active' : ''}
          onClick={() => onNav('signals')}
          aria-current={activeNav === 'signals' ? 'page' : undefined}
        >
          <span className="nav-icon">⚡</span>
          <span className="nav-label">{t('nav.signals3s')}</span>
        </button>
        <button
          type="button"
          className={activeNav === 'labs' ? 'active' : ''}
          onClick={() => onNav('labs')}
          aria-current={activeNav === 'labs' ? 'page' : undefined}
        >
          <span className="nav-icon">🧪</span>
          <span className="nav-label">{t('nav.physicsLabs')}</span>
        </button>
      </nav>

      {/* 年級與學段快速切換 */}
      <div className="grades-nav-group">
        <span className="nav-heading">{t('nav.stages')}</span>
        {stages.map((st) => (
          <div key={st.id} className="stage-block">
            <span className="stage-title">{st.title}</span>
            <div className="grades-pill-grid">
              {st.grades.map((gid) => {
                const info = getPhysicsGradeInfo(gid)
                const isSelected = gid === currentGradeId
                return (
                  <button
                    key={gid}
                    type="button"
                    className={`grade-pill-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectGrade(gid)}
                    title={locale === 'en' ? info.nameEn : info.name}
                    aria-pressed={isSelected}
                  >
                    {gid.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
