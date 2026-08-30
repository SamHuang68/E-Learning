import React, { useState, useEffect, useMemo } from 'react'
import type { MathGradeId } from './data/curriculum'
import { ALL_MATH_GRADES, getGradeInfo, getGradeUnit } from './data/gradeStore'
import {
  loadMathProgress,
  saveMathProgress,
  type MathProgressState,
} from './utils/mathStorage'
import { MathSidebar, type MathNavId } from './components/MathSidebar'
import { MathToday } from './components/MathToday'
import { MathPractice } from './components/MathPractice'
import { MathMockExam } from './components/MathMockExam'
import { MathErrorVault } from './components/MathErrorVault'
import { MathVisualHub } from './components/MathVisualHub'

// 實驗室教具
import { BlocksLab } from './labs/BlocksLab'
import { MultiplicationLab } from './labs/MultiplicationLab'
import { FractionLab } from './labs/FractionLab'
import { CoordinateLab } from './labs/CoordinateLab'
import { PythagorasLab } from './labs/PythagorasLab'
import { UnitCircleLab } from './labs/UnitCircleLab'
import { CalculusLab } from './labs/CalculusLab'

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: 'ja' | 'en') => void
}

/**
 * 臺灣數學 108 課綱主應用程式外殼 (MathApp)
 * 涵蓋國小 1~6 年級、國中 7~9 年級、高中 10~12 年級完整架構。
 */
export const MathApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
  const [progress, setProgress] = useState<MathProgressState>(() => loadMathProgress())
  const [activeNav, setActiveNav] = useState<MathNavId>('today')
  const [activeLabId, setActiveLabId] = useState<string | null>(null)

  // 監聽進度更新事件
  useEffect(() => {
    const onUpdated = () => setProgress(loadMathProgress())
    window.addEventListener('math:progress-updated', onUpdated)
    return () => window.removeEventListener('math:progress-updated', onUpdated)
  }, [])

  const gradeInfo = useMemo(() => getGradeInfo(progress.gradeId), [progress.gradeId])
  const currentUnit = useMemo(
    () => getGradeUnit(progress.gradeId, progress.unitId),
    [progress.gradeId, progress.unitId],
  )

  function handleSelectGrade(gradeId: MathGradeId) {
    const next: MathProgressState = {
      ...progress,
      gradeId,
      unitId: 1,
    }
    saveMathProgress(next)
    setProgress(next)
    setActiveNav('today')
    setActiveLabId(null)
  }

  function handleSelectUnit(unitId: number) {
    const next: MathProgressState = {
      ...progress,
      unitId,
    }
    saveMathProgress(next)
    setProgress(next)
  }

  function handleOpenLab(labId: string) {
    setActiveLabId(labId)
    setActiveNav('labs')
  }

  function handleAwardXp(amount: number) {
    const next = {
      ...progress,
      xp: progress.xp + amount,
    }
    saveMathProgress(next)
    setProgress(next)
  }

  function renderLabContent() {
    switch (activeLabId) {
      case 'blocks':
        return <BlocksLab onXp={handleAwardXp} />
      case 'multiplication':
        return <MultiplicationLab onXp={handleAwardXp} />
      case 'fraction':
        return <FractionLab onXp={handleAwardXp} />
      case 'coordinate':
        return <CoordinateLab />
      case 'pythagoras':
        return <PythagorasLab />
      case 'unitcircle':
        return <UnitCircleLab />
      case 'calculus':
        return <CalculusLab />
      default:
        // 預設依學段展示適合的教具
        if (gradeInfo.stage === 'elementary') {
          return <FractionLab onXp={handleAwardXp} />
        } else if (gradeInfo.stage === 'junior') {
          return <CoordinateLab />
        } else {
          return <UnitCircleLab />
        }
    }
  }

  function renderMainContent() {
    if (activeNav === 'practice') {
      return (
        <MathPractice
          unit={currentUnit}
          onBack={() => setActiveNav('today')}
          onComplete={() => setActiveNav('today')}
        />
      )
    }

    if (activeNav === 'mock') {
      return <MathMockExam onExit={() => setActiveNav('today')} />
    }

    if (activeNav === 'vault') {
      return <MathErrorVault onBack={() => setActiveNav('today')} />
    }

    if (activeNav === 'labs') {
      return (
        <div className="labs-container-wrapper">
          <div className="labs-sub-bar">
            <button
              type="button"
              className="btn-back"
              onClick={() => {
                setActiveNav('today')
                setActiveLabId(null)
              }}
            >
              ← 返回課程
            </button>
            <div className="lab-switcher-pills">
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'blocks' ? 'active' : ''}`}
                onClick={() => setActiveLabId('blocks')}
              >
                十進位積木
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'multiplication' ? 'active' : ''}`}
                onClick={() => setActiveLabId('multiplication')}
              >
                九九乘法
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'fraction' ? 'active' : ''}`}
                onClick={() => setActiveLabId('fraction')}
              >
                分數圓盤
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'coordinate' ? 'active' : ''}`}
                onClick={() => setActiveLabId('coordinate')}
              >
                坐標與函數
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'pythagoras' ? 'active' : ''}`}
                onClick={() => setActiveLabId('pythagoras')}
              >
                畢氏定理
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'unitcircle' ? 'active' : ''}`}
                onClick={() => setActiveLabId('unitcircle')}
              >
                三角單位圓
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLabId === 'calculus' ? 'active' : ''}`}
                onClick={() => setActiveLabId('calculus')}
              >
                微積分
              </button>
            </div>
          </div>
          {renderLabContent()}
        </div>
      )
    }

    if (activeNav === 'visual') {
      return <MathVisualHub onBack={() => setActiveNav('today')} />
    }

    return (
      <MathToday
        gradeInfo={gradeInfo}
        currentUnit={currentUnit}
        progress={progress}
        onSelectUnit={handleSelectUnit}
        onStartPractice={() => setActiveNav('practice')}
        onOpenLab={handleOpenLab}
        onOpenMock={() => setActiveNav('mock')}
        onOpenVault={() => setActiveNav('vault')}
        onOpenVisual={() => setActiveNav('visual')}
      />
    )
  }

  return (
    <main className="app-shell math-shell">
      <MathSidebar
        activeNav={activeNav}
        onNav={setActiveNav}
        currentGradeId={progress.gradeId}
        onSelectGrade={handleSelectGrade}
        progress={progress}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <section className="content math-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              臺灣 108 課綱 · {gradeInfo.band} · {gradeInfo.nameEn}
            </p>
            <h1>{gradeInfo.name}</h1>
          </div>

          <div className="header-actions">
            {/* 年級下拉選單 */}
            <label className="unit-select">
              <span>選擇年級</span>
              <select
                value={progress.gradeId}
                onChange={(e) => handleSelectGrade(e.target.value as MathGradeId)}
              >
                {Object.values(ALL_MATH_GRADES).map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.band})
                  </option>
                ))}
              </select>
            </label>

            {/* 單元下拉選單 */}
            <label className="unit-select">
              <span>單元</span>
              <select
                value={progress.unitId}
                onChange={(e) => handleSelectUnit(Number(e.target.value))}
              >
                {gradeInfo.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    單元 {u.id} · {u.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="xp">
              <span>★</span>
              <strong>{progress.xp} XP</strong>
            </div>
          </div>
        </header>

        {renderMainContent()}

        <footer className="math-footer">
          <span>臺灣 K-12 數學學習平台 · 涵蓋國小 1~6 年級、國中三年、高中三年完整課綱</span>
          <span>進度儲存於本機 · 支援離線學習</span>
        </footer>
      </section>
    </main>
  )
}
export default MathApp
