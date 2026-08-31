import React, { useState, useEffect } from 'react'
import {
  type PhysicsGradeId,
  getPhysicsGradeInfo,
  getPhysicsUnit,
} from './data/curriculum'
import {
  loadPhysicsProgress,
  recordPhysicsAnswer,
  recordPhysicsMockScore,
  recordPhysicsLabCompletion,
} from './utils/physicsStorage'
import { PhysicsSidebar, type PhysicsNavId } from './components/PhysicsSidebar'
import { PhysicsToday } from './components/PhysicsToday'
import { PhysicsPractice } from './components/PhysicsPractice'
import { PhysicsMockExam } from './components/PhysicsMockExam'
import { PhysicsErrorVault } from './components/PhysicsErrorVault'
import { PhysicsSignalsView } from './components/PhysicsSignalsView'
import { ProjectileLab } from './labs/ProjectileLab'
import { ShmLab } from './labs/ShmLab'
import { OpticsLab } from './labs/OpticsLab'
import { CircuitLab } from './labs/CircuitLab'
import { BuoyancyLab } from './labs/BuoyancyLab'
import { Breadcrumbs } from '../components/Breadcrumbs'
import type { LangId } from '../utils/storage'

type Props = {
  onBackHub?: () => void
  onSwitchLang?: (lang: LangId) => void
}

