import React, { useState, useEffect } from 'react'
import type { LangId } from '../utils/storage'
import { CsSidebar, type CsNavSection } from './components/CsSidebar'
import { CsToday } from './components/CsToday'
import { CsPractice } from './components/CsPractice'
import { CsSignalsView } from './components/CsSignalsView'
import { CsMockExam } from './components/CsMockExam'
import { CsErrorVault } from './components/CsErrorVault'
import { VonNeumannArchitectureLab } from './labs/VonNeumannArchitectureLab'
import { PipelineHazardLab } from './labs/PipelineHazardLab'
import { CacheMappingLab } from './labs/CacheMappingLab'
import { AiMatrixTransformerLab } from './labs/AiMatrixTransformerLab'
import { loadCsProgress, saveCsProgress, type CsProgress } from './utils/csStorage'

interface Props {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const CsApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
  const [activeSection, setActiveSection] = useState<CsNavSection>('today')
  const [progress, setProgress] = useState<CsProgress>(() => loadCsProgress())

  useEffect(() => {
    const refresh = () => setProgress(loadCsProgress())
    window.addEventListener('e-learning:progress-hydrated', refresh)
    window.addEventListener('cs:progress-updated', refresh)
    return () => {
      window.removeEventListener('e-learning:progress-hydrated', refresh)
      window.removeEventListener('cs:progress-updated', refresh)
    }
  }, [])

  function handleEarnXp(amount: number) {
    const next: CsProgress = {
      ...progress,
      xp: (progress.xp || 0) + amount,
    }
    setProgress(next)
    saveCsProgress(next)
  }

  function handleCompleteQuestion(questionId: string, earnedXp: number) {
    const isNew = !progress.completedQuestions.includes(questionId)
    const nextCompleted = isNew
      ? [...progress.completedQuestions, questionId]
      : progress.completedQuestions
    const nextErrors = progress.errorQuestions.filter((id) => id !== questionId)

    const next: CsProgress = {
      ...progress,
      completedQuestions: nextCompleted,
      errorQuestions: nextErrors,
      xp: progress.xp + (isNew ? earnedXp : 0),
    }
    setProgress(next)
    saveCsProgress(next)
  }

  function handleRecordError(questionId: string) {
    if (!progress.errorQuestions.includes(questionId)) {
      const next: CsProgress = {
        ...progress,
        errorQuestions: [...progress.errorQuestions, questionId],
      }
      setProgress(next)
      saveCsProgress(next)
    }
  }

  function handleRemoveError(questionId: string) {
    const next: CsProgress = {
      ...progress,
      errorQuestions: progress.errorQuestions.filter((id) => id !== questionId),
    }
    setProgress(next)
    saveCsProgress(next)
  }

  function handleRecordExamScore(examId: string, score: number, wrongIds: string[]) {
    const uniqueErrors = Array.from(new Set([...progress.errorQuestions, ...wrongIds]))
    const next: CsProgress = {
      ...progress,
      examScores: {
        ...progress.examScores,
        [examId]: Math.max(progress.examScores[examId] || 0, score),
      },
      errorQuestions: uniqueErrors,
    }
    setProgress(next)
    saveCsProgress(next)
  }

  function handleLabCompleted(labId: string) {
    if (!progress.labCompleted.includes(labId)) {
      const next: CsProgress = {
        ...progress,
        labCompleted: [...progress.labCompleted, labId],
        xp: progress.xp + 15,
      }
      setProgress(next)
      saveCsProgress(next)
    }
  }

  return (
    <div className="app-shell math-shell cs-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 側邊欄 */}
      <CsSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
        xp={progress.xp}
        errorCount={progress.errorQuestions.length}
      />

      {/* 核心內容區 (滾動封裝) */}
      <main className="content" style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '1.2rem', minWidth: 0 }}>
        {activeSection === 'today' && (
          <CsToday
            progress={progress}
            onNavigate={(section) => setActiveSection(section)}
          />
        )}

        {activeSection === 'practice' && (
          <CsPractice
            completedQuestions={progress.completedQuestions}
            onCompleteQuestion={handleCompleteQuestion}
            onRecordError={handleRecordError}
          />
        )}

        {activeSection === 'signals' && <CsSignalsView />}

        {activeSection === 'von-neumann' && (
          <VonNeumannArchitectureLab
            onEarnXp={(amount) => {
              handleEarnXp(amount)
              handleLabCompleted('von-neumann')
            }}
          />
        )}

        {activeSection === 'pipeline-hazard' && (
          <PipelineHazardLab
            onEarnXp={(amount) => {
              handleEarnXp(amount)
              handleLabCompleted('pipeline-hazard')
            }}
          />
        )}

        {activeSection === 'cache-mapping' && (
          <CacheMappingLab
            onEarnXp={(amount) => {
              handleEarnXp(amount)
              handleLabCompleted('cache-mapping')
            }}
          />
        )}

        {activeSection === 'ai-transformer' && (
          <AiMatrixTransformerLab
            onEarnXp={(amount) => {
              handleEarnXp(amount)
              handleLabCompleted('ai-transformer')
            }}
          />
        )}

        {activeSection === 'mock' && (
          <CsMockExam
            onRecordExamScore={handleRecordExamScore}
            onEarnXp={handleEarnXp}
          />
        )}

        {activeSection === 'errors' && (
          <CsErrorVault
            errorQuestionIds={progress.errorQuestions}
            onRemoveError={handleRemoveError}
          />
        )}
      </main>
    </div>
  )
}
