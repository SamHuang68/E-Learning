import React from 'react'
import type { MathGradeId, MathStage } from '../data/curriculum'
import { ALL_MATH_GRADES } from '../data/gradeStore'
import type { MathProgressState } from '../utils/mathStorage'
import type { LangId } from '../../utils/storage'
import { TrackSwitcher } from '../../components/TrackSwitcher'

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
  const stages: Array<{ id: MathStage; title: string; grades: MathGradeId[] }> = [
    {
      id: 'elementary',
      title: '國小階段 (G1 ~ G6)',
      grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
    },
    {
      id: 'junior',
      title: '國中階段 (G7 ~ G9)',
      grades: ['g7', 'g8', 'g9'],
    },
    {
      id: 'senior',
      title: '高中階段 (G10 ~ G12)',
      grades: ['g10', 'g11', 'g12'],
    },
  ]

  return (
    <aside className="sidebar math-sidebar">
      <TrackSwitcher current="math" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      {/* 品牌商標 */}
      <button type="button" className="brand brand-button" onClick={() => onNav('today')} aria-label="返回數學今日學習">
        <div className="brand-mark math-mark">∑</div>
        <div>
          <strong>臺灣數學 108課綱</strong>
          <span className="brand-sub">K-12 全學段學習</span>
        </div>
      </button>

      {/* 主功能導覽 */}
      <nav className="nav-group" aria-label="數學核心功能">
        <p className="nav-heading">學習功能</p>
        <button
          type="button"
          className={`nav-item ${activeNav === 'today' ? 'active' : ''}`}
          onClick={() => onNav('today')}
          aria-current={activeNav === 'today' ? 'page' : undefined}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">今日學習 (首頁)</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'practice' ? 'active' : ''}`}
          onClick={() => onNav('practice')}
          aria-current={activeNav === 'practice' ? 'page' : undefined}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">單元題庫練習</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'mock' ? 'active' : ''}`}
          onClick={() => onNav('mock')}
          aria-current={activeNav === 'mock' ? 'page' : undefined}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">會考／學測模考</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'vault' ? 'active' : ''}`}
          onClick={() => onNav('vault')}
          aria-current={activeNav === 'vault' ? 'page' : undefined}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">錯題本 ({progress.errorQuestions.length})</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'visual' ? 'active' : ''}`}
          onClick={() => onNav('visual')}
          aria-current={activeNav === 'visual' ? 'page' : undefined}
        >
          <span className="nav-icon">🎨</span>
          <span className="nav-label">幾何圖示解題</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'labs' ? 'active' : ''}`}
          onClick={() => onNav('labs')}
          aria-current={activeNav === 'labs' ? 'page' : undefined}
        >
          <span className="nav-icon">🧪</span>
          <span className="nav-label">互動教具實驗室</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'calculus' ? 'active' : ''}`}
          onClick={() => onNav('calculus')}
          aria-current={activeNav === 'calculus' ? 'page' : undefined}
        >
          <span className="nav-icon">∫</span>
          <span className="nav-label">微積分專題</span>
        </button>
      </nav>

      {/* 12 年級快速切換 */}
      <nav className="nav-group grades-nav-group" aria-label="年級切換">
        <p className="nav-heading">年級與學段切換</p>
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
