import { describe, it, expect } from 'vitest'
import { getAllPhysicsUnits } from '../../physics/data/curriculum'
import { PHYSICS_SOLVING_SIGNALS } from '../../physics/data/solvingSignals'
import { getAllChemistryUnits } from '../../chemistry/data/curriculum'
import { CHEMISTRY_SOLVING_SIGNALS } from '../../chemistry/data/solvingSignals'
import { getAllCsUnits } from '../../cs/data/curriculum'
import { CS_SOLVING_SIGNALS } from '../../cs/data/solvingSignals'
import { ALL_MATH_GRADES, getGradesInStage } from '../../math/data/gradeStore'
import { MATH_SOLVING_SIGNALS } from '../../math/data/solvingSignals'
import { CALCULUS_PROBLEMS } from '../../math/calculus/data/calculusProblems'
import { toeicCertificates } from '../../toeic/data/certificates'
import { JAPANESE_SIGNAL_GROUPS } from '../../aoba/data/grammarSignals'

describe('Strict Review Gate: Content Integrity & Pedagogy Quality Invariants', () => {
  describe('Physics Track Content Gate', () => {
    it('[GATE-PHYS-COUNT] has complete 30-unit coverage from G7 to G12', () => {
      const units = getAllPhysicsUnits()
      expect(units.length).toBe(30)
    })

    it('[GATE-PHYS-QUESTIONS] all units have valid questions with options/answers and solutions', () => {
      const units = getAllPhysicsUnits()
      units.forEach((unit) => {
        expect(unit.title.length, `Unit ${unit.id} title`).toBeGreaterThan(0)
        expect(unit.questions.length, `Unit ${unit.id} questions count`).toBeGreaterThan(0)
        unit.questions.forEach((q) => {
          expect(q.title.length, `Question ${q.id} title`).toBeGreaterThan(0)
          expect(q.question.length, `Question ${q.id} content`).toBeGreaterThan(0)
          if (q.options && q.options.length > 0) {
            expect(q.options.length, `Question ${q.id} options count`).toBeGreaterThanOrEqual(2)
          }
          expect(q.solution.length, `Question ${q.id} solution steps`).toBeGreaterThan(0)
          expect(q.difficulty, `Question ${q.id} difficulty`).toBeGreaterThanOrEqual(1)
        })
      })
    })

    it('[GATE-PHYS-SIGNALS] 19 solving signals have keywords, formulas, and examples', () => {
      expect(PHYSICS_SOLVING_SIGNALS.length).toBe(19)
      PHYSICS_SOLVING_SIGNALS.forEach((sig) => {
        expect(sig.problemSignal.length).toBeGreaterThan(0)
        expect(sig.threeSecondRule.length).toBeGreaterThan(0)
        expect(sig.firstStepFormula.length).toBeGreaterThan(0)
        expect(sig.exampleProblem.question.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Chemistry Track Content Gate', () => {
    it('[GATE-CHEM-COUNT] has complete 26-unit coverage from G7 to G12', () => {
      const units = getAllChemistryUnits()
      expect(units.length).toBe(26)
    })

    it('[GATE-CHEM-QUESTIONS] all units have valid questions with options, answers, and solutions', () => {
      const units = getAllChemistryUnits()
      units.forEach((unit) => {
        expect(unit.title.length, `Unit ${unit.id} title`).toBeGreaterThan(0)
        expect(unit.questions.length, `Unit ${unit.id} questions count`).toBeGreaterThan(0)
        unit.questions.forEach((q) => {
          expect(q.title.length, `Question ${q.id} title`).toBeGreaterThan(0)
          expect(q.question.length, `Question ${q.id} content`).toBeGreaterThan(0)
          if (q.options && q.options.length > 0) {
            expect(q.options.length, `Question ${q.id} options count`).toBeGreaterThanOrEqual(2)
          }
          expect(q.solution.length, `Question ${q.id} solution steps`).toBeGreaterThan(0)
          expect(q.difficulty, `Question ${q.id} difficulty`).toBeGreaterThanOrEqual(1)
        })
      })
    })

    it('[GATE-CHEM-SIGNALS] 15 solving signals have keywords, formulas, and examples', () => {
      expect(CHEMISTRY_SOLVING_SIGNALS.length).toBe(15)
      CHEMISTRY_SOLVING_SIGNALS.forEach((sig) => {
        expect(sig.problemSignal.length).toBeGreaterThan(0)
        expect(sig.threeSecondRule.length).toBeGreaterThan(0)
        expect(sig.firstStepFormula.length).toBeGreaterThan(0)
        expect(sig.exampleProblem.question.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Math Track Content Gate', () => {
    it('[GATE-MATH-CURRICULUM] covers elementary, junior, and senior stages with 12 grades', () => {
      expect(getGradesInStage('elementary').length).toBe(6)
      expect(getGradesInStage('junior').length).toBe(3)
      expect(getGradesInStage('senior').length).toBe(3)
      expect(Object.keys(ALL_MATH_GRADES).length).toBe(12)
    })

    it('[GATE-MATH-SIGNALS] math signals have triggers, formulas, and examples', () => {
      expect(MATH_SOLVING_SIGNALS.length).toBeGreaterThan(0)
      MATH_SOLVING_SIGNALS.forEach((sig) => {
        expect(sig.problemSignal.length).toBeGreaterThan(0)
        expect(sig.threeSecondRule.length).toBeGreaterThan(0)
        expect(sig.firstStepFormula.length).toBeGreaterThan(0)
        expect(sig.exampleProblem.question.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Calculus, TOEIC & Japanese Tracks Content Gate', () => {
    it('[GATE-CALCULUS-PROBLEMS] all calculus problems have derivation steps', () => {
      expect(CALCULUS_PROBLEMS.length).toBeGreaterThan(0)
      CALCULUS_PROBLEMS.forEach((prob) => {
        expect(prob.title.length).toBeGreaterThan(0)
        expect(prob.derivationSteps.length).toBeGreaterThan(0)
      })
    })

    it('[GATE-TOEIC-CERTIFICATES] 4 color certificates have units', () => {
      expect(toeicCertificates.length).toBe(4)
      toeicCertificates.forEach((cert) => {
        expect(cert.units.length).toBeGreaterThan(0)
      })
    })

    it('[GATE-AOBA-SIGNALS] has action grammar signals', () => {
      expect(JAPANESE_SIGNAL_GROUPS.length).toBeGreaterThan(0)
      const allSignals = JAPANESE_SIGNAL_GROUPS.flatMap((g) => g.signals)
      expect(allSignals.length).toBeGreaterThan(0)
    })
  })

  describe('Computer Science Track Content Gate', () => {
    it('[GATE-CS-COUNT] has complete 7-unit coverage from hardware/software to frontier AI', () => {
      const units = getAllCsUnits()
      expect(units.length).toBe(7)
    })

    it('[GATE-CS-QUESTIONS] all units have valid questions with options, answers, and solutions', () => {
      const units = getAllCsUnits()
      units.forEach((unit) => {
        expect(unit.title.length, `Unit ${unit.id} title`).toBeGreaterThan(0)
        expect(unit.questions.length, `Unit ${unit.id} questions count`).toBeGreaterThan(0)
        unit.questions.forEach((q) => {
          expect(q.title.length, `Question ${q.id} title`).toBeGreaterThan(0)
          expect(q.question.length, `Question ${q.id} content`).toBeGreaterThan(0)
          if (q.options && q.options.length > 0) {
            expect(q.options.length, `Question ${q.id} options count`).toBeGreaterThanOrEqual(2)
          }
          expect(q.solution.length, `Question ${q.id} solution steps`).toBeGreaterThan(0)
          expect(q.difficulty, `Question ${q.id} difficulty`).toBeGreaterThanOrEqual(1)
        })
      })
    })

    it('[GATE-CS-SIGNALS] solving signals have problem signals, 3-second rules, formulas, and examples', () => {
      expect(CS_SOLVING_SIGNALS.length).toBeGreaterThanOrEqual(8)
      CS_SOLVING_SIGNALS.forEach((sig) => {
        expect(sig.problemSignal.length).toBeGreaterThan(0)
        expect(sig.threeSecondRule.length).toBeGreaterThan(0)
        expect(sig.firstStepFormula.length).toBeGreaterThan(0)
        expect(sig.exampleProblem.question.length).toBeGreaterThan(0)
      })
    })
  })
})
