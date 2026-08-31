import React, { useState } from 'react'
import { MathFormula } from '../../../components/MathFormula'
import type { DerivationStep } from '../../types'

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
        <strong className="step-rule-name">{step.ruleName}</strong>
        {isCompleted && <span className="step-check-icon">✓</span>}
      </div>

      <div className="step-card-body">
        <div className="step-formula-box">
          <div className="formula-row before">
            <span className="label">推導前：</span>
            <MathFormula math={step.beforeLatex} />
          </div>
          <div className="formula-arrow">↓ <MathFormula math={step.ruleLatex} /></div>
          <div className="formula-row after">
            <span className="label">推導後：</span>
            <MathFormula math={step.afterLatex} />
          </div>
        </div>

        <p className="step-explanation">{step.explanation}</p>

        <div className="step-insight-badge">
          💡 <strong>核心關鍵</strong>：{step.keyInsight}
        </div>

        {/* 形成性檢測題 */}
        {step.checkpoint && (
          <div className="step-checkpoint-box" onClick={(e) => e.stopPropagation()}>
            <p className="checkpoint-prompt">❓ <strong>隨堂檢測</strong>：{step.checkpoint.prompt}</p>
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
                    {opt}
                  </button>
                )
              })}
            </div>
            {hasAnswered && (
              <p className="checkpoint-hint">
                {selectedOption === step.checkpoint.correctIndex
                  ? '🎉 正確！概念掌握清晰！'
                  : `⚠️ ${step.checkpoint.hint}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
