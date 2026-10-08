import type { CsMockExam } from '../cs/data/mockExams'
import type { CsQuestion, CsUnit } from '../cs/data/curriculum'
import type { CsSolvingSignal } from '../cs/data/solvingSignals'
import type { TextbookChapter } from '../cs/data/textbookData'
import {
  CS_EXAM_EN,
  CS_QUESTION_TITLE_EN,
  CS_SIGNAL_TOPIC_EN,
  CS_UNIT_CONCEPTS_EN,
} from './csTeachingCopyData'
import { CS_QUESTION_COPY_EN } from './csQuestionCopyRegistry'
import { CS_SIGNAL_COPY_EN } from './csSignalCopyData'
import { CS_TEXTBOOK_COPY_EN } from './csTextbookCopyData'
import type { UiLocale } from './locale'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/u

type SignalFormulaCopy = readonly [source: string, english?: string]

/**
 * Exact source/formula contract for every CS signal. Most formulas already use
 * language-neutral notation; entries with Han text provide an explicit English
 * value. A changed or newly added source formula must be reviewed here instead
 * of being silently rewritten into a generic placeholder.
 */
const CS_SIGNAL_FORMULA_EN: Readonly<Record<string, SignalFormulaCopy>> = {
  'sig-cs-two-complement': ['N_{\\text{2\'s comp}} = \\text{NOT}(N_{\\text{positive}}) + 1'],
  'sig-cs-amat-cache': ['\\text{AMAT} = T_{\\text{hit}} + (1 - H) \\times T_{\\text{penalty}}'],
  'sig-cs-bus-address-space': ['\\text{Addressable Space} = 2^k \\text{ Bytes}'],
  'sig-cs-deadlock-conditions': ['\\text{Deadlock} \\iff \\text{Mutual Exclusion} \\land \\text{Hold \\& Wait} \\land \\text{No Preemption} \\land \\text{Circular Wait}'],
  'sig-cs-tcp-handshake': ['\\text{Client: } \\text{SYN}(x) \\to \\text{Server: } \\text{SYN}(y), \\text{ACK}(x+1) \\to \\text{Client: } \\text{ACK}(y+1)'],
  'sig-cs-gpu-matrix-gemm': ['\\text{GEMM: } D = \\alpha (A \\times B) + \\beta C \\quad [\\text{SIMT Parallel Throughput}]'],
  'sig-cs-self-attention': ['\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V'],
  'sig-cs-kv-cache': ['\\text{Inference Step } t: Q_t \\times [K_{1:t-1}, K_t]^T \\to \\text{Reuse Cached } K, V'],
  'sig-cs-pipeline-speedup': ['S = \\frac{k \\cdot n}{k + n - 1} \\xrightarrow{n \\to \\infty} k'],
  'sig-cs-cache-tag-index': ['\\text{Offset} = \\log_2(B), \\quad \\text{Index} = \\log_2\\left(\\frac{C}{N \\cdot B}\\right), \\quad \\text{Tag} = 32 - \\text{Index} - \\text{Offset}'],
  'sig-cs-tpu-systolic': ['T_{\\text{systolic}} = 3N - 2 \\quad [O(N^3) \\to O(N)]'],
  'sig-cs-quantization-int4': ['\\text{VRAM (Bytes)} = \\text{Param Count} \\times \\frac{\\text{bits}}{8}'],
  'sig-cs-tlb-emat': ['\\text{EMAT} = T_{\\text{TLB}} + (2 - \\alpha) \\cdot T_{\\text{RAM}}'],
  'sig-cs-moe-routing': ['G(x) = \\text{Softmax}(\\text{TopK}(x \\cdot W_g, k))'],
  'sig-cs-raft-quorum': ['\\text{Quorum} = \\lfloor N / 2 \\rfloor + 1'],
  'sig-cs-csma-cd-minframe': ['L_{\\min} = 2\\tau \\times \\text{Bandwidth}'],
  'sig-cs-lora-reduction': ['\\text{Ratio} = \\frac{(d + k) \\cdot r}{d \\cdot k}'],
  'sig-cs-shunting-yard': ['\\text{Precedence: } ^ > *, / > +, - \\quad \\& \\quad \\text{Parentheses Match}'],
  'sig-cs-ieee754-bias': ['E = e + 127 \\quad (\\text{Single Precision } 32\\text{-bit})'],
  'sig-cs-vit-patches': ['N = \\frac{H \\times W}{P^2} \\implies \\text{Total} = N + 1'],
  'sig-cs-speculative-speedup': ['\\mathbb{E}[N] = \\frac{1 - \\alpha^{K+1}}{1 - \\alpha} = \\sum_{j=0}^K \\alpha^j'],
  'sig-cs-mux-select': ['n = \\log_2 N \\iff 2^n = N'],
  'sig-cs-bplus-height': ['h = \\lceil \\log_M N \\rceil'],
  'sig-cs-roofline-knee': ['I_{\\text{knee}} = \\frac{P_{\\text{peak}}}{\\text{Bandwidth}} \\implies I < I_{\\text{knee}} \\to \\text{Memory-Bound}'],
  'sig-cs-tp-allreduce': ['\\text{Ops} = 2 \\times \\text{All-Reduce} \\implies \\text{Bytes} = 2 \\times \\left[2 \\times \\frac{N-1}{N} M\\right]'],
  'sig-cs-kvcache-mem': ['\\text{Size} = 2 \\times b \\times s \\times L \\times h \\times 2\\text{ Bytes}'],
  'sig-cs-moe-balance-loss': ['\\mathcal{L}_{\\text{balance}} = \\alpha \\cdot E \\sum_{i=1}^E f_i P_i \\implies \\min = \\alpha'],
  'sig-cs-pagedattention-blocks': ['N_{\\text{blocks}} = \\left\\lceil \\frac{S}{B} \\right\\rceil'],
  'sig-cs-pp-bubble-rate': ['F_{\\text{bubble}} = \\frac{p - 1}{m + p - 1}'],
  'sig-cs-rsa-euler-inv': ['e \\cdot d \\equiv 1 \\pmod{(p-1)(q-1)}'],
  'sig-cs-zero3-comm-ratio': ['\\frac{\\text{Comm}_{\\text{ZeRO-3}}}{\\text{Comm}_{\\text{DP}}} = \\frac{3 \\times \\frac{N-1}{N} M}{2 \\times \\frac{N-1}{N} M} = 1.5'],
  'sig-cs-hbm-interposer': ['\\text{Bandwidth} = \\text{BusWidth} \\times \\text{DataRate} \\approx 1024\\text{ bits} \\times \\text{Rate} \\to 8\\text{ TB/s}'],
  'sig-cs-lsm-waf': ['\\text{WAF} \\approx 1 + 1 + T \\times (L - 1)'],
  'sig-cs-dpo-closed-form': ['r(x, y) = \\beta \\log \\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)} + C'],
  'sig-cs-consistent-hashing': ['\\Delta \\text{Migration} \\approx \\frac{1}{N} \\times \\text{TotalKeys}'],
  'sig-cs-cordic-shifts': ['x_{i+1} = x_i - d_i y_i 2^{-i}, \\quad y_{i+1} = y_i + d_i x_i 2^{-i}'],
  'sig-cs-saga-pattern': ['T_1 \\dots T_k (\\text{Fail}) \\implies C_{k-1} \\dots C_1'],
  'sig-cs-epoll-redblack': ['O(1) \\text{ Event-Driven Dispatch} \\quad (\\text{Ready List})'],
  'sig-cs-vector-clock-causality': [
    'V_A \\le V_B \\iff \\forall i, V_A[i] \\le V_B[i] \\quad (\\text{若互有大小即 } V_A \\parallel V_B)',
    'V_A \\le V_B \\iff \\forall i, V_A[i] \\le V_B[i] \\quad (\\text{otherwise concurrent: } V_A \\parallel V_B)',
  ],
  'sig-cs-speculative-decoding': ['E[\\tau] = \\frac{1 - \\alpha^{K+1}}{1 - \\alpha}, \\quad \\text{Speedup} = \\frac{E[\\tau] T_{\\text{target}}}{K T_{\\text{draft}} + T_{\\text{target}}}'],
  'sig-cs-multipaxos-fastpath': ['\\text{Stable Leader} \\implies \\text{Skip Phase 1} \\implies \\text{Phase 2 (Accept)} = 1\\text{ RTT}'],
  'sig-cs-moe-capacity-factor': ['\\text{Capacity} = \\left\\lceil \\frac{T}{E} \\cdot C \\right\\rceil, \\quad \\mathcal{L}_{\\text{aux}} = \\alpha E \\sum_{e=1}^E f_e P_e'],
  'sig-cs-percolator-primary-anchor': [
    '\\text{Check Primary Row} \\implies \\begin{cases} \\text{write}[commit\\_ts] \\text{ 存在} \\implies \\text{Roll Forward} \\\\ lock \\text{ 殘留或無記錄} \\implies \\text{Roll Back} \\end{cases}',
    '\\text{Check Primary Row} \\implies \\begin{cases} \\text{write}[commit\\_ts] \\text{ exists} \\implies \\text{Roll Forward} \\\\ lock \\text{ stale or absent} \\implies \\text{Roll Back} \\end{cases}',
  ],
  'sig-cs-rope-ntk-scaling': ['\\langle R_m q, R_n k \\rangle = q^T R_{n-m} k, \\quad \\text{Base}_{\\text{new}} = \\text{Base} \\cdot \\alpha^{\\frac{d}{d-2}}'],
}

