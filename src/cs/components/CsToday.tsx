import React, { useState } from 'react'
import type { CsProgress } from '../utils/csStorage'
import { CS_CURRICULUM, getCsQuestionCount, getNextCsUnit, isCsAdvancedUnit } from '../data/curriculum'
import { computeCsRadar } from '../../engine/radar'
import type { CsNavSection } from './CsTopNav'

interface Props {
  progress: CsProgress
  onNavigate: (section: CsNavSection, unitId?: string) => void
}

export const CsToday: React.FC<Props> = ({ progress, onNavigate }) => {
  const [showProgress, setShowProgress] = useState(false)
  const nextUnit = getNextCsUnit(progress.completedQuestions)
  const unitIndex = CS_CURRICULUM.findIndex((unit) => unit.id === nextUnit.id) + 1
  const remaining = nextUnit.questions.filter((q) => !progress.completedQuestions.includes(q.id)).length
  const doneInUnit = nextUnit.questions.length - remaining
  const totalQuestions = getCsQuestionCount()
  const completedCount = progress.completedQuestions.length
  const hasProgress = completedCount > 0 || progress.xp > 0
  const labId = nextUnit.suggestedLab as CsNavSection | undefined
  const showAdvancedLab = labId === 'ai-transformer' && isCsAdvancedUnit(nextUnit)

  const radar = computeCsRadar(
    progress.completedQuestions,
    progress.examScores,
    progress.labCompleted,
  )

  return (
    <div className="cs-today">
      <header className="cs-today-hero">
        <p className="eyebrow">單元 {unitIndex}／{CS_CURRICULUM.length}</p>
        <h1>下一步：{nextUnit.title.replace(/^單元 \d+：/, '')}</h1>
        <p className="lede">{nextUnit.subtitle}。從抽象層與指令如何執行開始，進階主題先放在課綱裡。</p>
        <p className="cs-today-progress-line">
          本單元 {doneInUnit}／{nextUnit.questions.length} 題
          {hasProgress ? ` · 全課 ${completedCount}／${totalQuestions}` : ''}
        </p>
        <div className="hub-hero-actions">
          <button
            type="button"
            className="hub-primary-cta"
            onClick={() => onNavigate('practice', nextUnit.id)}
          >
            練習本單元（約 20 分鐘）
          </button>
          {labId && !showAdvancedLab ? (
            <button type="button" className="hub-secondary-cta" onClick={() => onNavigate(labId)}>
              先看實驗室
            </button>
          ) : (
            <button type="button" className="hub-secondary-cta" onClick={() => onNavigate('textbook')}>
              讀本第 {unitIndex} 章
            </button>
          )}
        </div>
        <div className="cs-today-secondary">
          <button type="button" onClick={() => onNavigate('hierarchy')}>
            課綱全覽
          </button>
          <button type="button" onClick={() => onNavigate('textbook')}>
            讀本
          </button>
          {hasProgress ? (
            <button type="button" onClick={() => setShowProgress((open) => !open)}>
              {showProgress ? '收合進度' : '練習覆蓋'}
            </button>
          ) : null}
        </div>
      </header>

      {showProgress && hasProgress ? (
        <section className="cs-today-radar" aria-label="練習覆蓋">
          <div className="section-header-row">
            <h2>練習覆蓋</h2>
            <span className="section-subtext">平均 {radar.averageScore}／100</span>
          </div>
          {radar.dimensions.map((dim) => (
            <div key={dim.key} className="cs-radar-row">
              <div className="cs-radar-row-top">
                <span>{dim.label}</span>
                <strong>{dim.score}</strong>
              </div>
              <div className="cs-radar-bar">
                <i style={{ width: `${dim.score}%` }} />
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  )
}
