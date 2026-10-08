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
  const { t, locale } = useI18n()
  const copy = (zh: string, en: string) => locale === 'en' ? en : zh
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const invalidExpression = step.id === 'step-parse-error' || step.id === 'step-symbol-error'
  const beforeMath = step.beforeLatex

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
      <button
        type="button"
        className="step-card-header"
        aria-current={isActive ? 'step' : undefined}
        onClick={(event) => { event.stopPropagation(); onSelect() }}
      >
        <span className="step-number-badge">Step {step.stepNumber}</span>
        <strong className="step-rule-name">{step.ruleName}</strong>
        {isCompleted && <span className="step-check-icon">✓</span>}
      </button>

      <div className="step-card-body">
        <div className="step-formula-box">
          <div className="formula-row before">
            <span className="label">{t('calculus.derivBefore') || copy('推導前：', 'Before:')}</span>
            <MathFormula
              math={beforeMath}
              a11yLabel={invalidExpression
                ? `${t('calculus.derivBefore')}: ${beforeMath}`
                : copy(`微積分推導步驟前公式: ${beforeMath}`, `Calculus derivation before: ${beforeMath}`)}
            />
          </div>
          <div className="formula-arrow">↓ <MathFormula math={step.ruleLatex} a11yLabel={copy(`規則: ${step.ruleLatex}`, `Rule: ${step.ruleLatex}`)} /></div>
          <div className="formula-row after">
            <span className="label">{t('calculus.derivAfter') || copy('推導後：', 'After:')}</span>
            <MathFormula math={step.afterLatex} a11yLabel={copy(`微積分推導步驟後公式: ${step.afterLatex}`, `Calculus derivation after: ${step.afterLatex}`)} />
          </div>
        </div>

        <p className="step-explanation">{step.explanation}</p>

        <div className="step-insight-badge">
          💡 <strong>{copy('核心關鍵', 'Key insight')}</strong>{copy('：', ': ')}{step.keyInsight}
        </div>

        {/* 形成性檢測題 */}
        {step.checkpoint && (
          <div className="step-checkpoint-box" onClick={(e) => e.stopPropagation()}>
            <p className="checkpoint-prompt">❓ <strong>{copy('隨堂檢測', 'Checkpoint')}</strong>{copy('：', ': ')}{step.checkpoint.prompt}</p>
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
                    aria-pressed={isSelected}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {hasAnswered && (
              <p className="checkpoint-hint" role="status" aria-atomic="true">
                {selectedOption === step.checkpoint.correctIndex
                  ? copy('🎉 正確！概念掌握清晰！', '🎉 Correct—your reasoning is on track!')
                  : `⚠️ ${step.checkpoint.hint}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
