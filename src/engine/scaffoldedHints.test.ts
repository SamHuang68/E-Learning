import { describe, it, expect } from 'vitest'
import {
  getHeuristicScaffoldHints,
  requestSocraticHintFromOllama,
  type QuestionContext,
} from './scaffoldedHints'

describe('Scaffolded Hinting & Socratic Tutoring Engine', () => {
  it('generates 4 progressive scaffold levels for math context', () => {
    const mathCtx: QuestionContext = {
      id: 'math-linear-1',
      track: 'math',
      prompt: '解方程式 2x + 4 = 12，求 x 的值。',
      topic: '一元一次方程式',
      keyFormulaOrSignal: '等量公理：兩邊同減 4，再同除以 2。',
      solutionSteps: ['2x = 12 - 4 = 8', 'x = 8 / 2 = 4'],
      explanation: '移項後 2x = 8，得 x = 4。',
    }

    const hints = getHeuristicScaffoldHints(mathCtx)
    expect(hints.length).toBe(4)
    expect(hints[0].level).toBe(1)
    expect(hints[0].content).toContain('等量公理')
    expect(hints[1].level).toBe(2)
    expect(hints[1].content).toContain('第一步：2x = 12 - 4 = 8')
    expect(hints[2].level).toBe(3)
    expect(hints[3].level).toBe(4)
    expect(hints[3].content).toContain('移項後 2x = 8')
  })

  it('generates 4 progressive scaffold levels for Japanese grammar context', () => {
    const jaCtx: QuestionContext = {
      id: 'ja-teoku-1',
      track: 'ja',
      prompt: '旅行の前に切符を＿＿＿＿おきます。',
      topic: '補助動詞〜ておく',
      keyFormulaOrSignal: '動作訊號：旅行前的事前準備',
      solutionSteps: ['切符を買う ➜ て形：買って', '買っておきます'],
    }

    const hints = getHeuristicScaffoldHints(jaCtx)
    expect(hints.length).toBe(4)
    expect(hints[0].content).toContain('事前準備')
    expect(hints[2].content).toContain('会議の前に')
  })

  it('gracefully falls back to heuristic hint when local Ollama is offline', async () => {
    const ctx: QuestionContext = {
      id: 'test-1',
      track: 'en',
      prompt: 'The sales report was submitted ___ deadline.',
      topic: 'Prepositions',
    }

    // 當指向不存在的本地端點時，應在 timeout 或拒絕連線後無縫降級回傳 Level 1 提示
    const hint = await requestSocraticHintFromOllama(ctx, 1, {
      endpoint: 'http://127.0.0.1:59999', // 離線模擬端口
      model: 'llama3.3',
      timeoutMs: 150,
    })

    expect(hint).toBeTruthy()
    expect(typeof hint).toBe('string')
    expect(hint).toContain('Prepositions')
  })
})
