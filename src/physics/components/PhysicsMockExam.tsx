import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { PHYSICS_MOCK_EXAMS, type PhysicsMockExam as PhysicsMockExamType } from '../data/mockExams'
import { type PhysicsStrand, type PhysicsQuestion } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'
import {
  loadPhysicsProgress,
  savePhysicsProgress,
  type PhysicsProgressState,
} from '../utils/physicsStorage'

type Props = {
  onSaveScore: (examId: string, score: number) => void
  onNavigateVault?: () => void
}

/** 物理五大領域中文對照、圖標與診斷建議 */
const STRAND_CONFIG: Record<
  PhysicsStrand,
  { name: string; icon: string; advice: string }
> = {
  mechanics: {
    name: '力學與運動學',
    icon: '🚀',
    advice: '加強受力分析自由體圖 (FBD)、牛頓運動定律、動能定理與動量守恆綜合運算。',
  },
  thermodynamics: {
    name: '熱學與熱力學',
    icon: '🔥',
    advice: '複習熱平衡公式 H=msΔT、絕熱系統熱交換、比熱測定與相變化潛熱。',
  },
  waves_optics: {
    name: '波動與光學',
    icon: '🌈',
    advice: '熟記透鏡成像公式 1/p+1/q=1/f、司乃耳折射定律與雙狹縫干涉/單狹縫繞射條件。',
  },
  electromagnetism: {
    name: '電磁學與電路',
    icon: '⚡',
    advice: '掌握歐姆定律串並聯電路分析、法拉第與冷次定律感應方向及帶電粒子磁場迴旋運動。',
  },
  modern: {
    name: '近代物理與量子',
    icon: '⚛️',
    advice: '熟練光電方程式 Ek=hν-W、德布羅意物質波長與四大基本交互作用尺度比較。',
  },
}

/**
 * 判斷學生作答是否正確 (支援單選 choice、多選 multi-choice 與填充 fill)
 */
function checkIsQuestionCorrect(
  question: PhysicsQuestion,
  userAnswer: any,
): boolean {
  if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
    return false
  }

  // 多選題判定
  if (question.type === 'multi-choice' || Array.isArray(question.answer)) {
    const targetArr: string[] = (
      Array.isArray(question.answer) ? question.answer : [question.answer]
    )
      .map((item) => {
        if (typeof item === 'number') return String.fromCharCode(65 + item)
        return String(item).trim().toUpperCase()
      })
      .sort()

    const userArr: string[] = (
      Array.isArray(userAnswer) ? userAnswer : [userAnswer]
    )
      .map((item) => {
        if (typeof item === 'number') return String.fromCharCode(65 + item)
        return String(item).trim().toUpperCase()
      })
      .sort()

    if (targetArr.length !== userArr.length) return false
    return targetArr.every((val, idx) => val === userArr[idx])
  }

  // 填充題判定
  if (question.type === 'fill') {
    const userStr = String(userAnswer).trim()
    const targetStr = String(question.answer).trim()
    const parsedUser = parseFloat(userStr)
    const parsedTarget = parseFloat(targetStr)
    if (!isNaN(parsedUser) && !isNaN(parsedTarget)) {
      return Math.abs(parsedUser - parsedTarget) < 0.05
    }
    return userStr.toLowerCase() === targetStr.toLowerCase()
  }

  // 單選題判定 (數字 index vs 字母 'A'/'B'/'C'/'D')
  if (typeof question.answer === 'number') {
    if (typeof userAnswer === 'number') return userAnswer === question.answer
    if (typeof userAnswer === 'string') {
      const letterIdx = userAnswer.trim().toUpperCase().charCodeAt(0) - 65
      return (
        userAnswer.trim() === String(question.answer) ||
        letterIdx === question.answer
      )
    }
  }

  if (typeof question.answer === 'string') {
    const targetTrimmed = question.answer.trim().toUpperCase()
    if (typeof userAnswer === 'number') {
      const userLetter = String.fromCharCode(65 + userAnswer)
      return (
        targetTrimmed === userLetter || targetTrimmed === String(userAnswer)
      )
    }
    if (typeof userAnswer === 'string') {
      return targetTrimmed === userAnswer.trim().toUpperCase()
    }
  }

  return false
}