const EN: Readonly<Record<string, string>> = {
  '單元 1：軟體與硬體之本質定義與電腦系統階層':
    'Unit 1: Hardware, Software, and Computer-System Layers',
  '單元 2：馮紐曼架構與電腦傳統五大功能單元':
    'Unit 2: Von Neumann Architecture and the Five Functional Units',
  '單元 3：資料表示法、二補數與數位邏輯電路':
    "Unit 3: Data Representation, Two's Complement, and Digital Logic",
  '單元 4：作業系統核心、行程排程與記憶體管理':
    'Unit 4: Operating-System Kernels, Process Scheduling, and Memory Management',
  '單元 5：電腦網路架構、TCP/IP 與網際網路通訊協定':
    'Unit 5: Computer Networks, TCP/IP, and Internet Protocols',
  '單元 6：現代人工智慧 (AI) 運算架構與加速晶片趨勢':
    'Unit 6: Modern AI Computing Architectures and Accelerator Trends',
  '單元 7：當代前沿 AI 演算法、Transformer 與大語言模型架構':
    'Unit 7: Frontier AI Algorithms, Transformers, and Large Language Models',
  基礎核心: 'Core foundations',
  系統架構: 'Systems architecture',
  前沿AI: 'Frontier AI',
}

/**
 * Localizes an exact CS curriculum label. Missing entries fail closed so a new
 * source label cannot silently cross the English display boundary.
 */
