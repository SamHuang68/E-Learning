import type { ChemistryGradeInfo, ChemistryQuestion, ChemistryUnit } from '../data/curriculum'
import type { ChemistryMockExam } from '../data/mockExams'
import type { ChemistrySolvingSignal } from '../data/solvingSignals'

export type ChemistryQuestionCopy = Pick<
  ChemistryQuestion,
  'title' | 'question' | 'options' | 'solution' | 'hint' | 'competency' | 'tags'
>

export type ChemistryUnitCopy = Pick<
  ChemistryUnit,
  'title' | 'subtitle' | 'concepts' | 'suggestedLab'
>

export type ChemistryGradeCopy = Pick<
  ChemistryGradeInfo,
  'band' | 'description' | 'targetExam'
> & {
  labs: Record<string, { name: string; description: string }>
}

export type ChemistryMockCopy = Pick<ChemistryMockExam, 'title' | 'subtitle'>

export type ChemistrySignalCopy = Pick<
  ChemistrySolvingSignal,
  'gradeBand' | 'topic' | 'problemSignal' | 'threeSecondRule' | 'firstStepFormula' | 'exampleProblem'
>
