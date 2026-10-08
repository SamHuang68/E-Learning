import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ChemistryApp } from '../../chemistry/ChemistryApp'
import { ChemistryMockExam } from '../../chemistry/components/ChemistryMockExam'
import { MockExam, type MockExamQuestion } from '../../components/MockExam'
import { PlacementTest } from '../../components/PlacementTest'
import { ScenarioPlayer } from '../../components/ScenarioPlayer'
import { SpeakingLab } from '../../components/SpeakingLab'
import { formatSpeakingMessage } from '../../components/speakingCopy'
import { CsApp } from '../../cs/CsApp'
import { LocaleContext, type LocaleContextValue } from '../../i18n/i18n'
import { translate } from '../../i18n/messages'
import { MathMockExam } from '../../math/components/MathMockExam'
import { PhysicsApp } from '../../physics/PhysicsApp'
import { PhysicsMockExam } from '../../physics/components/PhysicsMockExam'
import { PhonicsLab } from '../../toeic/components/PhonicsLab'
import { formatPhonicsListenFeedback } from '../../toeic/components/phonicsFeedback'
import { ToeicPractice } from '../../toeic/components/ToeicPractice'
import { toeicCertificates } from '../../toeic/data/certificates'
import aobaAppSource from '../../aoba/AobaApp.tsx?raw'
import chemistryAppSource from '../../chemistry/ChemistryApp.tsx?raw'
import mockExamSource from '../../components/MockExam.tsx?raw'
import placementSource from '../../components/PlacementTest.tsx?raw'
import scenarioSource from '../../components/ScenarioPlayer.tsx?raw'
import physicsAppSource from '../../physics/PhysicsApp.tsx?raw'
import phonicsSource from '../../toeic/components/PhonicsLab.tsx?raw'

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

function renderEnglish(node: ReactNode): string {
  return renderWithLocale(englishLocale, node)
}

const mockQuestion: MockExamQuestion = {
  id: 'cross-locale',
  prompt: '日本語の問題',
  choices: ['A', 'B'],
  answer: 'A',
  tag: 'grammar',
}