export function csTeachingCopy(locale: UiLocale, text: string): string {
  if (locale !== 'en') return text
  if (!Object.hasOwn(EN, text)) {
    throw new Error(`Missing CS teaching English translation: ${text}`)
  }
  const translated = EN[text]
  assertEnglish(translated, text)
  return translated
}

function assertEnglish(value: unknown, context: string): void {
  const visit = (entry: unknown, path: string): void => {
    if (typeof entry === 'string') {
      if (entry.trim() === '') throw new Error(`Empty CS English translation: ${path}`)
      if (HAN.test(entry)) throw new Error(`CS English translation contains Han characters: ${path}`)
      return
    }
    if (Array.isArray(entry)) {
      entry.forEach((item, index) => visit(item, `${path}[${index}]`))
      return
    }
    if (entry && typeof entry === 'object') {
      Object.entries(entry).forEach(([key, item]) => visit(item, `${path}.${key}`))
    }
  }
  visit(value, context)
}

function englishFormula(source: CsSolvingSignal): string {
  const formula = CS_SIGNAL_FORMULA_EN[source.id]
  if (!formula || formula[0] !== source.firstStepFormula) {
    throw new Error(`Missing CS solving-signal English formula: ${source.id}`)
  }
  return formula[1] ?? formula[0]
}

function localizeQuestionEnglish(source: CsQuestion): CsQuestion {
  const title = CS_QUESTION_TITLE_EN[source.id]
  const copy = CS_QUESTION_COPY_EN[source.id]
  if (!title || !copy) throw new Error(`Missing CS question English translation: ${source.id}`)
  if (copy.options.length !== source.options?.length) {
    throw new Error(`CS question option-count mismatch: ${source.id}`)
  }
  if (copy.solution.length !== source.solution.length) {
    throw new Error(`CS question solution-step mismatch: ${source.id}`)
  }
  const localized: CsQuestion = {
    ...source,
    title,
    question: copy.question,
    options: [...copy.options],
    solution: [...copy.solution],
    explanation: copy.explanation,
    tags: [...copy.tags],
  }
  assertEnglish(
    {
      title: localized.title,
      question: localized.question,
      options: localized.options ?? [],
      solution: localized.solution,
      explanation: localized.explanation,
      tags: localized.tags,
    },
    source.id,
  )
  return localized
}

export function localizeCsQuestion(locale: UiLocale, source: CsQuestion): CsQuestion {
  if (locale !== 'en') return source
  return localizeQuestionEnglish(source)
}

export function localizeCsUnit(locale: UiLocale, source: CsUnit): CsUnit {
  if (locale !== 'en') return source
  const concepts = CS_UNIT_CONCEPTS_EN[source.id]
  if (!concepts) throw new Error(`Missing CS unit English translation: ${source.id}`)
  if (concepts.length !== source.concepts.length) {
    throw new Error(`CS unit concept-count mismatch: ${source.id}`)
  }
  const localized: CsUnit = {
    ...source,
    title: csTeachingCopy(locale, source.title),
    concepts: [...concepts],
    questions: source.questions.map(localizeQuestionEnglish),
  }
  assertEnglish(
    {
      title: localized.title,
      subtitle: localized.subtitle,
      concepts: localized.concepts,
      questions: localized.questions.map(({ title, question, options, solution, explanation, tags }) => ({
        title,
        question,
        options: options ?? [],
        solution,
        explanation,
        tags,
      })),
    },
    source.id,
  )
  return localized
}

