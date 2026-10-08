import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CS_CURRICULUM } from '../data/curriculum'
import { CS_MOCK_EXAMS } from '../data/mockExams'
import { CS_SOLVING_SIGNALS } from '../data/solvingSignals'
import { PROGRESS_STORAGE_KEYS } from '../../utils/progressKeys'
import { CS_LAB_ID } from '../csLabRegistry'
import {
  DEFAULT_CS_PROGRESS,
  loadCsProgress,
  loadCsSignalsMastery,
  saveCsProgress,
  saveCsSignalsMastery,
} from './csStorage'
import {
  CS_CURRICULUM_QUESTION_IDS,
  CS_EXAM_IDS,
  CS_MOCK_QUESTION_IDS,
  CS_SIGNAL_MASTERY_IDS,
} from './csProgressSchema'

function createStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear() {
      values.clear()
    },
    getItem(key) {
      return values.get(key) ?? null
    },
    key(index) {
      return [...values.keys()][index] ?? null
    },
    removeItem(key) {
      values.delete(key)
    },
    setItem(key, value) {
      values.set(key, value)
    },
  }
}

describe('CS storage payload normalization', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps the lightweight canonical ID contract aligned with the lazy CS data modules', () => {
    expect(CS_CURRICULUM_QUESTION_IDS).toEqual(
      CS_CURRICULUM.flatMap((unit) => unit.questions.map((question) => question.id)),
    )
    expect(CS_MOCK_QUESTION_IDS).toEqual(
      Object.values(CS_MOCK_EXAMS).flatMap((exam) => exam.questions.map((question) => question.id)),
    )
    expect(CS_EXAM_IDS).toEqual(Object.values(CS_MOCK_EXAMS).map((exam) => exam.id))
    expect(CS_SIGNAL_MASTERY_IDS).toEqual(CS_SOLVING_SIGNALS.map((signal) => signal.id))
  })

  it('keeps shared progress normalization independent from lazy CS content modules', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/cs/utils/csProgressSchema.ts'),
      'utf8',
    )

    expect(source).not.toMatch(/from ['"]\.\.\/data\/(?:curriculum|mockExams|solvingSignals)['"]/)
  })

  it('keeps every lab completion writer on a neutral shared lab-ID registry', () => {
    const schemaSource = readFileSync(
      join(process.cwd(), 'src/cs/utils/csProgressSchema.ts'),
      'utf8',
    )
    const appSource = readFileSync(join(process.cwd(), 'src/cs/CsApp.tsx'), 'utf8')
    const topNavSource = readFileSync(
      join(process.cwd(), 'src/cs/components/CsTopNav.tsx'),
      'utf8',
    )
    const labKeys = Object.keys(CS_LAB_ID).sort()
    const completionKeys = [...appSource.matchAll(/handleLabCompleted\(CS_LAB_ID\.([A-Z_]+)\)/g)]
      .map((match) => match[1])
      .sort()
    const navigationKeys = [...topNavSource.matchAll(/id: CS_LAB_ID\.([A-Z_]+)/g)]
      .map((match) => match[1])
      .sort()

    expect(schemaSource).toContain("from '../csLabRegistry'")
    expect(appSource).toContain("from './csLabRegistry'")
    expect(appSource).not.toMatch(/handleLabCompleted\(['"]/)
    expect(completionKeys).toEqual(labKeys)
    expect(navigationKeys).toEqual(labKeys)
  })

  it('restores only canonical progress IDs and bounded numeric values', () => {
    const questionId = CS_CURRICULUM[0].questions[0].id
    const examQuestionId = CS_MOCK_EXAMS.midterm.questions[0].id
    localStorage.setItem(PROGRESS_STORAGE_KEYS.cs, JSON.stringify({
      completedQuestions: [questionId, questionId, examQuestionId, 'retired-question', 7],
      errorQuestions: [examQuestionId, 'retired-question', examQuestionId],
      xp: -25,
      examScores: {
        [CS_MOCK_EXAMS.midterm.id]: 125,
        [CS_MOCK_EXAMS.final.id]: -10,
        'retired-exam': 90,
      },
      labCompleted: ['von-neumann', 'retired-lab', 'von-neumann'],
      lastActiveDate: 'not-a-date',
    }))

    expect(loadCsProgress()).toEqual({
      completedQuestions: [questionId],
      errorQuestions: [examQuestionId],
      xp: 0,
      examScores: {
        [CS_MOCK_EXAMS.midterm.id]: 100,
        [CS_MOCK_EXAMS.final.id]: 0,
      },
      labCompleted: ['von-neumann'],
      lastActiveDate: DEFAULT_CS_PROGRESS.lastActiveDate,
    })
  })

  it('normalizes progress before persisting and dispatching it', () => {
    const questionId = CS_CURRICULUM[0].questions[0].id
    const dispatchEvent = vi.fn()
    vi.stubGlobal('window', { dispatchEvent })

    saveCsProgress({
      completedQuestions: [questionId, questionId, 'retired-question'],
      errorQuestions: [],
      xp: Number.POSITIVE_INFINITY,
      examScores: { [CS_MOCK_EXAMS.midterm.id]: 85, 'retired-exam': 99 },
      labCompleted: ['arch-map', 'retired-lab'],
      lastActiveDate: '2026-10-08',
    })

    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEYS.cs) ?? '{}')
    expect(stored).toEqual({
      completedQuestions: [questionId],
      errorQuestions: [],
      xp: 0,
      examScores: { [CS_MOCK_EXAMS.midterm.id]: 85 },
      labCompleted: ['arch-map'],
      lastActiveDate: '2026-10-08',
    })
    expect(dispatchEvent.mock.calls[0]?.[0].detail).toEqual(stored)
  })

  it('restores and persists only canonical boolean signal mastery entries', () => {
    const firstId = CS_SOLVING_SIGNALS[0].id
    const secondId = CS_SOLVING_SIGNALS[1].id
    localStorage.setItem(PROGRESS_STORAGE_KEYS.csSignals, JSON.stringify({
      [firstId]: true,
      [secondId]: false,
      'retired-signal': true,
      [CS_SOLVING_SIGNALS[2].id]: 'false',
    }))

    expect(loadCsSignalsMastery()).toEqual({
      [firstId]: true,
      [secondId]: false,
    })

    saveCsSignalsMastery({
      [firstId]: true,
      'retired-signal': true,
    })
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEYS.csSignals) ?? '{}')).toEqual({
      [firstId]: true,
    })
  })
})