export const PhysicsApp: React.FC<Props> = () => {
  const [currentGradeId, setCurrentGradeId] = useState<PhysicsGradeId>('g10')
  const [currentUnitId, setCurrentUnitId] = useState<number>(1)
  const [activeNav, setActiveNav] = useState<PhysicsNavId>('today')
  const [activeLabId, setActiveLabId] = useState<string | null>(null)
  const [progress, setProgress] = useState(loadPhysicsProgress())

  useEffect(() => {
    setProgress(loadPhysicsProgress())
  }, [currentGradeId, activeNav])

  const gradeInfo = getPhysicsGradeInfo(currentGradeId)
  const currentUnit = getPhysicsUnit(currentGradeId, currentUnitId) || gradeInfo.units[0]

  function handleSelectGrade(gid: PhysicsGradeId) {
    setCurrentGradeId(gid)
    setCurrentUnitId(1)
    setActiveNav('today')
  }

  function handleSelectUnit(uId: number) {
    setCurrentUnitId(uId)
    setActiveNav('practice')
  }

  function handleAnswerCorrect(qId: string, pts: number) {
    const updated = recordPhysicsAnswer(qId, true, pts)
    setProgress(updated)
  }

  function handleAnswerWrong(qId: string) {
    const updated = recordPhysicsAnswer(qId, false, 0)
    setProgress(updated)
  }

  function handleRemoveError(qId: string) {
    const updated = recordPhysicsAnswer(qId, true, 0)
    setProgress(updated)
  }

  function handleSaveExamScore(examId: string, score: number) {
    const updated = recordPhysicsMockScore(examId, score)
    setProgress(updated)
  }

  function handleOpenLab(labId: string) {
    setActiveLabId(labId)
    setActiveNav('labs')
    const updated = recordPhysicsLabCompletion(labId)
    setProgress(updated)
  }

  const breadcrumbItems = [
    { label: '⚛️ 臺灣物理 108課綱', onClick: () => setActiveNav('today') },
    { label: gradeInfo.name, onClick: () => setActiveNav('today') },
    ...(activeNav === 'practice'
      ? [{ label: `單元 ${currentUnit.id}：${currentUnit.title}` }]
      : activeNav === 'mock'
      ? [{ label: '會考/學測/分科模擬測驗' }]
      : activeNav === 'vault'
      ? [{ label: '錯題筆記本' }]
      : activeNav === 'signals'
      ? [{ label: '3秒破題訊號卡' }]
      : activeNav === 'labs'
      ? [{ label: '物理互動實驗室' }]
      : []),
  ]

  const labKey = activeLabId || 'projectile'

  return (
    <div className="app-shell math-shell physics-shell">
      <PhysicsSidebar
        activeNav={activeNav}
        onNav={setActiveNav}
        currentGradeId={currentGradeId}
        onSelectGrade={handleSelectGrade}
        progress={progress}
      />

      <main className="content math-content physics-content">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="topbar">
          <div>
            <p className="eyebrow" style={{ color: '#0369a1' }}>
              PHYSICS · {gradeInfo.band} · {gradeInfo.nameEn}
            </p>
            <h1>{gradeInfo.name}</h1>
          </div>

          <div className="header-actions">
            <label className="unit-select">
              <span>切換年級</span>
              <select
                value={currentGradeId}
                onChange={(e) => handleSelectGrade(e.target.value as PhysicsGradeId)}
              >
                <option value="g7">國中七年級 (G7 基礎測量)</option>
                <option value="g8">國中八年級 (G8 波動光學浮力)</option>
                <option value="g9">國中九年級 (G9 運動牛頓電磁)</option>
                <option value="g10">高中十年級 (G10 必修物理)</option>
                <option value="g11">高中十一年級 (G11 選修力學波動)</option>
                <option value="g12">高中十二年級 (G12 選修電磁近代)</option>
              </select>
            </label>

            <label className="unit-select">
              <span>切換單元</span>
              <select
                value={currentUnitId}
                onChange={(e) => setCurrentUnitId(Number(e.target.value))}
              >
                {gradeInfo.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    單元 {u.id}：{u.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="xp" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', borderColor: '#7dd3fc', color: '#0369a1' }}>
              <span>⚛️</span>
              <strong>{progress.xp} XP</strong>
            </div>
          </div>
        </header>

        {activeNav === 'today' && (
          <PhysicsToday
            gradeInfo={gradeInfo}
            currentUnit={currentUnit}
            progress={progress}
            onSelectUnit={handleSelectUnit}
            onStartPractice={() => setActiveNav('practice')}
            onOpenLab={handleOpenLab}
            onOpenMock={() => setActiveNav('mock')}
            onOpenVault={() => setActiveNav('vault')}
            onOpenSignals={() => setActiveNav('signals')}
          />
        )}

        {activeNav === 'practice' && (
          <PhysicsPractice
            unit={currentUnit}
            completedQuestions={progress.completedQuestions}
            errorQuestions={progress.errorQuestions}
            onAnswerCorrect={handleAnswerCorrect}
            onAnswerWrong={handleAnswerWrong}
            onNextUnit={() => {
              if (currentUnitId < gradeInfo.units.length) {
                setCurrentUnitId(currentUnitId + 1)
              } else {
                setActiveNav('today')
              }
            }}
          />
        )}

        {activeNav === 'mock' && (
          <PhysicsMockExam onSaveScore={handleSaveExamScore} />
        )}

        {activeNav === 'vault' && (
          <PhysicsErrorVault
            errorQuestionIds={progress.errorQuestions}
            onRemoveError={handleRemoveError}
          />
        )}

        {activeNav === 'signals' && <PhysicsSignalsView />}

        {activeNav === 'labs' && (
          <div className="physics-labs-showcase" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="mock-nav-tabs">
              <button
                type="button"
                className={`mock-tab ${labKey.includes('projectile') ? 'active' : ''}`}
                onClick={() => setActiveLabId('projectile')}
              >
                🚀 斜向拋體運動
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('shm') || labKey.includes('energy') ? 'active' : ''}`}
                onClick={() => setActiveLabId('shm')}
              >
                ⏱️ 簡諧運動與單擺
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('optics') || labKey.includes('lens') ? 'active' : ''}`}
                onClick={() => setActiveLabId('optics')}
              >
                🌈 司乃耳折射與全反射
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('circuit') || labKey.includes('kirchhoff') ? 'active' : ''}`}
                onClick={() => setActiveLabId('circuit')}
              >
                ⚡ 直流電路歐姆定律
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('buoyancy') || labKey.includes('density') || labKey.includes('measurement') ? 'active' : ''}`}
                onClick={() => setActiveLabId('buoyancy')}
              >
                ⛵ 阿基米德浮力與密度
              </button>
            </div>

            {labKey.includes('projectile') && <ProjectileLab />}
            {(labKey.includes('shm') || labKey.includes('energy')) && <ShmLab />}
            {(labKey.includes('optics') || labKey.includes('lens')) && <OpticsLab />}
            {(labKey.includes('circuit') || labKey.includes('kirchhoff')) && <CircuitLab />}
            {(labKey.includes('buoyancy') || labKey.includes('density') || labKey.includes('measurement')) && <BuoyancyLab />}
          </div>
        )}
      </main>
    </div>
  )
}