export function localizeCsMockExam(locale: UiLocale, source: CsMockExam): CsMockExam {
  if (locale !== 'en') return source
  const copy = CS_EXAM_EN[source.id]
  if (!copy) throw new Error(`Missing CS mock-exam English translation: ${source.id}`)
  const localized: CsMockExam = {
    ...source,
    ...copy,
    questions: source.questions.map(localizeQuestionEnglish),
  }
  assertEnglish({ title: localized.title, subtitle: localized.subtitle, questions: localized.questions }, source.id)
  return localized
}

export function localizeCsSignal(locale: UiLocale, source: CsSolvingSignal): CsSolvingSignal {
  if (locale !== 'en') return source
  const topic = CS_SIGNAL_TOPIC_EN[source.id]
  const copy = CS_SIGNAL_COPY_EN[source.id]
  if (!topic || !copy) throw new Error(`Missing CS solving-signal English translation: ${source.id}`)
  const localized: CsSolvingSignal = {
    ...source,
    topic,
    problemSignal: copy.problemSignal,
    threeSecondRule: copy.threeSecondRule,
    firstStepFormula: englishFormula(source),
    exampleProblem: {
      question: copy.exampleQuestion,
      quickSolve: copy.quickSolve,
    },
  }
  assertEnglish(
    {
      topic: localized.topic,
      problemSignal: localized.problemSignal,
      threeSecondRule: localized.threeSecondRule,
      firstStepFormula: localized.firstStepFormula,
      exampleProblem: localized.exampleProblem,
    },
    source.id,
  )
  return localized
}

export function localizeCsTextbookChapter(locale: UiLocale, source: TextbookChapter): TextbookChapter {
  if (locale !== 'en') return source
  const copy = CS_TEXTBOOK_COPY_EN[source.id]
  if (!copy) throw new Error(`Missing CS textbook English translation: ${source.id}`)
  if (copy.prerequisites.length !== source.prerequisites.length) {
    throw new Error(`CS textbook prerequisite-count mismatch: ${source.id}`)
  }
  if (copy.historicalContext.keyFigures.length !== source.historicalContext.keyFigures.length) {
    throw new Error(`CS textbook key-figure-count mismatch: ${source.id}`)
  }
  if (copy.firstPrinciples.mathematicalDerivations.length !== source.firstPrinciples.mathematicalDerivations.length) {
    throw new Error(`CS textbook derivation-count mismatch: ${source.id}`)
  }
  if (copy.architecturalDeepDive.keySubsystems.length !== source.architecturalDeepDive.keySubsystems.length) {
    throw new Error(`CS textbook subsystem-count mismatch: ${source.id}`)
  }
  if (copy.industrialCaseStudies.length !== source.industrialCaseStudies.length) {
    throw new Error(`CS textbook case-study-count mismatch: ${source.id}`)
  }
  if (copy.deepThinkingQuestions.length !== source.deepThinkingQuestions.length) {
    throw new Error(`CS textbook deep-question-count mismatch: ${source.id}`)
  }
  if (copy.classicReferences.length !== source.classicReferences.length) {
    throw new Error(`CS textbook reference-count mismatch: ${source.id}`)
  }
  const localized: TextbookChapter = {
    ...source,
    ...copy,
    prerequisites: [...copy.prerequisites],
    historicalContext: {
      ...copy.historicalContext,
      keyFigures: [...copy.historicalContext.keyFigures],
    },
    firstPrinciples: {
      ...copy.firstPrinciples,
      mathematicalDerivations: copy.firstPrinciples.mathematicalDerivations.map((item) => ({ ...item })),
    },
    architecturalDeepDive: {
      ...copy.architecturalDeepDive,
      keySubsystems: copy.architecturalDeepDive.keySubsystems.map((item) => ({ ...item })),
    },
    industrialCaseStudies: copy.industrialCaseStudies.map((item) => ({ ...item })),
    deepThinkingQuestions: copy.deepThinkingQuestions.map((item) => ({ ...item })),
    classicReferences: copy.classicReferences.map((item) => ({ ...item })),
  }
  assertEnglish(
    {
      title: localized.title,
      englishTitle: localized.englishTitle,
      prerequisites: localized.prerequisites,
      historicalContext: localized.historicalContext,
      firstPrinciples: localized.firstPrinciples,
      architecturalDeepDive: localized.architecturalDeepDive,
      industrialCaseStudies: localized.industrialCaseStudies,
      deepThinkingQuestions: localized.deepThinkingQuestions,
      classicReferences: localized.classicReferences,
    },
    source.id,
  )
  return localized
}
