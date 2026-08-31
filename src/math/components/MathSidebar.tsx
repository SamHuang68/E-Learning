import React from 'react'
import type { MathGradeId, MathStage } from '../data/curriculum'
import { ALL_MATH_GRADES } from '../data/gradeStore'
import type { MathProgressState } from '../utils/mathStorage'
import type { LangId } from '../../utils/storage'

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
 * 數學模組左側導覽列 (MathSidebar)
 * 提供 12 個年級（國小 G1~G6、國中 G7~G9、高中 G10~G12）階層切換與功能跳轉。
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
      {/* 品牌商標 */}
      <div className="brand" onClick={() => onNav('today')} role="button" tabIndex={0}>
        <div className="brand-mark math-mark">∑</div>
        <div>
          <strong>臺灣數學 108課綱</strong>
          <span className="brand-sub">K-12 全學段學習</span>
        </div>
      </div>

      {/* 四軌切換膠囊 */}
      <div className="lang-switch four-ways" role="group" aria-label="四大學習軌道切換">
        <button type="button" onClick={() => onSwitchLang('ja')}>
          あ 日本語
        </button>
        <button type="button" onClick={() => onSwitchLang('en')}>
          T 多益
        </button>
        <button type="button" className="active" aria-current="true" disabled>
          ∑ 數學
        </button>
        <button type="button" onClick={() => onSwitchLang('calculus')}>
          ∫ 微積分
        </button>
      </div>

      {/* 頂部全域入口導覽 */}
      <div className="sidebar-top-actions">
        <button type="button" className="hub-back" onClick={onBackHub}>
          ← 回學習總覽 (Hub)
        </button>
      </div>

      {/* 主功能導覽 */}
      <nav className="nav-group">
        <p className="nav-heading">學習功能</p>
        <button
          type="button"
          className={`nav-item ${activeNav === 'today' ? 'active' : ''}`}
          onClick={() => onNav('today')}
        >
          <span className="nav-icon">📅</span>
          <span>今日學習 (課程首頁)</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'practice' ? 'active' : ''}`}
          onClick={() => onNav('practice')}
        >
          <span className="nav-icon">✏️</span>
          <span>單元題庫練習</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'mock' ? 'active' : ''}`}
          onClick={() => onNav('mock')}
        >
          <span className="nav-icon">📝</span>
          <span>會考／學測模考</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'vault' ? 'active' : ''}`}
          onClick={() => onNav('vault')}
        >
          <span className="nav-icon">📖</span>
          <span>錯題本 ({progress.errorQuestions.length})</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'visual' ? 'active' : ''}`}
          onClick={() => onNav('visual')}
        >
          <span className="nav-icon">🎨</span>
          <span>幾何圖示解題 (Visual)</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'labs' ? 'active' : ''}`}
          onClick={() => onNav('labs')}
        >
          <span className="nav-icon">🧪</span>
          <span>互動教具實驗室</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'calculus' ? 'active' : ''}`}
          onClick={() => onNav('calculus')}
        >
          <span className="nav-icon">∫</span>
          <span>微積分專題 (Studio)</span>
        </button>
      </nav>

      {/* 12 年級快速切換 */}
      <nav className="nav-group grades-nav-group">
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

      {/* 底部按鈕 */}
      <div className="sidebar-footer">
        <button type="button" className="btn-sidebar-link" onClick={onBackHub}>
          ← 返回學習中心 (Hub)
        </button>
        <div className="track-switchers">
          <span>切換其他軌道：</span>
          <button type="button" onClick={() => onSwitchLang('calculus')}>微積分</button>
          <button type="button" onClick={() => onSwitchLang('ja')}>日語</button>
          <button type="button" onClick={() => onSwitchLang('en')}>多益</button>
        </div>
      </div>
    </aside>
  )
}
