import React, { useState, useEffect } from 'react'
import {
  type PhysicsGradeId,
  PHYSICS_GRADES,
  getPhysicsGradeInfo,
  getPhysicsUnit,
} from './data/curriculum'
import {
  loadPhysicsProgress,
  recordPhysicsAnswer,
  recordPhysicsMockScore,
  recordPhysicsLabCompletion,
  savePhysicsProgress,
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
import { useI18n } from '../i18n/i18n'

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const PhysicsApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
  const { t, locale } = useI18n()
  const [currentGradeId, setCurrentGradeId] = useState<PhysicsGradeId>(() => {
    const stored = loadPhysicsProgress()
    if (!stored.completedQuestions.length && !stored.xp) return 'g7'
    return PHYSICS_GRADES[stored.gradeId] ? stored.gradeId : 'g7'
  })
  const [currentUnitId, setCurrentUnitId] = useState<number>(() => {
    const stored = loadPhysicsProgress()
    const gradeId = !stored.completedQuestions.length && !stored.xp ? 'g7' : stored.gradeId
    return getPhysicsUnit(gradeId, stored.unitId)?.id ?? 1
  })
  const [activeNav, setActiveNav] = useState<PhysicsNavId>('today')
  const [activeLabId, setActiveLabId] = useState<string | null>(null)
  const [progress, setProgress] = useState(loadPhysicsProgress())

  useEffect(() => {
    const refresh = () => {
      const stored = loadPhysicsProgress()
      const gradeId =
        !stored.completedQuestions.length && !stored.xp
          ? 'g7'
          : PHYSICS_GRADES[stored.gradeId]
            ? stored.gradeId
            : 'g7'
      const unitId = getPhysicsUnit(gradeId, stored.unitId)?.id ?? 1
      setProgress(stored)
      setCurrentGradeId(gradeId)
      setCurrentUnitId(unitId)
    }
    window.addEventListener('e-learning:progress-hydrated', refresh)
    return () => window.removeEventListener('e-learning:progress-hydrated', refresh)
  }, [])

  const gradeInfo = getPhysicsGradeInfo(currentGradeId)
  const currentUnit = getPhysicsUnit(currentGradeId, currentUnitId) || gradeInfo.units[0]

  function persistSelection(gid: PhysicsGradeId, requestedUnitId: number) {
    const info = getPhysicsGradeInfo(gid)
    const unitId = getPhysicsUnit(gid, requestedUnitId)?.id ?? info.units[0].id
    const updated = { ...progress, stage: info.stage, gradeId: gid, unitId }
    savePhysicsProgress(updated)
    setProgress(updated)
    setCurrentGradeId(gid)
    setCurrentUnitId(unitId)
  }

  function handleSelectGrade(gid: PhysicsGradeId) {
    persistSelection(gid, 1)
    setActiveNav('today')
  }

  function handleSelectUnit(uId: number) {
    persistSelection(currentGradeId, uId)
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
    { label: t('physics.brand'), onClick: () => setActiveNav('today') },
    { label: locale === 'en' ? gradeInfo.nameEn : gradeInfo.name, onClick: () => setActiveNav('today') },
    ...(activeNav === 'practice'
      ? [{ label: t('chrome.unitNColon', { n: currentUnit.id, title: currentUnit.title }) }]
      : activeNav === 'mock'
      ? [{ label: t('chrome.mockCap') }]
      : activeNav === 'vault'
      ? [{ label: t('chrome.vault') }]
      : activeNav === 'signals'
      ? [{ label: t('nav.signals3s') }]
      : activeNav === 'labs'
      ? [{ label: t('chrome.physicsLabs') }]
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
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <main className="content math-content physics-content">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="topbar">
          <div>
            <p className="eyebrow" style={{ color: '#0369a1' }}>
              PHYSICS · {gradeInfo.band} · {gradeInfo.nameEn}
            </p>
            <h1>{locale === 'en' ? gradeInfo.nameEn : gradeInfo.name}</h1>
          </div>

          <div className="header-actions">
            <label className="unit-select" htmlFor="physics-grade-select">
              <span>{t('chrome.switchGrade')}</span>
              <select
                id="physics-grade-select"
                value={currentGradeId}
                onChange={(e) => handleSelectGrade(e.target.value as PhysicsGradeId)}
              >
                {(Object.keys(PHYSICS_GRADES) as PhysicsGradeId[]).map((gid) => {
                  const info = PHYSICS_GRADES[gid]
                  return (
                    <option key={gid} value={gid}>
                      {locale === 'en' ? info.nameEn : info.name}
                    </option>
                  )
                })}
              </select>
            </label>

            <label className="unit-select" htmlFor="physics-unit-select">
              <span>{t('chrome.switchUnit')}</span>
              <select
                id="physics-unit-select"
                value={currentUnitId}
                onChange={(e) => persistSelection(currentGradeId, Number(e.target.value))}
              >
                {gradeInfo.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {t('chrome.unitNColon', { n: u.id, title: u.title })}
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
                persistSelection(currentGradeId, currentUnitId + 1)
              } else {
                setActiveNav('today')
              }
            }}
          />
        )}

        {activeNav === 'mock' && (
          <PhysicsMockExam
            onSaveScore={handleSaveExamScore}
            onNavigateVault={() => setActiveNav('vault')}
          />
        )}

        {activeNav === 'vault' && (
          <PhysicsErrorVault
            errorQuestionIds={progress.errorQuestions}
            onRemoveError={handleRemoveError}
            onOpenLab={handleOpenLab}
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
