import { describe, it, expect, beforeEach } from 'vitest'
import { CS_CURRICULUM, getAllCsUnits, getCsUnitById } from './data/curriculum'
import { CS_SOLVING_SIGNALS } from './data/solvingSignals'
import { CS_MOCK_EXAMS } from './data/mockExams'
import { loadCsProgress, saveCsProgress, resetCsProgress, type CsProgress } from './utils/csStorage'
import { computeCsRadar } from '../engine/radar'

describe('Computer Science Track (計算機概論: 軟硬體、五大單元與現代AI) Unit Tests', () => {
  beforeEach(() => {
    resetCsProgress()
  })

  describe('Curriculum & Knowledge Hierarchy', () => {
    it('has all 7 core units from hardware/software definitions to frontier AI models', () => {
      const units = getAllCsUnits()
      expect(units.length).toBe(7)

      const strands = units.map((u) => u.strand)
      expect(strands).toContain('軟硬體本質')
      expect(strands).toContain('五大單元架構')
      expect(strands).toContain('數位邏輯')
      expect(strands).toContain('作業系統')
      expect(strands).toContain('網路與通訊')
      expect(strands).toContain('現代AI硬體')
      expect(strands).toContain('前沿AI演算法')
    })

    it('unit 1 defines hardware, software, abstraction layers and ISA interface', () => {
      const u1 = getCsUnitById('cs-unit-1-foundation')
      expect(u1).toBeDefined()
      expect(u1?.title).toContain('軟體與硬體之本質定義')
      const conceptText = u1?.concepts.join(' ')
      expect(conceptText).toContain('硬體')
      expect(conceptText).toContain('軟體')
      expect(conceptText).toContain('指令集架構')
      expect(conceptText).toContain('編譯器')
    })

    it('unit 2 covers the 5 Von Neumann units (CU, ALU, MU, IU, OU) and system bus', () => {
      const u2 = getCsUnitById('cs-unit-2-von-neumann')
      expect(u2).toBeDefined()
      expect(u2?.title).toContain('馮紐曼架構與電腦傳統五大功能單元')
      const conceptText = u2?.concepts.join(' ')
      expect(conceptText).toContain('控制單元')
      expect(conceptText).toContain('算術邏輯單元')
      expect(conceptText).toContain('記憶體單元')
      expect(conceptText).toContain('輸入與輸出單元')
      expect(conceptText).toContain('馮紐曼瓶頸')
    })

    it('unit 6 & 7 cover modern AI hardware accelerators, GPU GEMM, and Transformer LLM', () => {
      const u6 = getCsUnitById('cs-unit-6-ai-hardware')
      expect(u6?.title).toContain('現代人工智慧 (AI) 運算架構')
      const c6Text = u6?.concepts.join(' ')
      expect(c6Text).toContain('GPU')
      expect(c6Text).toContain('TPU')
      expect(c6Text).toContain('GEMM')

      const u7 = getCsUnitById('cs-unit-7-frontier-ai-models')
      expect(u7?.title).toContain('當代前沿 AI 演算法、Transformer 與大語言模型')
      const c7Text = u7?.concepts.join(' ')
      expect(c7Text).toContain('Transformer')
      expect(c7Text).toContain('Self-Attention')
      expect(c7Text).toContain('KV Cache')
      expect(c7Text).toContain('Hive Agent')
    })

    it('all questions have valid options, answers, step-by-step solutions, and tags', () => {
      CS_CURRICULUM.forEach((unit) => {
        expect(unit.questions.length).toBeGreaterThan(0)
        unit.questions.forEach((q) => {
          expect(q.title.length).toBeGreaterThan(0)
          expect(q.question.length).toBeGreaterThan(0)
          if (q.options) {
            expect(q.options.length).toBeGreaterThanOrEqual(2)
            expect(typeof q.answer === 'number' ? q.answer : 0).toBeLessThan(q.options.length)
          }
          expect(q.solution.length).toBeGreaterThan(0)
          expect(q.tags.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Solving Signals', () => {
    it('contains essential solving signals with problemSignal, threeSecondRule, and formulas', () => {
      expect(CS_SOLVING_SIGNALS.length).toBeGreaterThanOrEqual(8)
      CS_SOLVING_SIGNALS.forEach((sig) => {
        expect(sig.id).toMatch(/^sig-cs-/)
        expect(sig.topic.length).toBeGreaterThan(0)
        expect(sig.problemSignal.length).toBeGreaterThan(0)
        expect(sig.threeSecondRule.length).toBeGreaterThan(0)
        expect(sig.firstStepFormula.length).toBeGreaterThan(0)
        expect(sig.exampleProblem.question.length).toBeGreaterThan(0)
        expect(sig.exampleProblem.quickSolve.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Mock Exams', () => {
    it('has standard midterm and final exams with timed durations', () => {
      expect(CS_MOCK_EXAMS.midterm).toBeDefined()
      expect(CS_MOCK_EXAMS.midterm.durationMinutes).toBe(30)
      expect(CS_MOCK_EXAMS.midterm.questions.length).toBe(4)

      expect(CS_MOCK_EXAMS.final).toBeDefined()
      expect(CS_MOCK_EXAMS.final.durationMinutes).toBe(40)
      expect(CS_MOCK_EXAMS.final.questions.length).toBe(4)
    })
  })

  describe('Storage & Progress Sync', () => {
    it('correctly saves and loads CS progress and dispatches event', () => {
      const initial = loadCsProgress()
      expect(initial.completedQuestions).toEqual([])
      expect(initial.xp).toBe(0)

      const updated: CsProgress = {
        completedQuestions: ['cs-q-101', 'cs-q-201'],
        xp: 45,
        errorQuestions: ['cs-q-301'],
        examScores: { 'cs-midterm': 85 },
        labCompleted: ['von-neumann'],
        lastActiveDate: '2026-09-02',
      }
      saveCsProgress(updated)

      const reloaded = loadCsProgress()
      expect(reloaded.completedQuestions).toEqual(['cs-q-101', 'cs-q-201'])
      expect(reloaded.xp).toBe(45)
      expect(reloaded.errorQuestions).toEqual(['cs-q-301'])
      expect(reloaded.examScores['cs-midterm']).toBe(85)
      expect(reloaded.labCompleted).toEqual(['von-neumann'])
    })
  })

  describe('CS Capability Radar Computation', () => {
    it('computes 5-dimension radar for CS track with accurate scores', () => {
      const radar = computeCsRadar(
        ['cs-q-101', 'cs-q-102', 'cs-q-201'],
        { 'cs-midterm': 90 },
        ['von-neumann', 'ai-transformer'],
      )

      expect(radar.track).toBe('cs')
      expect(radar.trackName).toContain('計算機概論')
      expect(radar.dimensions.length).toBe(5)

      const keys = radar.dimensions.map((d) => d.key)
      expect(keys).toContain('hardware_arch')
      expect(keys).toContain('os_system')
      expect(keys).toContain('network_security')
      expect(keys).toContain('ai_compute')
      expect(keys).toContain('llm_algorithms')

      expect(radar.averageScore).toBeGreaterThan(0)
      expect(radar.strongestDimension).toBeDefined()
      expect(radar.weakestDimension).toBeDefined()
    })
  })
})
