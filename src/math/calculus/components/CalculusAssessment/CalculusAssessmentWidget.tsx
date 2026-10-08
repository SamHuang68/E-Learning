import React, { useState } from 'react'
import { CALCULUS_PROBLEMS } from '../../data/calculusProblems'
import { localizeCalculusProblem } from '../../data/calculusProblemEnglish'
import type { CalculusProblem } from '../../types'
import { useI18n } from '../../../../i18n/i18n'

interface Props {
  currentTheta: number
  onSolveProblem: (problem: CalculusProblem, isCorrect: boolean) => void
  onSelectProblem: (problem: CalculusProblem) => void
}

export const CalculusAssessmentWidget: React.FC<Props> = ({
  currentTheta,
  onSolveProblem,
  onSelectProblem,
}) => {
  const { locale } = useI18n()
  const copy = (zh: string, en: string) => locale === 'en' ? en : zh
  const problems = locale === 'en' ? CALCULUS_PROBLEMS.map(localizeCalculusProblem) : CALCULUS_PROBLEMS
  const [activeProblemId, setActiveProblemId] = useState<string>(CALCULUS_PROBLEMS[0].id)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)

  const activeProblem = problems.find((p) => p.id === activeProblemId) ?? problems[0]

  const handleSelectProblem = (p: CalculusProblem) => {
    setActiveProblemId(p.id)
    setSelectedOpt(null)
    setIsAnswered(false)
    onSelectProblem(p)
  }

  const handleAnswer = (optIdx: number) => {
    if (isAnswered) return
    setSelectedOpt(optIdx)
    setIsAnswered(true)
    const isCorrect = optIdx === activeProblem.correctIndex
    onSolveProblem(activeProblem, isCorrect)
  }

  return (
    <div className="calculus-assessment-widget">
      {/* 頂部能力與階梯標題 */}
      <div className="assessment-topbar">
        <div className="theta-gauge-box">
          <span className="gauge-label">{copy('本機 2PL IRT 估計 θ（非正式鑑定）：', 'Local 2PL IRT estimate θ (informal):')}</span>
          <strong className="gauge-value">{currentTheta >= 0 ? `+${currentTheta.toFixed(2)}` : currentTheta.toFixed(2)}</strong>
          <span className="gauge-tag">{currentTheta >= 1.0
            ? copy('作答估計帶：偏難', 'Estimated response band: advanced')
            : currentTheta >= 0
              ? copy('作答估計帶：中間', 'Estimated response band: intermediate')
              : copy('作答估計帶：偏易', 'Estimated response band: foundational')}</span>
        </div>

        <div className="tier-pills-row">
          {problems.map((prob) => (
            <button
              key={prob.id}
              type="button"
              className={`btn-tier-pill ${prob.id === activeProblemId ? 'active' : ''}`}
              aria-label={`${prob.tier} ${prob.tierLabel} — ${prob.title}`}
              aria-pressed={prob.id === activeProblemId}
              onClick={() => handleSelectProblem(prob)}
            >
              <span className="tier-badge">{prob.tier}</span>
              <span>{prob.tierLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 題目主要卡片 */}
      <div className="problem-challenge-card">
        <div className="problem-header-row">
          <span className="tier-label-badge">{activeProblem.tier} · {activeProblem.tierLabel}</span>
          <h4>{activeProblem.title}</h4>
        </div>

        <p className="problem-question-text">{activeProblem.questionText}</p>

        {activeProblem.options && (
          <div className="problem-options-list">
            {activeProblem.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx
              const isCorrect = idx === activeProblem.correctIndex
              let btnCls = 'btn-prob-option'
              if (isAnswered) {
                if (isCorrect) btnCls += ' correct'
                else if (isSelected) btnCls += ' wrong'
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={btnCls}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  aria-pressed={isSelected}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>
        )}

        {isAnswered && (
          <div className={`answer-feedback-box ${selectedOpt === activeProblem.correctIndex ? 'success' : 'warn'}`} role="status" aria-atomic="true">
            <div className="feedback-icon">{selectedOpt === activeProblem.correctIndex ? '🎉' : '💡'}</div>
            <div>
              <strong>{selectedOpt === activeProblem.correctIndex
                ? copy('回答正確！', 'Correct!')
                : copy('解析與幾何破題引導：', 'Explanation and geometric strategy:')}</strong>
              <p>{activeProblem.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