describe('英文介面的容器語言契約', () => {
  it('英文 UI 與日語內容語言各自維持正確契約', () => {
    const scenario = renderEnglish(
      <ScenarioPlayer track="ja" scenarios={[]} onComplete={noop} />,
    )
    const speaking = renderEnglish(
      <SpeakingLab lang="ja" prompts={[]} onComplete={noop} />,
    )
    const mock = renderEnglish(
      <MockExam lang="ja" questions={[mockQuestion]} onComplete={noop} />,
    )
    const placement = renderEnglish(
      <PlacementTest lang="ja" onComplete={noop} onExit={noop} />,
    )

    expect(scenario).toContain('class="practice-view scenario-player" lang="en"')
    expect(speaking).toContain('class="practice-view speaking-lab" lang="en"')
    expect(scenario).toContain('No scenario scripts available')
    expect(speaking).toContain('No shadowing prompts available')
    expect(mock).toContain('Japanese Short Mock Exam')
    expect(placement).toContain('Japanese Placement Test')
  })

  it('繁中 UI 與英語內容語言各自維持正確契約', () => {
    const scenario = renderWithLocale(
      traditionalLocale,
      <ScenarioPlayer track="en" scenarios={[]} onComplete={noop} />,
    )
    const speaking = renderWithLocale(
      traditionalLocale,
      <SpeakingLab lang="en" prompts={[]} onComplete={noop} />,
    )
    const mock = renderWithLocale(
      traditionalLocale,
      <MockExam lang="en" questions={[mockQuestion]} onComplete={noop} />,
    )
    const placement = renderWithLocale(
      traditionalLocale,
      <PlacementTest lang="en" onComplete={noop} onExit={noop} />,
    )

    expect(scenario).toContain('class="practice-view scenario-player" lang="zh-Hant"')
    expect(speaking).toContain('class="practice-view speaking-lab" lang="zh-Hant"')
    expect(scenario).toContain('沒有情境腳本')
    expect(speaking).toContain('沒有跟讀句')
    expect(mock).toContain('英語短版模擬測驗')
    expect(placement).toContain('英語分級測驗')
  })

  it('跟讀狀態只保存語系中立代碼，畫面文案依目前語系導出', () => {
    expect(formatSpeakingMessage('en', 'unsupported')).toContain('does not support recording')
    expect(formatSpeakingMessage('zh-Hant', 'unsupported')).toContain('不支援錄音')
    expect(formatSpeakingMessage('en', 'microphone-error')).toContain('could not be enabled')
    expect(formatSpeakingMessage('zh-Hant', 'microphone-error')).toContain('無法啟用麥克風')
  })

  it('互動作答狀態只保存穩定文字或選項索引', () => {
    expect(scenarioSource).toContain('useState<string | null>(null)')
    expect(scenarioSource).not.toContain('useState<ScenarioOption | null>')
    expect(mockExamSource).toContain('useState<Record<string, number>>({})')
    expect(placementSource).toContain('useState<Record<string, number>>({})')
    expect(placementSource).toContain('disabled={answered === undefined}')
    expect(placementSource).not.toContain('disabled={!answered}')
  })

  it('Aoba 互動頁面使用精確英文支援資料並保留日語目標內容', () => {
    expect(aobaAppSource).toContain('localizeJaScenarios(locale)')
    expect(aobaAppSource).toContain('localizeJaMockQuestions(locale)')
    expect(aobaAppSource).toContain('localizeJaPlacementQuestions(locale)')
    expect(aobaAppSource).toContain('localizeJaPractice(currentPack, locale)')
    expect(aobaAppSource).toContain('scenarios={localizedScenarios}')
    expect(aobaAppSource).toContain('questions={localizedMockQuestions}')
    expect(aobaAppSource).toContain('questions={localizedPlacementQuestions}')
    expect(aobaAppSource).toContain('localizedSpeakingPack.vocab')
  })

  it('TOEIC、數學、物理與化學練習容器沿用目前英文語系', () => {
    const phonics = renderEnglish(<PhonicsLab mastered={[]} onMaster={noop} />)
    const practice = renderEnglish(
      <ToeicPractice
        kind="vocab"
        certificateId={toeicCertificates[0].id}
        unit={toeicCertificates[0].units[0]}
        mode="learn"
        onBack={noop}
        onProgress={noop}
      />,
    )
    const mathMock = renderEnglish(<MathMockExam onExit={noop} />)
    const physicsMock = renderEnglish(<PhysicsMockExam onSaveScore={noop} />)
    const chemistryMock = renderEnglish(<ChemistryMockExam onSaveScore={noop} />)

    expect(phonics).toContain('class="kana-lab phonics-lab" lang="en"')
    expect(practice).toContain('class="flash-meaning" lang="en"')
    expect(mathMock).toContain('class="math-mock-shell" lang="en"')
    expect(physicsMock).toContain('class="math-mock-shell physics-mock-shell" lang="en"')
    expect(chemistryMock).toContain('class="math-mock-shell chemistry-mock-shell" lang="en"')
  })

  it('Phonics 作答回饋與互動 state 依目前語系導出', () => {
    const correct = formatPhonicsListenFeedback('en', 'correct', 'office')
    const wrong = formatPhonicsListenFeedback('en', 'wrong', 'office')

    expect(correct).toBe('Correct! Correct word: office')
    expect(wrong).toBe('Not quite. Correct word: office')
    expect(`${correct} ${wrong}`).not.toMatch(/[\u3400-\u9fff\uf900-\ufaff]/)
    expect(phonicsSource).toContain('answerId: string')
    expect(phonicsSource).toContain('optionIds: string[]')
    expect(phonicsSource).toContain('accentCode: string')
    expect(phonicsSource).not.toContain('answer: PhonicsItem')
    expect(phonicsSource).not.toContain('accent: ToeicAccent')
  })

  it('計算機概論主內容與 STEM 實驗室不會覆寫英文文件語言', () => {
    const cs = renderEnglish(<CsApp onBackHub={noop} onSwitchLang={noop} />)
    const physics = renderEnglish(<PhysicsApp onBackHub={noop} onSwitchLang={noop} />)
    const chemistry = renderEnglish(<ChemistryApp onBackHub={noop} onSwitchLang={noop} />)

    expect(cs).toContain('id="main-content" lang="en"')
    expect(physics).toContain('PHYSICS')
    expect(chemistry).toContain('CHEMISTRY')
    expect(physics).not.toMatch(HAN)
    expect(chemistry).not.toMatch(HAN)
    expect(physicsAppSource).toContain('className="physics-labs-showcase" lang={locale}')
    expect(chemistryAppSource).toContain('className="chemistry-labs-showcase" lang={locale}')
  })
})
