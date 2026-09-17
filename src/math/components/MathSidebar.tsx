import React from 'react'
import type { MathGradeId, MathStage } from '../data/curriculum'
import { ALL_MATH_GRADES } from '../data/gradeStore'
import type { MathProgressState } from '../utils/mathStorage'
import type { LangId } from '../../utils/storage'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'

export type MathNavId = 'today' | 'practice' | 'mock' | 'vault' | 'labs' | 'visual' | 'calculus'

type Props = {
  activeNav: MathNavId
  onNav: (nav: MathNavId) => void
  currentGradeId: MathGradeId
  onSelectGrade: (gradeId: MathGradeId) => void
  progress: MathProgressState
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

/**
 * 數學模組專注側邊欄 (MathSidebar)
 * 專注模式：僅包含臺灣數學 108 課綱導覽與 12 年級快速切換，無跳轉干擾，版面收緊於一頁。
 */
export const MathSidebar: React.FC<Props> = ({
  activeNav,
  onNav,
  currentGradeId,
  onSelectGrade,
  progress,
  onBackHub,
  onSwitchLang,
}) => {
  const { t } = useI18n()
  const stages: Array<{ id: MathStage; title: string; grades: MathGradeId[] }> = [
    {
      id: 'elementary',
      title: t('math.stage.elementary'),
      grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
    },
    {
      id: 'junior',
      title: t('math.stage.junior'),
      grades: ['g7', 'g8', 'g9'],
    },
    {
      id: 'senior',
      title: t('math.stage.senior'),
      grades: ['g10', 'g11', 'g12'],
    },
  ]

  return (
    <aside className="sidebar math-sidebar">
      <TrackSwitcher current="math" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      {/* 品牌商標 */}
      <button type="button" className="brand brand-button" onClick={() => onNav('today')} aria-label={t('math.backToday')}>
        <div className="brand-mark math-mark">∑</div>
        <div>
          <strong>{t('math.brand')}</strong>
          <span className="brand-sub">{t('math.brandSub')}</span>
        </div>
      </button>

      {/* 主功能導覽 */}
      <nav className="nav-group" aria-label={t('nav.mathAria')}>
        <p className="nav-heading">{t('nav.learning')}</p>
        <button
          type="button"
          className={`nav-item ${activeNav === 'today' ? 'active' : ''}`}
          onClick={() => onNav('today')}
          aria-current={activeNav === 'today' ? 'page' : undefined}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">{t('nav.todayHome')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'practice' ? 'active' : ''}`}
          onClick={() => onNav('practice')}
          aria-current={activeNav === 'practice' ? 'page' : undefined}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">{t('nav.practice')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'mock' ? 'active' : ''}`}
          onClick={() => onNav('mock')}
          aria-current={activeNav === 'mock' ? 'page' : undefined}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">{t('nav.mockMath')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'vault' ? 'active' : ''}`}
          onClick={() => onNav('vault')}
          aria-current={activeNav === 'vault' ? 'page' : undefined}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">{t('nav.vault', { count: progress.errorQuestions.length })}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'visual' ? 'active' : ''}`}
          onClick={() => onNav('visual')}
          aria-current={activeNav === 'visual' ? 'page' : undefined}
        >
          <span className="nav-icon">🎨</span>
          <span className="nav-label">{t('nav.visual')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'labs' ? 'active' : ''}`}
          onClick={() => onNav('labs')}
          aria-current={activeNav === 'labs' ? 'page' : undefined}
        >
          <span className="nav-icon">🧪</span>
          <span className="nav-label">{t('nav.labs')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'calculus' ? 'active' : ''}`}
          onClick={() => onNav('calculus')}
          aria-current={activeNav === 'calculus' ? 'page' : undefined}
        >
          <span className="nav-icon">∫</span>
          <span className="nav-label">{t('nav.calculusTopic')}</span>
        </button>
      </nav>

      {/* 12 年級快速切換 */}
      <nav className="nav-group grades-nav-group" aria-label={t('nav.gradeAria')}>
        <p className="nav-heading">{t('nav.grades')}</p>
        {stages.map((stg) => (
          <div key={stg.id} className="stage-block">
            <span className="stage-title">{stg.title}</span>
            <div className="grades-pill-grid">
              {stg.grades.map((gid) => {
                const g = ALL_MATH_GRADES[gid]
                const isSelected = gid === currentGradeId
                return (
                  <button
                    key={gid}
                    type="button"
                    className={`grade-pill-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectGrade(gid)}
                    aria-pressed={isSelected}
                    title={g.name}
                  >
                    {gid.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
export default MathSidebar
