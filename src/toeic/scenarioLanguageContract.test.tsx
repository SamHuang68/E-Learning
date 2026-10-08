import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  ScenarioListeningLab,
  type ScenarioListeningItem,
  type ToeicSupportLanguage,
} from './components/ScenarioListeningLab'

type ContractItem = ScenarioListeningItem & { tips: string }

const sourceItem = {
  id: 'language-contract',
  title: '繁中情境',
  titleJa: '日本語シナリオ',
  icon: '🎧',
  targetAccent: 'en-US',
  accentLabel: '美式口音 🇺🇸',
  audioScript: 'English transcript',
  dialogueRoles: { customer: 'Customer', agent: 'Agent' },
  questions: [{
    id: 'q1',
    question: 'English question?',
    questionJa: '日本語の質問？',
    options: ['English option'],
    correctIndex: 0,
    explanationZh: '繁中解析',
    explanationJa: '日本語解説',
  }],
  tips: 'TOEICでは英語教材の要点を確認します。',
} satisfies ContractItem

const englishItem = {
  ...sourceItem,
  title: 'English scenario',
  titleJa: 'English scenario',
  accentLabel: 'American English',
  questions: sourceItem.questions.map((question) => ({
    ...question,
    questionJa: question.question,
    explanationZh: 'English explanation',
    explanationJa: 'English explanation',
  })),
  tips: 'English key terms',
} satisfies ContractItem

function renderScenario(supportLang: ToeicSupportLanguage): string {
  return renderToStaticMarkup(
    <ScenarioListeningLab
      items={[supportLang === 'en' ? englishItem : sourceItem]}
      supportLang={supportLang}
      onEarnXp={() => {}}
      className="scenario-language-test"
      icon="🎧"
      title={{ en: 'English interface', zh: '繁中介面', ja: '日本語介面' }}
      description={{ en: 'English description', zh: '繁中說明', ja: '日本語説明' }}
      tipsKey="tips"
    />,
  )
}

describe('TOEIC 情境實驗室語言邊界', () => {
  it.each([
    ['en', 'en'],
    ['zh', 'zh-Hant'],
    ['ja', 'ja'],
  ] as const)('將 %s 支援介面標示為 %s', (supportLang, expectedLang) => {
    expect(renderScenario(supportLang)).toContain(
      `class="math-lab scenario-language-test" lang="${expectedLang}"`,
    )
  })

  it('繁中介面中的英語教材與題目保留英文語言標記', () => {
    const markup = renderScenario('zh')
    expect(markup).toContain('class="pill-btn active" lang="zh-Hant"')
    expect(markup).toMatch(/<span lang="zh-Hant"[^>]*>美式口音 🇺🇸<\/span>/)
    expect(markup).toContain('<span lang="ja">TOEICでは英語教材の要点を確認します。</span>')
    expect(markup).toContain('<span lang="en"')
    expect(markup).toContain('<h3 lang="en"')
    expect(markup).toContain('<h4 lang="en"')
    expect(markup).toContain('繁中情境')
    expect(markup).toContain('English question?')
    expect(markup).toContain('English option')
  })

  it('日文支援介面保留日文標題與提示，以及繁中口音標籤', () => {
    const markup = renderScenario('ja')
    expect(markup).toContain('class="pill-btn active" lang="ja"')
    expect(markup).toContain('<h4 lang="ja"')
    expect(markup).toMatch(/<span lang="zh-Hant"[^>]*>美式口音 🇺🇸<\/span>/)
    expect(markup).toContain('<span lang="ja">TOEICでは英語教材の要点を確認します。</span>')
    expect(markup).toContain('日本語シナリオ')
    expect(markup).toContain('日本語の質問？')
    expect(markup).toContain('<span lang="en"')
  })

  it('英文化資料將情境、口音與提示正文全部標示為英文', () => {
    const markup = renderScenario('en')
    expect(markup).toContain('class="pill-btn active" lang="en"')
    expect(markup).toMatch(/<span lang="en"[^>]*>American English<\/span>/)
    expect(markup).toContain('<span lang="en">English key terms</span>')
    expect(markup).toContain('English scenario')
  })
})
