import React from 'react'
import type { ChemistryGradeId, ChemistryStage } from '../data/curriculum'
import { getChemistryGradeInfo } from '../data/curriculum'
import type { ChemistryProgressState } from '../utils/chemistryStorage'
import type { LangId } from '../../utils/storage'
import { TrackSwitcher } from '../../components/TrackSwitcher'

export type ChemistryNavId = 'today' | 'practice' | 'mock' | 'vault' | 'labs' | 'signals'

type Props = {
  activeNav: ChemistryNavId
  onNav: (nav: ChemistryNavId) => void
  currentGradeId: ChemistryGradeId
  onSelectGrade: (gradeId: ChemistryGradeId) => void
  progress: ChemistryProgressState
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const ChemistrySidebar: React.FC<Props> = ({
  activeNav,
  onNav,
  currentGradeId,
  onSelectGrade,
  progress,
  onBackHub,
  onSwitchLang,
}) => {
  const stages: Array<{ id: ChemistryStage; title: string; grades: ChemistryGradeId[] }> = [
    {
      id: 'junior',
      title: '國中自然化學 (G7 ~ G9)',
      grades: ['g7', 'g8', 'g9'],
    },
    {
      id: 'senior',
      title: '高中化學 (G10 ~ G12)',
      grades: ['g10', 'g11', 'g12'],
    },
  ]

  return (
    <aside className="sidebar math-sidebar chemistry-sidebar">
      <TrackSwitcher current="chemistry" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      {/* 品牌商標 */}
      <button type="button" className="brand brand-button" onClick={() => onNav('today')} aria-label="返回化學今日學習">
        <div className="brand-mark math-mark" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>🧪</div>
        <div>
          <strong>高中/國中化學 108課綱</strong>
          <span className="brand-sub">分子微觀與反應計量</span>
        </div>
      </button>

      {/* 主功能導覽 */}
      <nav className="nav-group" aria-label="化學核心功能">
        <button
          type="button"
          className={activeNav === 'today' ? 'active' : ''}
          onClick={() => onNav('today')}
          aria-current={activeNav === 'today' ? 'page' : undefined}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">今日學習 (首頁)</span>
        </button>
        <button
          type="button"
          className={activeNav === 'practice' ? 'active' : ''}
          onClick={() => onNav('practice')}
          aria-current={activeNav === 'practice' ? 'page' : undefined}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">單元題庫練習</span>
        </button>
        <button
          type="button"
          className={activeNav === 'mock' ? 'active' : ''}
          onClick={() => onNav('mock')}
          aria-current={activeNav === 'mock' ? 'page' : undefined}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">會考/學測/分科模考</span>
        </button>
        <button
          type="button"
          className={activeNav === 'vault' ? 'active' : ''}
          onClick={() => onNav('vault')}
          aria-current={activeNav === 'vault' ? 'page' : undefined}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">錯題本 ({progress.errorQuestions.length})</span>
        </button>
        <button
          type="button"
          className={activeNav === 'signals' ? 'active' : ''}
          onClick={() => onNav('signals')}
          aria-current={activeNav === 'signals' ? 'page' : undefined}
        >
          <span className="nav-icon">⚡</span>
          <span className="nav-label">3秒破題訊號卡</span>
        </button>
        <button
          type="button"
          className={activeNav === 'labs' ? 'active' : ''}
          onClick={() => onNav('labs')}
          aria-current={activeNav === 'labs' ? 'page' : undefined}
        >
          <span className="nav-icon">🔬</span>
          <span className="nav-label">動態化學實驗室</span>
        </button>
      </nav>

      {/* 年級與學段快速切換 */}
      <div className="grades-nav-group">
        <span className="nav-heading">學段與年級切換</span>
        {stages.map((st) => (
          <div key={st.id} className="stage-block">
            <span className="stage-title">{st.title}</span>
            <div className="grades-pill-grid">
              {st.grades.map((gid) => {
                const info = getChemistryGradeInfo(gid)
                const isSelected = gid === currentGradeId
                return (
                  <button
                    key={gid}
                    type="button"
                    className={`grade-pill-btn ${isSelected ? 'selected' : ''}`}
                    style={isSelected ? { background: '#059669', borderColor: '#059669' } : {}}
                    onClick={() => onSelectGrade(gid)}
                    title={info.name}
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
