import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LocaleContext, type LocaleContextValue } from '../../i18n/i18n'
import { translate } from '../../i18n/messages'
import { AiMatrixTransformerLab } from '../labs/AiMatrixTransformerLab'
import { ArchifyHardwareMap } from '../labs/ArchifyHardwareMap'
import { CacheMappingLab } from '../labs/CacheMappingLab'
import { PipelineHazardLab } from '../labs/PipelineHazardLab'
import { VonNeumannArchitectureLab } from '../labs/VonNeumannArchitectureLab'
import { CsErrorVault } from './CsErrorVault'
import { CsHierarchyTree } from './CsHierarchyTree'
import { CsMockExam } from './CsMockExam'
import { CsPractice } from './CsPractice'
import { CsSignalsView } from './CsSignalsView'
import { CsTextbookReader } from './CsTextbookReader'

const noop = () => {}
const HAN = /[\u3400-\u9fff\uf900-\ufaff]/

const englishLocale: LocaleContextValue = {
  locale: 'en',
  setLocale: noop,
  t: (key, vars) => translate('en', key, vars),
}

const traditionalLocale: LocaleContextValue = {
  locale: 'zh-Hant',
  setLocale: noop,
  t: (key, vars) => translate('zh-Hant', key, vars),
}

function renderWithLocale(context: LocaleContextValue, node: ReactNode): string {
  return renderToStaticMarkup(
    <LocaleContext.Provider value={context}>{node}</LocaleContext.Provider>,
  )
}

type EnglishRenderCase = {
  name: string
  render: () => ReactNode
  sentinels: readonly string[]
}

const englishRenderCases: EnglishRenderCase[] = [
  {
    name: '課綱',
    render: () => <CsHierarchyTree completedQuestions={[]} onNavigate={noop} />,
    sentinels: [
      'Curriculum',
      'Unit 1: Hardware, Software, and Computer-System Layers',
      'Abstraction Layers, System Software &amp; Computer Architecture',
      'Core concepts',
    ],
  },
  {
    name: '讀本',
    render: () => <CsTextbookReader onOpenArchMap={noop} />,
    sentinels: [
      'Foundations of Computer Science and Information Philosophy',
      'English edition shown for the English interface.',
      'Historical Context and Scientific Motivation',
    ],
  },
  {
    name: '練習',
    render: () => <CsPractice onCompleteQuestion={noop} onRecordError={noop} />,
    sentinels: [
      'Unit 1: Hardware, Software, and Computer-System Layers',
      'Hardware, Software, and System Abstraction',
      'In a modern computer-system hierarchy, which contract sits directly between machine code emitted by a high-level-language compiler and the physical circuits inside a CPU microarchitecture?',
    ],
  },
  {
    name: '破題訊號卡',
    render: () => <CsSignalsView />,
    sentinels: [
      'Computer Science Three-Second Signal Cards',
      'What is the 8-bit two’s-complement encoding of -19?',
    ],
  },
  {
    name: '模擬評量',
    render: () => <CsMockExam onRecordExamScore={noop} onEarnXp={noop} />,
    sentinels: [
      'Midterm practice (30 minutes)',
      'The Stored-Program Concept',
      'What is the central innovation of the Von Neumann computer architecture?',
    ],
  },
  {
    name: '錯題弱點本',
    render: () => <CsErrorVault errorQuestionIds={['cs-q-101']} onRemoveError={noop} />,
    sentinels: [
      'CS error vault',
      'Hardware, Software, and System Abstraction',
      'In a modern computer-system hierarchy, which contract sits directly between machine code emitted by a high-level-language compiler and the physical circuits inside a CPU microarchitecture?',
    ],
  },
  {
    name: '馮紐曼實驗室',
    render: () => <VonNeumannArchitectureLab onEarnXp={noop} />,
    sentinels: ['Von Neumann Dataflow and Machine-Cycle Lab'],
  },
  {
    name: '處理器管線實驗室',
    render: () => <PipelineHazardLab onEarnXp={noop} />,
    sentinels: ['Five-Stage CPU Pipeline Hazards and Forwarding Lab'],
  },
  {
    name: '快取映射實驗室',
    render: () => <CacheMappingLab onEarnXp={noop} />,
    sentinels: ['Set-Associative Cache Address-Mapping Lab'],
  },
  {
    name: 'AI 矩陣實驗室',
    render: () => <AiMatrixTransformerLab onEarnXp={noop} />,
    sentinels: ['Modern AI Matrix Acceleration and Transformer Self-Attention Lab'],
  },
  {
    name: '硬體架構圖',
    render: () => <ArchifyHardwareMap onEarnXp={noop} />,
    sentinels: ['Enterprise AI Server Architecture: DGX/HGX Reference Design'],
  },
]

describe('計算機概論次要畫面語系消費端契約', () => {
  it.each(englishRenderCases)('$name 在英文介面呈現英文內容且沒有漢字洩漏', ({ render, sentinels }) => {
    const html = renderWithLocale(englishLocale, render())

    for (const sentinel of sentinels) {
      expect(html).toContain(sentinel)
    }
    expect(html).not.toMatch(HAN)
  })

  it('課綱在繁中介面保留權威繁中單元與核心概念', () => {
    const html = renderWithLocale(
      traditionalLocale,
      <CsHierarchyTree completedQuestions={[]} onNavigate={noop} />,
    )

    expect(html).toContain('單元 1：軟體與硬體之本質定義與電腦系統階層')
    expect(html).toContain('硬體 (Hardware)：指看得見、摸得著之實體電子電路晶片、主機板、電晶體與介面設備，提供運算與訊號儲存的物理基石。')
    expect(html).toMatch(HAN)
  })
})
