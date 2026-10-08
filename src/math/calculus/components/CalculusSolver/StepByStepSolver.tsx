import React, { useEffect, useRef, useState } from 'react'
import { FormulaStepCard } from './FormulaStepCard'
import type { DerivationStep } from '../../types'
import { playCorrectSound, playBadgeUnlockedSound } from '../../../../engine/audioSynthesizer'
import { useI18n } from '../../../../i18n/i18n'

interface Props {
  // Localized by the caller; may contain an opaque user-entered expression.
  problemTitle: string
  steps: DerivationStep[]
  currentStepIndex: number
  onStepChange: (index: number) => void
  onCheckpointAnswer?: (isCorrect: boolean, stepNumber: number) => void
  onSyncCanvas?: (params: Record<string, unknown>) => void
}

export const StepByStepSolver: React.FC<Props> = ({
  problemTitle,
  steps,
  currentStepIndex,
  onStepChange,
  onCheckpointAnswer,
}) => {
  const { locale } = useI18n()
  const copy = (zh: string, en: string) => locale === 'en' ? en : zh
  const [revealedCount, setRevealedCount] = useState<number>(1)
  const streamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (revealedCount > 1) {
      streamRef.current?.querySelector<HTMLButtonElement>('.formula-step-card:last-child .step-card-header')?.focus()
    }
  }, [revealedCount])

  const handleRevealNext = () => {
    if (revealedCount < steps.length) {
      const next = revealedCount + 1
      setRevealedCount(next)
      onStepChange(revealedCount)
      if (next >= steps.length) {
        playBadgeUnlockedSound()
      }
    }
  }

  return (
    <div className="step-by-step-solver-panel">
      <div className="solver-header">
        <div>
          <h4>{copy('📝 步驟式代數推導與解題器', '📝 Step-by-Step Algebraic Derivation')}</h4>
          <p className="problem-title-display">{problemTitle}</p>
        </div>
        <span className="step-progress-indicator" role="status" aria-atomic="true">
          {copy('進度：', 'Progress: ')}{revealedCount} / {steps.length} {copy('步驟', 'steps')}
        </span>
      </div>

      <div className="steps-stream-list" ref={streamRef}>
        {steps.slice(0, revealedCount).map((step, idx) => (
          <FormulaStepCard
            key={step.id}
            step={step}
            isActive={currentStepIndex === idx}
            isCompleted={idx < revealedCount - 1}
            onSelect={() => onStepChange(idx)}
            onCheckpointComplete={(isCorrect) => {
              if (isCorrect) playCorrectSound()
              onCheckpointAnswer?.(isCorrect, step.stepNumber)
            }}
          />
        ))}
      </div>

      {revealedCount < steps.length && (
        <div className="solver-actions-bar">
          <button type="button" className="btn-reveal-next-step" onClick={handleRevealNext}>
            {copy('展開下一步推導', 'Reveal the next derivation')} (Step {revealedCount + 1}) →
          </button>
        </div>
      )}

      {revealedCount >= steps.length && steps.length > 0 && (
        <div className="derivation-complete-banner">
          <span>✨</span>
          <div>
            <strong>{copy('完整推導鏈已解鎖！', 'Complete derivation unlocked!')}</strong>
            <small>{copy('右側幾何畫布已同步更新對應的特徵切線與臨界點坐標。', 'The geometric canvas now reflects the corresponding tangent and critical-point coordinates.')}</small>
          </div>
        </div>
      )}
    </div>
  )
}
