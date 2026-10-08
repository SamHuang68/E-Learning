import type { UiLocale } from '../../i18n/locale'
import type {
  ChemistryGradeInfo,
  ChemistryQuestion,
  ChemistryUnit,
} from '../data/curriculum'
import type { ChemistryMockExam } from '../data/mockExams'
import type { ChemistrySolvingSignal } from '../data/solvingSignals'
import { CHEMISTRY_GRADE_EN, CHEMISTRY_UNIT_EN } from './curriculumCopy'
import { CHEMISTRY_MOCK_EN, CHEMISTRY_MOCK_QUESTION_EN } from './mockCopy'
import { CHEMISTRY_QUESTION_EN_G10 } from './questionCopyG10'
import { CHEMISTRY_QUESTION_EN_G11 } from './questionCopyG11'
import { CHEMISTRY_QUESTION_EN_G12 } from './questionCopyG12'
import { CHEMISTRY_QUESTION_EN_JUNIOR } from './questionCopyJunior'
import { CHEMISTRY_SIGNAL_EN } from './signalCopy'
import type { ChemistryQuestionCopy } from './types'

const CHEMISTRY_QUESTION_EN: Record<string, ChemistryQuestionCopy> = {
  ...CHEMISTRY_QUESTION_EN_JUNIOR,
  ...CHEMISTRY_QUESTION_EN_G10,
  ...CHEMISTRY_QUESTION_EN_G11,
  ...CHEMISTRY_QUESTION_EN_G12,
}

function missing(kind: string, id: string): never {
  throw new Error(`Missing English chemistry ${kind} copy: ${id}`)
}

function checkQuestionShape(source: ChemistryQuestion, copy: ChemistryQuestionCopy): void {
  if ((source.options?.length ?? 0) !== (copy.options?.length ?? 0)) {
    throw new Error(`Chemistry option-count mismatch: ${source.id}`)
  }
}

export function localizeChemistryQuestion(
  question: ChemistryQuestion,
  locale: UiLocale,
): ChemistryQuestion {
  if (locale !== 'en') return question
  const copy =
    CHEMISTRY_QUESTION_EN[question.id] ??
    CHEMISTRY_MOCK_QUESTION_EN[question.id] ??
    missing('question', question.id)
  checkQuestionShape(question, copy)
  return { ...question, ...copy }
}

export function localizeChemistryUnit(unit: ChemistryUnit, locale: UiLocale): ChemistryUnit {
  if (locale !== 'en') return unit
  const copy = CHEMISTRY_UNIT_EN[unit.key] ?? missing('unit', unit.key)
  if (copy.concepts.length !== unit.concepts.length) {
    throw new Error(`Chemistry concept-count mismatch: ${unit.key}`)
  }
  const gradeId = unit.key.split('_')[0]
  const gradeCopy = CHEMISTRY_GRADE_EN[gradeId] ?? missing('grade for unit', unit.key)
  return {
    ...unit,
    ...copy,
    band: gradeCopy.band,
    targetExam: gradeCopy.targetExam,
    questions: unit.questions.map((question) => localizeChemistryQuestion(question, locale)),
  }
}

export function localizeChemistryGrade(
  grade: ChemistryGradeInfo,
  locale: UiLocale,
): ChemistryGradeInfo {
  if (locale !== 'en') return grade
  const copy = CHEMISTRY_GRADE_EN[grade.id] ?? missing('grade', grade.id)
  return {
    ...grade,
    name: grade.nameEn,
    band: copy.band,
    description: copy.description,
    targetExam: copy.targetExam,
    units: grade.units.map((unit) => localizeChemistryUnit(unit, locale)),
    labs: grade.labs.map((lab) => ({
      ...lab,
      ...(copy.labs[lab.id] ?? missing('lab', lab.id)),
    })),
  }
}

export function localizeChemistryMockExam(
  exam: ChemistryMockExam,
  locale: UiLocale,
): ChemistryMockExam {
  if (locale !== 'en') return exam
  const copy = CHEMISTRY_MOCK_EN[exam.id] ?? missing('mock exam', exam.id)
  return {
    ...exam,
    ...copy,
    questions: exam.questions.map((question) => localizeChemistryQuestion(question, locale)),
  }
}

export function localizeChemistrySignal(
  signal: ChemistrySolvingSignal,
  locale: UiLocale,
): ChemistrySolvingSignal {
  if (locale !== 'en') return signal
  const copy = CHEMISTRY_SIGNAL_EN[signal.id] ?? missing('signal', signal.id)
  return { ...signal, ...copy }
}

export const CHEMISTRY_ENGLISH_COVERAGE = {
  grades: CHEMISTRY_GRADE_EN,
  units: CHEMISTRY_UNIT_EN,
  questions: CHEMISTRY_QUESTION_EN,
  mockExams: CHEMISTRY_MOCK_EN,
  mockQuestions: CHEMISTRY_MOCK_QUESTION_EN,
  signals: CHEMISTRY_SIGNAL_EN,
} as const
