import React, { useState, useEffect } from 'react'
import {
  type ChemistryGradeId,
  getChemistryGradeInfo,
} from './data/curriculum'
import {
  loadChemistryProgress,
  recordChemistryAnswer,
  recordChemistryMockScore,
  recordChemistryLabCompletion,
} from './utils/chemistryStorage'
import { ChemistrySidebar, type ChemistryNavId } from './components/ChemistrySidebar'
import { ChemistryToday } from './components/ChemistryToday'
import { ChemistryPractice } from './components/ChemistryPractice'
import { ChemistryMockExam } from './components/ChemistryMockExam'
import { ChemistryErrorVault } from './components/ChemistryErrorVault'
import { ChemistrySignalsView } from './components/ChemistrySignalsView'
import { PeriodicTableLab } from './labs/PeriodicTableLab'
import { VseprGeometryLab } from './labs/VseprGeometryLab'
import { TitrationLab } from './labs/TitrationLab'
import { GasLawLab } from './labs/GasLawLab'
import { SolubilityLab } from './labs/SolubilityLab'
import { Breadcrumbs } from '../components/Breadcrumbs'
import type { LangId } from '../utils/storage'

type Props = {
  onBackHub?: () => void
  onSwitchLang?: (lang: LangId) => void
}

export const ChemistryApp: React.FC<Props> = () => {
  const [currentGradeId, setCurrentGradeId] = useState<ChemistryGradeId>('g10')
  const [currentUnitId, setCurrentUnitId] = useState<number>(1)
  const [activeNav, setActiveNav] = useState<ChemistryNavId>('today')
  const [activeLabId, setActiveLabId] = useState<string | null>(null)
  const [progress, setProgress] = useState(loadChemistryProgress())

  useEffect(() => {
    setProgress(loadChemistryProgress())
  }, [currentGradeId, activeNav])

  const gradeInfo = getChemistryGradeInfo(currentGradeId)
  const currentUnit = gradeInfo.units.find((u) => u.id === currentUnitId) || gradeInfo.units[0]

  function handleSelectGrade(gid: ChemistryGradeId) {
    setCurrentGradeId(gid)
    setCurrentUnitId(1)
    setActiveNav('today')
  }

  function handleSelectUnit(uId: number) {
    setCurrentUnitId(uId)
    setActiveNav('practice')
  }

  function handleAnswerCorrect(qId: string, pts: number) {
    const updated = recordChemistryAnswer(qId, true, pts)
    setProgress(updated)
  }

  function handleAnswerWrong(qId: string) {
    const updated = recordChemistryAnswer(qId, false, 0)
    setProgress(updated)
  }

  function handleRemoveError(qId: string) {
    const updated = recordChemistryAnswer(qId, true, 0)
    setProgress(updated)
  }

  function handleSaveExamScore(examId: string, score: number) {
    const updated = recordChemistryMockScore(examId, score)
    setProgress(updated)
  }

  function handleOpenLab(labId: string) {
    setActiveLabId(labId)
    setActiveNav('labs')
    const updated = recordChemistryLabCompletion(labId)
    setProgress(updated)
  }

  const breadcrumbItems = [
    { label: '🧪 臺灣化學 108課綱', onClick: () => setActiveNav('today') },
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
      ? [{ label: '化學互動實驗室' }]
      : []),
  ]

  const labKey = activeLabId || 'periodic'

  return (
    <div className="app-shell math-shell chemistry-shell">
      <ChemistrySidebar
        activeNav={activeNav}
        onNav={setActiveNav}
        currentGradeId={currentGradeId}
        onSelectGrade={handleSelectGrade}
        progress={progress}
      />

      <main className="content math-content chemistry-content">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="topbar">
          <div>
            <p className="eyebrow" style={{ color: '#059669' }}>
              CHEMISTRY · {gradeInfo.band} · {gradeInfo.nameEn}
            </p>
            <h1>{gradeInfo.name}</h1>
          </div>

          <div className="header-actions">
            <label className="unit-select">
              <span>切換年級</span>
              <select
                value={currentGradeId}
                onChange={(e) => handleSelectGrade(e.target.value as ChemistryGradeId)}
              >
                <option value="g7">國中七年級 (G7 溶液結晶)</option>
                <option value="g8">國中八年級 (G8 原子酸鹼鹽)</option>
                <option value="g9">國中九年級 (G9 電解質有機)</option>
                <option value="g10">高中十年級 (G10 必修化學)</option>
                <option value="g11">高中十一年級 (G11 選修狀態平衡)</option>
                <option value="g12">高中十二年級 (G12 選修酸鹼有機)</option>
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

            <div className="xp" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderColor: '#6ee7b7', color: '#065f46' }}>
              <span>🧪</span>
              <strong>{progress.xp} XP</strong>
            </div>
          </div>
        </header>

        {activeNav === 'today' && (
          <ChemistryToday
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
          <ChemistryPractice
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
          <ChemistryMockExam
            onSaveScore={handleSaveExamScore}
            onNavigateVault={() => setActiveNav('vault')}
          />
        )}

        {activeNav === 'vault' && (
          <ChemistryErrorVault
            errorQuestionIds={progress.errorQuestions}
            onRemoveError={handleRemoveError}
            onOpenLab={handleOpenLab}
          />
        )}

        {activeNav === 'signals' && <ChemistrySignalsView />}

        {activeNav === 'labs' && (
          <div className="chemistry-labs-showcase" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="mock-nav-tabs">
              <button
                type="button"
                className={`mock-tab ${labKey.includes('periodic') ? 'active' : ''}`}
                onClick={() => setActiveLabId('periodic')}
              >
                🔬 元素週期表探測器
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('vsepr') || labKey.includes('geometry') ? 'active' : ''}`}
                onClick={() => setActiveLabId('vsepr')}
              >
                📐 VSEPR 分子空間幾何
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('titration') || labKey.includes('acid') ? 'active' : ''}`}
                onClick={() => setActiveLabId('titration')}
              >
                🧪 酸鹼滴定與 pH 曲線
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('gas') ? 'active' : ''}`}
                onClick={() => setActiveLabId('gas')}
              >
                🎈 理想氣體定律 PV=nRT
              </button>
              <button
                type="button"
                className={`mock-tab ${labKey.includes('solubility') || labKey.includes('solution') ? 'active' : ''}`}
                onClick={() => setActiveLabId('solubility')}
              >
                🧊 溶解度與結晶析出
              </button>
            </div>

            {labKey.includes('periodic') && <PeriodicTableLab />}
            {(labKey.includes('vsepr') || labKey.includes('geometry')) && <VseprGeometryLab />}
            {(labKey.includes('titration') || labKey.includes('acid')) && <TitrationLab />}
            {labKey.includes('gas') && <GasLawLab />}
            {(labKey.includes('solubility') || labKey.includes('solution')) && <SolubilityLab />}
          </div>
        )}
      </main>
    </div>
  )
}
