import { useCalculusCopy } from '../../../../i18n/calculusCopy'
import React, { useState } from 'react'
import { MathFormula } from '../../../components/MathFormula'
import type { DerivationStep } from '../../types'
import { useI18n } from '../../../../i18n/i18n'

interface Props {
  step: DerivationStep
  isActive: boolean
  isCompleted: boolean
  onSelect: () => void
  onCheckpointComplete?: (isCorrect: boolean) => void
}

export const FormulaStepCard: React.FC<Props> = ({
  step,
  isActive,
  isCompleted,
  onSelect,
  onCheckpointComplete,
}) => {
  const c = useCalculusCopy()
  const { t } = useI18n()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleChooseOption = (idx: number) => {
    if (hasAnswered) return
    setSelectedOption(idx)
    setHasAnswered(true)
    const isCorrect = step.checkpoint ? idx === step.checkpoint.correctIndex : true
    onCheckpointComplete?.(isCorrect)
  }

  return (
    <div
      className={`formula-step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={onSelect}
    >
      <div className="step-card-header">
        <span className="step-number-badge">Step {step.stepNumber}</span>
        <strong className="step-rule-name">{c(step.ruleName)}</strong>
        {isCompleted && <span className="step-check-icon">✓</span>}
      </div>

      <div className="step-card-body">
        <div className="step-formula-box">
          <div className="formula-row before">
            <span className="label">{t('calculus.derivBefore') || c('推導前 / Before:')}</span>
            <MathFormula math={c(step.beforeLatex)} a11yLabel={c(`微積分推導步驟前公式: ${c(step.beforeLatex)} / Calculus derivation before: ${c(step.beforeLatex)}`)} />
          </div>
          <div className="formula-arrow">↓ <MathFormula math={c(step.ruleLatex)} a11yLabel={c(`規則: ${c(step.ruleLatex)} / Rule: ${c(step.ruleLatex)}`)} /></div>
          <div className="formula-row after">
            <span className="label">{t('calculus.derivAfter') || c('推導後 / After:')}</span>
            <MathFormula math={c(step.afterLatex)} a11yLabel={c(`微積分推導步驟後公式: ${c(step.afterLatex)} / Calculus derivation after: ${c(step.afterLatex)}`)} />
          </div>
        </div>

        <p className="step-explanation">{c(step.explanation)}</p>

        <div className="step-insight-badge">
          💡 <strong>{c("核心關鍵")}</strong>：{c(step.keyInsight)}
        </div>

        {/* 形成性檢測題 */}
        {step.checkpoint && (
          <div className="step-checkpoint-box" onClick={(e) => e.stopPropagation()}>
            <p className="checkpoint-prompt">❓ <strong>{c("隨堂檢測")}</strong>：{c(step.checkpoint.prompt)}</p>
            <div className="checkpoint-options">
              {step.checkpoint.options.map((opt, idx) => {
                const isSelected = selectedOption === idx
                const isCorrect = idx === step.checkpoint?.correctIndex
                let btnCls = 'btn-checkpoint-opt'
                if (hasAnswered) {
                  if (isCorrect) btnCls += ' correct'
                  else if (isSelected) btnCls += ' wrong'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={btnCls}
                    onClick={() => handleChooseOption(idx)}
                    disabled={hasAnswered}
                  >
                    {c(opt)}
                  </button>
                )
              })}
            </div>
            {hasAnswered && (
              <p className="checkpoint-hint">
                {selectedOption === step.checkpoint.correctIndex
                  ? c('🎉 正確！概念掌握清晰！')
                  : `⚠️ ${c(step.checkpoint.hint)}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
