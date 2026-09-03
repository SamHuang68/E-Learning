import React, { useState, useEffect, Suspense } from 'react'
import type { LangId } from '../utils/storage'
import { CsTopNav, type CsNavSection } from './components/CsTopNav'
import { CsHierarchyTree } from './components/CsHierarchyTree'
import { CsToday } from './components/CsToday'
import { loadCsProgress, saveCsProgress, type CsProgress } from './utils/csStorage'

const CsPractice = React.lazy(() =>
  import('./components/CsPractice').then((m) => ({ default: m.CsPractice }))
)
const CsSignalsView = React.lazy(() =>
  import('./components/CsSignalsView').then((m) => ({ default: m.CsSignalsView }))
)
const CsMockExam = React.lazy(() =>
  import('./components/CsMockExam').then((m) => ({ default: m.CsMockExam }))
)
const CsErrorVault = React.lazy(() =>
  import('./components/CsErrorVault').then((m) => ({ default: m.CsErrorVault }))
)
const CsTextbookReader = React.lazy(() =>
  import('./components/CsTextbookReader').then((m) => ({ default: m.CsTextbookReader }))
)
const VonNeumannArchitectureLab = React.lazy(() =>
  import('./labs/VonNeumannArchitectureLab').then((m) => ({ default: m.VonNeumannArchitectureLab }))
)
const PipelineHazardLab = React.lazy(() =>
  import('./labs/PipelineHazardLab').then((m) => ({ default: m.PipelineHazardLab }))
)
const CacheMappingLab = React.lazy(() =>
  import('./labs/CacheMappingLab').then((m) => ({ default: m.CacheMappingLab }))
)
const AiMatrixTransformerLab = React.lazy(() =>
  import('./labs/AiMatrixTransformerLab').then((m) => ({ default: m.AiMatrixTransformerLab }))
)
const ArchifyHardwareMap = React.lazy(() =>
  import('./labs/ArchifyHardwareMap').then((m) => ({ default: m.ArchifyHardwareMap }))
)

interface Props {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const CsApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
  const [activeSection, setActiveSection] = useState<CsNavSection>('hierarchy')
  const [practiceUnitId, setPracticeUnitId] = useState<string | undefined>(undefined)
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
    <div
      className="app-shell cs-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#090d16',
        color: '#f8fafc',
      }}
    >
      {/* 頂部水平功能列 (取代側邊欄，一頁盡覽所有功能) */}
      <CsTopNav
        activeSection={activeSection}
        onSelectSection={(section) => {
          setPracticeUnitId(undefined)
          setActiveSection(section)
        }}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
        xp={progress.xp}
        errorCount={progress.errorQuestions.length}
        completedCount={progress.completedQuestions.length}
        totalQuestions={112}
      />

      {/* 核心主視窗 (零拉頁，單屏適配) */}
      <main
        className="content cs-main-viewport"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '0.85rem 1.25rem',
          width: '100%',
        }}
      >
        <Suspense
          fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: '#94a3b8', fontSize: '0.86rem' }}>
              載入計算機科學模組…
            </div>
          }
        >
          {activeSection === 'hierarchy' && (
          <CsHierarchyTree
            completedQuestions={progress.completedQuestions}
            onNavigate={(section, unitId) => {
              if (unitId) setPracticeUnitId(unitId)
              setActiveSection(section)
            }}
          />
        )}

        {activeSection === 'textbook' && (
          <CsTextbookReader
            onSelectSection={(sec) => setActiveSection(sec as CsNavSection)}
            onEarnXp={handleEarnXp}
          />
        )}

        {activeSection === 'today' && (
          <CsToday
            progress={progress}
            onNavigate={(section) => {
              setPracticeUnitId(undefined)
              setActiveSection(section as CsNavSection)
            }}
          />
        )}

        {activeSection === 'practice' && (
          <CsPractice
            initialUnitId={practiceUnitId}
            completedQuestions={progress.completedQuestions}
            onCompleteQuestion={handleCompleteQuestion}
            onRecordError={handleRecordError}
          />
        )}

        {activeSection === 'signals' && <CsSignalsView />}

        {activeSection === 'arch-map' && (
          <ArchifyHardwareMap
            onEarnXp={(amount) => {
              handleEarnXp(amount)
              handleLabCompleted('arch-map')
            }}
          />
        )}

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
        </Suspense>
      </main>
    </div>
  )
}