/**
 * 格式化時間 (秒數轉 MM:SS 或 HH:MM:SS)
 */
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * 臺灣 108 課綱物理全真模擬考試系統 (PhysicsMockExam)
 */
export const PhysicsMockExam: React.FC<Props> = ({
  onSaveScore,
  onNavigateVault,
}) => {
  const exams = Object.values(PHYSICS_MOCK_EXAMS)
  const [selectedExamId, setSelectedExamId] = useState<string>(
    exams[0]?.id || 'cap',
  )
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0)
  const [autoSubmittedNotice, setAutoSubmittedNotice] = useState<boolean>(false)
  const [syncedErrorCount, setSyncedErrorCount] = useState<number>(0)

  const exam: PhysicsMockExamType =
    exams.find((e) => e.id === selectedExamId) || exams[0]
  const initialSeconds = (exam.timeMinutes || 45) * 60
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds)

  const timerRef = useRef<number | null>(null)

  // 切換試卷時重置狀態與計時器
  useEffect(() => {
    setAnswers({})
    setIsSubmitted(false)
    setIsPaused(false)
    setAutoSubmittedNotice(false)
    setSyncedErrorCount(0)
    setTimeSpentSeconds(0)
    setTimeLeft((exam.timeMinutes || 45) * 60)
  }, [selectedExamId, exam.timeMinutes])

  // 滾動跳轉至指定題目卡片
  function scrollToQuestion(qId: string) {
    const el = document.getElementById(`physics-q-${qId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // 交卷並計算成績，同時將錯題自動收入 LocalStorage 的 errorQuestions
  const handleCalculateScore = useCallback(
    (forceSubmit = false) => {
      if (isSubmitted && !forceSubmit) return

      let correctCount = 0
      const wrongIds: string[] = []
      const totalQuestions = exam.questions.length

      exam.questions.forEach((q) => {
        const isCorrect = checkIsQuestionCorrect(q, answers[q.id])
        if (isCorrect) {
          correctCount++
        } else {
          wrongIds.push(q.id)
        }
      })

      const percentage = Math.round(
        (correctCount / Math.max(1, totalQuestions)) * 100,
      )
      const finalScore = Math.min(100, percentage)

      // 自動同步寫入 LocalStorage 的 errorQuestions 錯題本
      try {
        const currentProg: PhysicsProgressState = loadPhysicsProgress()
        const errorSet = new Set(currentProg.errorQuestions)
        const completedSet = new Set(currentProg.completedQuestions)

        exam.questions.forEach((q) => {
          const isOk = checkIsQuestionCorrect(q, answers[q.id])
          if (isOk) {
            completedSet.add(q.id)
          } else {
            errorSet.add(q.id)
          }
        })

        const updatedProgress: PhysicsProgressState = {
          ...currentProg,
          errorQuestions: Array.from(errorSet),
          completedQuestions: Array.from(completedSet),
          examScores: {
            ...currentProg.examScores,
            [exam.id]: Math.max(currentProg.examScores[exam.id] ?? 0, finalScore),
          },
          xp: currentProg.xp + Math.round(finalScore / 2),
        }

        savePhysicsProgress(updatedProgress)
        setSyncedErrorCount(wrongIds.length)
      } catch {
        /* ignore storage err */
      }

      setIsSubmitted(true)
      setIsPaused(true)
      onSaveScore(exam.id, finalScore)
    },
    [isSubmitted, exam, answers, onSaveScore],
  )

  // 倒數計時器排程
  useEffect(() => {
    if (isSubmitted || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = window.setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1)
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setAutoSubmittedNotice(true)
          handleCalculateScore(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isSubmitted, isPaused, handleCalculateScore])

  // 單選題點選處理
  function handleSelectOpt(qId: string, optIdx: number) {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }))
  }

  // 多選題勾選切換
  function handleToggleMultiOpt(qId: string, optIdx: number) {
    if (isSubmitted) return
    const currentList: number[] = Array.isArray(answers[qId])
      ? [...answers[qId]]
      : []
    const idxInList = currentList.indexOf(optIdx)
    if (idxInList >= 0) {
      currentList.splice(idxInList, 1)
    } else {
      currentList.push(optIdx)
    }
    setAnswers((prev) => ({ ...prev, [qId]: currentList.sort() }))
  }

  // 填充題輸入處理
  function handleFillAnswer(qId: string, val: string) {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  // 計時器暫停 / 繼續
  function handleTogglePause() {
    if (isSubmitted) return
    setIsPaused((prev) => !prev)
  }

  // 計時器重置
  function handleResetTimer() {
    if (isSubmitted) return
    setTimeLeft(initialSeconds)
    setTimeSpentSeconds(0)
    setIsPaused(false)
  }

  // 診斷報告統計 (各單元/領域答對率)
  const diagnosticReport = useMemo(() => {
    if (!isSubmitted) return null

    let correctTotal = 0
    const strandMap: Record<
      string,
      { total: number; correct: number; strand: PhysicsStrand }
    > = {}

    exam.questions.forEach((q) => {
      const isCorrect = checkIsQuestionCorrect(q, answers[q.id])
      if (isCorrect) correctTotal++

      const strand = q.strand || 'mechanics'
      if (!strandMap[strand]) {
        strandMap[strand] = { total: 0, correct: 0, strand }
      }
      strandMap[strand].total += 1
      if (isCorrect) {
        strandMap[strand].correct += 1
      }
    })

    const percentage = Math.round(
      (correctTotal / Math.max(1, exam.questions.length)) * 100,
    )

    // 計算各考試類型對應級分或等級
    let gradeRating = ''
    if (exam.id === 'cap') {
      if (percentage >= 90) gradeRating = 'A++ (精熟頂級)'
      else if (percentage >= 80) gradeRating = 'A+ (精熟優等)'
      else if (percentage >= 70) gradeRating = 'A (精熟基礎)'
      else if (percentage >= 60) gradeRating = 'B++ (基礎前段)'
      else if (percentage >= 50) gradeRating = 'B+ (基礎中段)'
      else if (percentage >= 40) gradeRating = 'B (基礎後段)'
      else gradeRating = 'C (待加強)'
    } else if (exam.id === 'gsat') {
      const gsatScale = Math.min(
        15,
        Math.max(1, Math.round((percentage / 100) * 15)),
      )
      const level =
        gsatScale >= 13
          ? '頂標'
          : gsatScale >= 11
            ? '前標'
            : gsatScale >= 8
              ? '均標'
              : gsatScale >= 5
                ? '後標'
                : '底標'
      gradeRating = `${gsatScale} 級分 (${level})`
    } else {
      const astScale = Math.min(
        60,
        Math.max(1, Math.round((percentage / 100) * 60)),
      )
      const level =
        astScale >= 50
          ? '頂標'
          : astScale >= 42
            ? '前標'
            : astScale >= 30
              ? '均標'
              : astScale >= 20
                ? '後標'
                : '底標'
      gradeRating = `${astScale} 級分 (${level})`
    }

    const strandList = Object.values(strandMap).map((item) => {
      const rate = Math.round((item.correct / item.total) * 100)
      const info = STRAND_CONFIG[item.strand] || {
        name: item.strand,
        icon: '⚛️',
        advice: '持續針對觀念進行題目演練。',
      }
      return {
        strand: item.strand,
        name: info.name,
        icon: info.icon,
        advice: info.advice,
        total: item.total,
        correct: item.correct,
        rate,
      }
    })

    return {
      score: percentage,
      correctTotal,
      totalQuestions: exam.questions.length,
      gradeRating,
      strands: strandList,
    }
  }, [isSubmitted, exam, answers])

  // 已作答題數統計
  const answeredCount = useMemo(() => {
    return exam.questions.filter((q) => {
      const ans = answers[q.id]
      if (ans === undefined || ans === null || ans === '') return false
      if (Array.isArray(ans) && ans.length === 0) return false
      return true
    }).length
  }, [exam, answers])

  const isTimeUrgent = timeLeft <= 300 && !isSubmitted // 少於 5 分鐘

  return (
    <div
      className="math-mock-shell physics-mock-shell"
      style={{
        maxWidth: '920px',
        margin: '0 auto',
        padding: '0.5rem',
        boxSizing: 'border-box',
      }}
    >
      {/* 試卷切換標籤頁 */}
      <div
        className="mock-nav-tabs"
        style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginBottom: '0.75rem',
          borderBottom: '2px solid var(--line)',
          paddingBottom: '0.4rem',
        }}
      >
        {exams.map((ex) => (
          <button
            key={ex.id}
            type="button"
            className={`mock-tab ${selectedExamId === ex.id ? 'active' : ''}`}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background:
                selectedExamId === ex.id ? '#0284c7' : 'var(--surface-subtle)',
              color: selectedExamId === ex.id ? '#ffffff' : 'var(--ink)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedExamId(ex.id)}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* 試卷介紹標題與倒數計時控制列 */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 0.2rem 0',
              fontSize: '1.05rem',
              color: '#0284c7',
            }}
          >
            {exam.title} ({exam.targetExam})
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.78rem',
              color: 'var(--muted)',
              wordBreak: 'break-word',
            }}
          >
            {exam.description}
          </p>
        </div>

        {/* 倒數計時器模組 (Countdown Timer) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: isTimeUrgent ? '#fef2f2' : '#f0f9ff',
            border: `1px solid ${isTimeUrgent ? '#f87171' : '#bae6fd'}`,
            borderRadius: '999px',
            padding: '0.3rem 0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: isTimeUrgent ? '#dc2626' : '#0369a1',
            }}
          >
            ⏱️ {formatTime(timeLeft)}
          </span>

          {!isSubmitted && (
            <>
              <button
                type="button"
                onClick={handleTogglePause}
                title={isPaused ? '繼續計時' : '暫停計時'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  fontSize: '0.75rem',
                  color: '#0284c7',
                }}
              >
                {isPaused ? '▶️ 繼續' : '⏸️ 暫停'}
              </button>
              <button
                type="button"
                onClick={handleResetTimer}
                title="重設計時器"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                }}
              >
                🔄 重設
              </button>
            </>
          )}
        </div>
      </div>

      {/* 頂部題號導覽膠囊網格 (Capsule Navigation Grid) */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.6rem 0.85rem',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.4rem',
            fontSize: '0.78rem',
            color: 'var(--muted)',
          }}
        >
          <span>
            📌 題號導覽 (已答 {answeredCount} / {exam.questions.length} 題)
          </span>
          <span style={{ fontWeight: 600 }}>
            {isSubmitted
              ? '考卷已批改完成'
              : isPaused
                ? '計時暫停中'
                : '測驗進行中'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
          }}
        >
          {exam.questions.map((q, idx) => {
            const isAnswered =
              answers[q.id] !== undefined &&
              answers[q.id] !== null &&
              answers[q.id] !== '' &&
              (!Array.isArray(answers[q.id]) || answers[q.id].length > 0)
            const isCorrect =
              isSubmitted && checkIsQuestionCorrect(q, answers[q.id])

            let capsuleBg = 'var(--surface-subtle)'
            let capsuleColor = 'var(--ink)'
            let capsuleBorder = '1px solid var(--line)'

            if (isSubmitted) {
              if (isCorrect) {
                capsuleBg = '#10b981'
                capsuleColor = '#ffffff'
                capsuleBorder = '1px solid #059669'
              } else {
                capsuleBg = '#ef4444'
                capsuleColor = '#ffffff'
                capsuleBorder = '1px solid #dc2626'
              }
            } else if (isAnswered) {
              capsuleBg = '#0284c7'
              capsuleColor = '#ffffff'
              capsuleBorder = '1px solid #0284c7'
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => scrollToQuestion(q.id)}
                style={{
                  minWidth: '34px',
                  height: '30px',
                  borderRadius: '6px',
                  border: capsuleBorder,
                  background: capsuleBg,
                  color: capsuleColor,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 0.35rem',
                  transition: 'all 0.15s ease',
                  touchAction: 'manipulation',
                }}
              >
                {idx + 1}
                {isSubmitted && (isCorrect ? ' ✓' : ' ✕')}
              </button>
            )
          })}
        </div>
      </div>

      {/* 自動交卷提示橫幅 */}
      {autoSubmittedNotice && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e',
            borderRadius: '8px',
            padding: '0.6rem 0.85rem',
            marginBottom: '0.75rem',
            fontSize: '0.82rem',
          }}
        >
          ⏰ 考試時間已截止！系統已自動為您交卷並產出物理診斷成績單。
        </div>
      )}

      {/* 交卷後：成績單與各單元答對率診斷卡片 */}
      {isSubmitted && diagnosticReport && (
        <div
          style={{
            background: 'var(--surface)',
            border: '2px solid #0284c7',
            borderRadius: '14px',
            padding: '1rem 1.2rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '0.6rem',
              marginBottom: '0.8rem',
              gap: '0.5rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0284c7' }}>
                📊 {exam.title} · 全真成績報告單
              </h3>
              <p
                style={{
                  margin: '0.2rem 0 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                }}
              >
                測驗耗時：{Math.floor(timeSpentSeconds / 60)} 分{' '}
                {timeSpentSeconds % 60} 秒 ｜ 答對{' '}
                {diagnosticReport.correctTotal} /{' '}
                {diagnosticReport.totalQuestions} 題
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.3rem',
                background: '#f0f9ff',
                padding: '0.4rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #bae6fd',
              }}
            >
              <span
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#0284c7',
                  lineHeight: 1,
                }}
              >
                {diagnosticReport.score}
              </span>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#0369a1',
                  fontWeight: 700,
                }}
              >
                分
              </span>
              <span
                style={{
                  marginLeft: '0.4rem',
                  fontSize: '0.8rem',
                  background: '#0284c7',
                  color: '#fff',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                {diagnosticReport.gradeRating}
              </span>
            </div>
          </div>

          {/* 錯題自動收錄提示 */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '0.5rem 0.8rem',
              marginBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#166534',
            }}
          >
            <span>
              ✅ 已自動將 <strong>{syncedErrorCount}</strong>{' '}
              題答錯題目寫入 LocalStorage 錯題筆記本 (errorQuestions)！
            </span>
            {onNavigateVault && (
              <button
                type="button"
                onClick={onNavigateVault}
                style={{
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.25rem 0.55rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                前往錯題本 📖
              </button>
            )}
          </div>

          {/* 各主軸領域掌握度診斷 */}
          <h4
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.9rem',
              color: 'var(--ink)',
            }}
          >
            🎯 各物理主軸掌握度與備考診斷：
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.6rem',
              marginBottom: '0.8rem',
            }}
          >
            {diagnosticReport.strands.map((st) => (
              <div
                key={st.strand}
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.8rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    {st.icon} {st.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color:
                        st.rate >= 80
                          ? '#10b981'
                          : st.rate >= 50
                            ? '#0284c7'
                            : '#ef4444',
                    }}
                  >
                    {st.correct}/{st.total} 題 ({st.rate}%)
                  </span>
                </div>

                {/* 掌握度長條圖 */}
                <div
                  style={{
                    height: '6px',
                    background: 'var(--line)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '0.4rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${st.rate}%`,
                      background:
                        st.rate >= 80
                          ? '#10b981'
                          : st.rate >= 50
                            ? '#0284c7'
                            : '#ef4444',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.74rem',
                    color: 'var(--muted)',
                    lineHeight: 1.4,
                  }}
                >
                  💡 {st.advice}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false)
                setAnswers({})
                setTimeSpentSeconds(0)
                setTimeLeft((exam.timeMinutes || 45) * 60)
                setIsPaused(false)
              }}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid #0284c7',
                background: '#f0f9ff',
                color: '#0284c7',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              🔄 重新測驗此卷
            </button>
          </div>
        </div>
      )}

      {/* 題目清單列表 */}
      <div
        className="mock-questions-list"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        {exam.questions.map((q, idx) => {
          const userAns = answers[q.id]
          const isCorrect =
            isSubmitted && checkIsQuestionCorrect(q, userAns)

          return (
            <div
              key={q.id}
              id={`physics-q-${q.id}`}
              className="practice-card mock-question-item"
              style={{
                background: 'var(--surface)',
                border: isSubmitted
                  ? isCorrect
                    ? '1.5px solid #10b981'
                    : '1.5px solid #ef4444'
                  : '1px solid var(--line)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                boxSizing: 'border-box',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                minWidth: 0,
              }}
            >
              {/* 題號與領域徽章 */}
              <div
                className="question-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="q-badge"
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  第 {idx + 1} 題
                </span>
                <span
                  style={{
                    background: 'var(--surface-subtle)',
                    color: 'var(--muted)',
                    border: '1px solid var(--line)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  {STRAND_CONFIG[q.strand]?.icon}{' '}
                  {STRAND_CONFIG[q.strand]?.name || q.strand}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--muted)',
                    marginLeft: 'auto',
                  }}
                >
                  難度 {'★'.repeat(q.difficulty || 3)}
                  {'☆'.repeat(Math.max(0, 5 - (q.difficulty || 3)))}
                </span>
              </div>

              {/* 題目內文 */}
              <div
                className="question-body"
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  marginBottom: '0.75rem',
                  color: 'var(--ink)',
                }}
              >
                <MathFormula math={q.question} />
              </div>

              {/* 單選題選項 */}
              {(!q.type || q.type === 'choice') && q.options && (
                <div
                  className="options-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr)',
                    gap: '0.45rem',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAns === oIdx
                    let optBorder = '1px solid var(--line)'
                    let optBg = 'var(--surface)'
                    let optColor = 'var(--ink)'

                    if (isSelected) {
                      optBorder = '2px solid #0284c7'
                      optBg = '#f0f9ff'
                    }

                    if (isSubmitted) {
                      const isOptionTarget =
                        typeof q.answer === 'number'
                          ? q.answer === oIdx
                          : String.fromCharCode(65 + oIdx) ===
                            String(q.answer).trim().toUpperCase()

                      if (isOptionTarget) {
                        optBorder = '2px solid #10b981'
                        optBg = '#ecfdf5'
                        optColor = '#065f46'
                      } else if (isSelected) {
                        optBorder = '2px solid #ef4444'
                        optBg = '#fef2f2'
                        optColor = '#991b1b'
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        className="option-btn"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          border: optBorder,
                          background: optBg,
                          color: optColor,
                          fontSize: '0.88rem',
                          textAlign: 'left',
                          cursor: isSubmitted ? 'default' : 'pointer',
                          touchAction: 'manipulation',
                          minWidth: 0,
                          width: '100%',
                          boxSizing: 'border-box',
                          wordBreak: 'break-word',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => handleSelectOpt(q.id, oIdx)}
                      >
                        <span
                          className="opt-letter"
                          style={{
                            fontWeight: 700,
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected ? '#0284c7' : '#e2e8f0',
                            color: isSelected ? '#ffffff' : '#334155',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <div
                          className="opt-content"
                          style={{ minWidth: 0, flex: 1 }}
                        >
                          <MathFormula math={opt} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 多選題選項 */}
              {q.type === 'multi-choice' && q.options && (
                <div style={{ width: '100%' }}>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#0284c7',
                      marginBottom: '0.4rem',
                      fontWeight: 600,
                    }}
                  >
                    📌 多選題（可勾選多個正確選項）
                  </div>
                  <div
                    className="options-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr)',
                      gap: '0.45rem',
                    }}
                  >
                    {q.options.map((opt, oIdx) => {
                      const selectedList: number[] = Array.isArray(userAns)
                        ? userAns
                        : []
                      const isSelected = selectedList.includes(oIdx)

                      let optBorder = '1px solid var(--line)'
                      let optBg = 'var(--surface)'
                      let optColor = 'var(--ink)'

                      if (isSelected) {
                        optBorder = '2px solid #0284c7'
                        optBg = '#f0f9ff'
                      }

                      if (isSubmitted) {
                        const targetList = (
                          Array.isArray(q.answer) ? q.answer : [q.answer]
                        ).map((v) =>
                          typeof v === 'number'
                            ? v
                            : String(v).trim().toUpperCase().charCodeAt(0) - 65,
                        )

                        const isTarget = targetList.includes(oIdx)
                        if (isTarget) {
                          optBorder = '2px solid #10b981'
                          optBg = '#ecfdf5'
                          optColor = '#065f46'
                        } else if (isSelected) {
                          optBorder = '2px solid #ef4444'
                          optBg = '#fef2f2'
                          optColor = '#991b1b'
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          className="option-btn"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.55rem 0.85rem',
                            borderRadius: '8px',
                            border: optBorder,
                            background: optBg,
                            color: optColor,
                            fontSize: '0.88rem',
                            textAlign: 'left',
                            cursor: isSubmitted ? 'default' : 'pointer',
                            touchAction: 'manipulation',
                            minWidth: 0,
                            width: '100%',
                            boxSizing: 'border-box',
                            wordBreak: 'break-word',
                          }}
                          onClick={() => handleToggleMultiOpt(q.id, oIdx)}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              minWidth: '22px',
                              height: '22px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isSelected ? '#0284c7' : '#e2e8f0',
                              color: isSelected ? '#ffffff' : '#334155',
                              fontSize: '0.75rem',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected ? '☑' : '☐'}
                          </span>
                          <div
                            className="opt-content"
                            style={{ minWidth: 0, flex: 1 }}
                          >
                            <MathFormula math={opt} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 填充題輸入 */}
              {q.type === 'fill' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--muted)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    請填入數值或精確答案：
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitted}
                    placeholder="請輸入答案 (例如: 12.5)"
                    value={userAns ?? ''}
                    onChange={(e) => handleFillAnswer(q.id, e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1.5px solid var(--line)',
                      background: isSubmitted
                        ? 'var(--surface-subtle)'
                        : 'var(--surface)',
                      fontSize: '0.9rem',
                      color: 'var(--ink)',
                      boxSizing: 'border-box',
                    }}
                  />
                  {isSubmitted && (
                    <div
                      style={{
                        marginTop: '0.35rem',
                        fontSize: '0.8rem',
                        color: isCorrect ? '#10b981' : '#ef4444',
                      }}
                    >
                      標準答案：<strong>{String(q.answer)}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* 交卷後詳細解析卡片 */}
              {isSubmitted && (
                <div
                  className={`solution-card ${isCorrect ? 'sol-correct' : 'sol-wrong'}`}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '8px',
                    background: isCorrect ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: isCorrect ? '#166534' : '#991b1b',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {isCorrect ? '✓ 答對！解析推導：' : '❌ 答錯！詳細步驟解析：'}
                  </div>
                  <div className="solution-content">
                    <MathFormula math={q.solution} />
                  </div>
                  {q.competency && (
                    <div
                      style={{
                        marginTop: '0.4rem',
                        fontSize: '0.75rem',
                        color: 'var(--muted)',
                        borderTop: '1px dashed var(--line)',
                        paddingTop: '0.35rem',
                      }}
                    >
                      🎓 課綱素養對應：{q.competency}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 底部交卷按鈕區 */}
      {!isSubmitted && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--line)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            作答進度：{answeredCount} / {exam.questions.length} 題
            {answeredCount < exam.questions.length && ' (尚有未答題目)'}
          </span>

          <button
            type="button"
            className="btn-submit-answer"
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => handleCalculateScore(false)}
          >
            交卷計算成績 📊
          </button>
        </div>
      )}
    </div>
  )
}


