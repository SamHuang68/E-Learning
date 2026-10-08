import { CS_LAB_IDS } from '../csLabRegistry'

export interface CsProgress {
  completedQuestions: string[]
  xp: number
  errorQuestions: string[]
  examScores: Record<string, number>
  labCompleted: string[]
  lastActiveDate: string
}

export const CS_CURRICULUM_QUESTION_IDS = Array.from(
  { length: 7 },
  (_, unitIndex) => Array.from(
    { length: 16 },
    (_, questionIndex) => `cs-q-${unitIndex + 1}${String(questionIndex + 1).padStart(2, '0')}`,
  ),
).flat()

export const CS_MOCK_QUESTION_IDS = [
  'cs-mock-m1',
  'cs-mock-m2',
  'cs-mock-m3',
  'cs-mock-m4',
  'cs-mock-f1',
  'cs-mock-f2',
  'cs-mock-f3',
  'cs-mock-f4',
] as const

export const CS_EXAM_IDS = ['cs-midterm', 'cs-final'] as const

export const CS_SIGNAL_MASTERY_IDS = [
  'sig-cs-two-complement',
  'sig-cs-amat-cache',
  'sig-cs-bus-address-space',
  'sig-cs-deadlock-conditions',
  'sig-cs-tcp-handshake',
  'sig-cs-gpu-matrix-gemm',
  'sig-cs-self-attention',
  'sig-cs-kv-cache',
  'sig-cs-pipeline-speedup',
  'sig-cs-cache-tag-index',
  'sig-cs-tpu-systolic',
  'sig-cs-quantization-int4',
  'sig-cs-tlb-emat',
  'sig-cs-moe-routing',
  'sig-cs-raft-quorum',
  'sig-cs-csma-cd-minframe',
  'sig-cs-lora-reduction',
  'sig-cs-shunting-yard',
  'sig-cs-ieee754-bias',
  'sig-cs-vit-patches',
  'sig-cs-speculative-speedup',
  'sig-cs-mux-select',
  'sig-cs-bplus-height',
  'sig-cs-roofline-knee',
  'sig-cs-tp-allreduce',
  'sig-cs-kvcache-mem',
  'sig-cs-moe-balance-loss',
  'sig-cs-pagedattention-blocks',
  'sig-cs-pp-bubble-rate',
  'sig-cs-rsa-euler-inv',
  'sig-cs-zero3-comm-ratio',
  'sig-cs-hbm-interposer',
  'sig-cs-lsm-waf',
  'sig-cs-dpo-closed-form',
  'sig-cs-consistent-hashing',
  'sig-cs-cordic-shifts',
  'sig-cs-saga-pattern',
  'sig-cs-epoll-redblack',
  'sig-cs-vector-clock-causality',
  'sig-cs-speculative-decoding',
  'sig-cs-multipaxos-fastpath',
  'sig-cs-moe-capacity-factor',
  'sig-cs-percolator-primary-anchor',
  'sig-cs-rope-ntk-scaling',
] as const

const curriculumQuestionIds = new Set(CS_CURRICULUM_QUESTION_IDS)
const errorQuestionIds = new Set([
  ...CS_CURRICULUM_QUESTION_IDS,
  ...CS_MOCK_QUESTION_IDS,
])
const examIds = new Set<string>(CS_EXAM_IDS)
const labIds = new Set<string>(CS_LAB_IDS)
const signalIds = new Set<string>(CS_SIGNAL_MASTERY_IDS)

export const DEFAULT_CS_PROGRESS: CsProgress = {
  completedQuestions: [],
  xp: 0,
  errorQuestions: [],
  examScores: {},
  labCompleted: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function canonicalIds(value: unknown, allowedIds: ReadonlySet<string>): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter(
    (id): id is string => typeof id === 'string' && allowedIds.has(id),
  ))]
}

function boundedInteger(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.round(value)))
}

function validDateOrDefault(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return DEFAULT_CS_PROGRESS.lastActiveDate
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    ? value
    : DEFAULT_CS_PROGRESS.lastActiveDate
}

export function normalizeCsProgress(value: unknown): CsProgress {
  const progress = isRecord(value) ? value : {}
  const examScores = isRecord(progress.examScores) ? progress.examScores : {}
  const normalizedExamScores: Record<string, number> = {}

  for (const examId of examIds) {
    if (Object.hasOwn(examScores, examId) && typeof examScores[examId] === 'number') {
      normalizedExamScores[examId] = boundedInteger(examScores[examId], 0, 100)
    }
  }

  return {
    completedQuestions: canonicalIds(progress.completedQuestions, curriculumQuestionIds),
    xp: boundedInteger(progress.xp, 0, Number.MAX_SAFE_INTEGER),
    errorQuestions: canonicalIds(progress.errorQuestions, errorQuestionIds),
    examScores: normalizedExamScores,
    labCompleted: canonicalIds(progress.labCompleted, labIds),
    lastActiveDate: validDateOrDefault(progress.lastActiveDate),
  }
}

export function normalizeCsSignalsMastery(value: unknown): Record<string, boolean> {
  if (!isRecord(value)) return {}

  const normalized: Record<string, boolean> = {}
  for (const signalId of signalIds) {
    if (typeof value[signalId] === 'boolean') {
      normalized[signalId] = value[signalId]
    }
  }
  return normalized
}
